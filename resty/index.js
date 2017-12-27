(function() {
  "use strict";

  //initialize express
  //parse url into different parts
  /*** 
   * Get verb
   * Get path
   * Get break path into resource + id combination
   * Save file at the path
   * Retrieve file at the path
  */
  //save data into file

  var express = require('express');
  var fs = require('fs');
  var app = express();
  var bodyParser = require('body-parser');
  var basePath = '/Users/naraen/Experiments/scratch';

  var getCanonicalPath = ( req ) => req.path.replace(/\/$/, '');
  var getPathParts = ( req ) => req.path.replace(/\/$/, '').replace(/^\//, '').split('/');
  

  app.use(bodyParser.json());
  app.get('/health', ( req, res, next ) => {
    res.status(200).send({ serverTime : new Date().toISOString()});
    return;
  });

  app.put('/health', ( req, res ) => {
    res.status( 501 ).send({ error : 'Not supported' })
  });

  app.post('/health', ( req, res ) => {
    res.status( 501 ).send({ error : 'Not supported' })
  });

  app.post('/health', ( req, res ) => {
    res.status( 501 ).send({ error : 'Not supported' })
  });

  app.get('*', (req, res, next) => {
    var filePath = getCanonicalPath( req );
    var pathParts = getPathParts( req );

    //filepath has odd # of parts then dir listing
    if ( pathParts.length % 2 === 1) {
      fs.readdir(basePath + filePath, { encoding : 'utf-8'}, (err, content) => {
        res.status( 200 ).send( content.map( ( file ) => {
          return { _id : file.replace('.json', '') };
        }) );
      });
      return;
    }

    fs.readFile(basePath + filePath + '.json', { encoding : 'utf-8'}, (err, content) => {
      if ( err ) {
        console.log('error occured', err);
        res.status(500).send({ error:  err.message });
        return;
      }

      res.status(200).send( JSON.parse(content) );  
    });
  });

  app.put('*',(req, res, next) => {
    var filePath = getCanonicalPath(req);
    var pathParts = getPathParts(req);
    var payload = req.body;

    console.log(64, pathParts, pathParts.length );
    if ( pathParts.length  % 2 === 1 ) {
      return res.status(404).send({ error : 'no id provided for'} );
    }

    //TODO: merge props instead of overwriting the entire object

    fs.writeFile( basePath + filePath + '.json', JSON.stringify( payload, null, 2 ), ( err ) => {
      if ( err ) {
        console.log('error occured', err);
        res.status(500).send({ error : err.message })
        return;
      }
      res.status(200).send(  { status : 'success'} );
    });

  });

  app.delete('*', ( req, res, next ) => {
    var filePath = getCanonicalPath( req );
    var pathParts = getPathParts( req );
    fs.unlink(basePath + filePath + '.json', ( err ) => {
      res.status( 200 ).send( { status : err ? err.message : 'success' } );
    });
  });

  app.post('*', (req, res, next) => {
    var filePath = getCanonicalPath(req);

    var pathParts = getPathParts(req);
    var payload = req.body;
console.log(83, payload);
    if ( fs.existsSync( basePath + filePath + '.json') ) {
      res.status(409).send({ error : 'Resource already exists' });
      return;
    }

    if ( pathParts.length % 2 === 1 ) {
      //in future generate an id
      return res.status(501).send( { error : 'Saving resource without id is not supported' } );
    }

    fs.writeFile( basePath + filePath + '.json', JSON.stringify( payload, null, 2 ), ( err ) => {
      if ( err ) {
        console.log('error occured', err);
        res.status(500).send({ error : err.message })
        return;
      }
      res.status(200).send(  { status : 'success'} );
    });

  });

  app.listen(8080, function() {
    console.log('arguments', arguments);
  });
}());
