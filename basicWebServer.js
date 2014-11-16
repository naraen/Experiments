var http = require('http'),
	fs = require('fs');

http.createServer(function (req, res) {
  var fileName='./public' + req.url;
  
  fs.exists(fileName, function (exists) {
		if(!exists){
			console.log('file does not exist', fileName);
			res.writeHead(404);
			res.end();
			return;
		}
		fs.readFile(fileName, {encoding:'UTF-8'}, function(err, data){
			res.end(data);
		})
	});
}).listen(8080);