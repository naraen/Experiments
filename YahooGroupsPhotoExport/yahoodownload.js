"use strict"

var webdriverio = require('webdriverio'),
    fs=require('fs'),
    cheerio=require('cheerio');
    
    
var albumHome='https://groups.yahoo.com/neo/groups/<<groupName>>/photos/albums',
    baseUrl='https://groups.yahoo.com/neo/groups/<<groupName>/photos/albums/',
    userName='<userName>',
    password='<password>',
    botOrd=process.argv[2], //sequence # of this bot.  This bot only downloads photos in the album it is responsible for
    totalBots=process.argv[3];// of total bots.  Used by the photo download function to partition the list of albums

var client, 
    options = { desiredCapabilities: { browserName: 'chrome' }};
 
var albumIds=[];

function scrollToEnd(scrollCount){
    return function(){
        for(var idx=1;idx<scrollCount;idx++){
            client
                .scroll(0,idx*1000)
                .pause(1000)
        }
    }
}
 
function saveAlbumHomeHtml(){
    //Navigates to each album & saves the HTML.  Exports the download URLs for each photo to JSON.
    client.getHTML('.albums', function(err, html) {
        fs.writeFileSync('./albums.html', html, {'encoding':'utf8'});
        
        var $=cheerio.load(html);

        var desc=$('div.thumb-desc>span');
        for(var idx=0;idx<desc.length;idx++){
            var info=desc[idx];
            albumIds.push({
                id:info.attribs.id,
                desc:info.children[0].data.replace('Preview Album, ','').replace(/\r\n[\s]*/g,' '),
                childLength:info.children.length
            });
        }
        
        var selectors={
            title:'div.thumb-title>a',
            meta:'div.thumb-meta',
            count:'div.thumb-count'
        };
        for(var prop in selectors){
            var elements=$(selectors[prop]);
            for(var e=0;e<elements.length;e++){
                var elem=elements[e];
                albumIds[e][prop]=elem.children[0].data.replace(/\r\n[\s]*/g,'').replace(' photos','');
            }
        };
        fs.writeFileSync('./albums.json', JSON.stringify(albumIds,null,2), {'encoding':'utf8'});
    })
    
}

function loadAlbumIds(){
    albumIds=require('./albums.json');
}

function saveAlbumData(){
    //Save the album HTML and exports name + url of albums to JSON.
    for(var idx=0;idx<albumIds.length;idx++){
        (function(thisIdx){
            var album=albumIds[thisIdx],
                url =baseUrl + album.id,
                photoIds=[],
                jsonFile='./data/album' + album.id + '.json',
                htmlFile='./data/album' + album.id + '.html';
                
            
            
            //don't attempt to download albums that we already have info for.
            if(fs.existsSync(htmlFile) && fs.existsSync(jsonFile) && album.count == require(jsonFile).length) {
                return;
            }
            
            //check if file exists
            if(album.count == require(jsonFile).length){
                console.log('invalid', [album.id, fs.existsSync(htmlFile), fs.existsSync(jsonFile), album.count, require(jsonFile).length ]);
            }
            
            client.url(url)
                .call(scrollToEnd((album.count>400)?40:26)) //Play with # of times to scroll based on your setup. 
                .getHTML('.yg-thumbnail-placeholder', function(err, html) {
                    console.log(thisIdx, album.id, err);
                    fs.writeFileSync(htmlFile, html, {'encoding':'utf8'});
                    
                    var $=cheerio.load(html);

                    var anchors=$('div.action-bar-comment>a');
                    for(var idy=0;idy<anchors.length;idy++){
                        var url=anchors[idy].attribs.href;
                        photoIds.push(url);
                    }

                    fs.writeFileSync(jsonFile, JSON.stringify(photoIds,null,2), {'encoding':'utf8'});
                    
                    //validate that the # of photo urls we downloaded are correct.
                    if(fs.existsSync(htmlFile) && fs.existsSync(jsonFile) && album.count == photoIds.length ) {
                        console.log('valid', [album.id, fs.existsSync(htmlFile), fs.existsSync(jsonFile), album.count, photoIds.length ]);
                        return;
                    }
                    
                    console.log('Not all urls were downloaded', [album.id, fs.existsSync(htmlFile), fs.existsSync(jsonFile), album.count, photoIds.length ]);
                    
                })
        })(idx);    
    };
}

function downloadFiles(){
    for(var idx=0;idx<73;idx++){
        (function(thisIdx){
            //Download only the albums that this bot is responsible for.
            if(idx%totalBots!=botOrd) return;
        
            var album=albumIds[thisIdx],
                jsonFile='./data/album' + album.id + '.json',
                folderName='/data/' + album.id,
                photoIds=require(jsonFile);

                photoIds.forEach(function(url){
                    var nameIdx=url.indexOf('name'),
                        queryParam=url.indexOf('?'),
                        fileName=url.substring(nameIdx+5,queryParam),
                        fetchUrl=url.replace('name/', 'name/' + album.id + '__' + thisIdx + '__'),
                        localFileName='C:/Users/Naraen/Downloads/' + album.id + '__' + thisIdx + '__' + unescape(fileName);

                    
                    if(fs.existsSync(localFileName)) return;
                    
                    //console.log(localFileName);
                    
                    client
                        .url(fetchUrl, function(err, response){
                            if(err) console.log(thisIdx,err);
                        })
                        //.pause(100);
                });
        })(idx);
    }
}

var client=webdriverio
    .remote(options)
    .init()
    .url(albumHome)
    .waitFor('#login-username')
    .setValue('#login-username', userName)
    .setValue('#login-passwd', password)
    .click('#login-signin')
    .pause(1000) //wait for login to complete
    .getAttribute('.albums', 'data-total-count', function(err, attr) {
        console.log(attr); //find out how many albums are present
    })
    .call(scrollToEnd(26)) //scroll 26 times.  Might have to tweak this based on # of albums
    .call(saveAlbumHomeHtml) 
    .call(loadAlbumIds) //from the JSON
    .call(saveAlbumData) 
    .call(downloadFiles)