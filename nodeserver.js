var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');
var port = process.env.PORT || 25565;

console.log(path.join(__dirname, "/webpage"));

connect().use(serveStatic(path.join(__dirname, "/webpage"))).listen(port, function(){
    console.log('Server running on ' + port);
});
