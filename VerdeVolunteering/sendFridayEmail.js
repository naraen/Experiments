var nodemailer = require('nodemailer'),
	config=require('./config.js'),
    fs=require('fs'),
    moment=require('moment'),
    parse=require('csv-parse'),
    handlebars=require('mustache');


//The below date is meant to be a Friday.
//It sends reminder about what's up for the week following this Friday.

var emailDate='2014-11-14T00:00:00Z'; //TODO: use commandline parameters to get this value.

main(emailDate);
function main(dt) {
    var fileCount= 4,
        transporter=null,
        jsonData={},
        fileNames = {
            sound: './assets/soundOfTheWeek',
            foodFlower: './assets/FoodAndFlowerSchedule',
            volunteer: './assets/Volunteers',
            parents: './assets/VerdeParents'
        };

    ['sound','foodFlower','volunteer', 'parents'].forEach(readCsvToObject);

    function readCsvToObject(dataType) {
        var input = fs.readFileSync(fileNames[dataType] + '.csv');

        parse(input, {columns: true}, function (err, output) {
            if (err) {
                console.log(err)
                return;
            }

            jsonData[dataType]= output.filter(function (item) {
                if(!item.dt) return true;
                var emailDate=moment(item.dt)
                    .startOf('week')//find previous Sunday.
                    .subtract(2,'days'); //2 days before would
                return moment(dt).diff(emailDate, 'day') == 0;
            });
            fileCount--;
            if(fileCount===0) loadedAllData();

        });
    }

    function loadedAllData() {
        createTransporter();

        //TODO: good candidate for chaining.  Learn how to make that work.
        sendEmail(
            getEmailOptions(
                generateMessageParts(
                    getPreppedDataForDisplay()
                )
            )
        )
    }

    function getPreppedDataForDisplay(){
        return {
            dt:moment(dt)
                .endOf('week') //following Saturday
                .add(2, 'days')//get the following Monday
                .format('MMM Do'),
            sound:jsonData.sound[0].sound,
            volunteer:jsonData
                .volunteer.concat(jsonData.foodFlower)
                .sort(function(a,b) {
                        return moment(a.dt).diff(moment(b.dt), 'days');
                    })
                .map(function(item){
                        item.dt=moment(item.dt).format('ddd, DD MMM')
                        return item;
                    })
        };
    }

    function generateMessageParts(info) {
        var msgBody={};
        fs.writeFileSync('./out/Info.json', JSON.stringify(info,null,2));

        var tmplt=fs.readFileSync('./assets/htmlTemplate.html', {encoding:'utf-8'});
        msgBody.htmlBody=handlebars.render(tmplt, info);
        fs.writeFileSync('./out/htmlBody.html', msgBody.htmlBody);

        tmplt=fs.readFileSync('./assets/textTemplate.txt', {encoding:'utf-8'});
        msgBody.textBody=handlebars.render(tmplt, info);
        fs.writeFileSync('./out/textBody.txt', msgBody.textBody);

        msgBody.subject='Verde week of ' + info.dt + ' Volunteers & sound of the week'
        return msgBody;
    }

    function getEmailOptions(msgParts) {
        var forReal = config.sendMode === 'real';

        var mailOptions = {
            headers: JSON.stringify(config.headers),
            from: '<<from email address>>',
            to: !forReal ? ['<<test to email address']
                    : jsonData.parents.map(function (parent) {
                        return parent['address'] //TODO: Learn how to send name along with address
                    }),
            cc: !forReal ? null : config.teacherEmail,
            subject: msgParts.subject,
            text: msgParts.textBody,
            html: msgParts.htmlBody
        };
        fs.writeFileSync('./out/mailOptions.txt', JSON.stringify(mailOptions,null,2));
        return mailOptions;
    }

    function createTransporter(){
        // create reusable transporter object using SMTP transport
        transporter = nodemailer.createTransport({
            service: config.serviceName,
            auth: {
                user: config.userName,
                pass: config.password
            }
        });
    }

    function sendEmail(mailOptions) {
        return;
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    }
}