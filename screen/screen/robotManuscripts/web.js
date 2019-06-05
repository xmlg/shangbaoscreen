// 引入依赖	
var express = require('express'); 

// 建立 express 实例
var app = express();
var port = 6688;

app.use(express.static(__dirname));

app.get('/', function(req, res, next) {

    res.sendFile(req, res, 'index.html');
}); 
app.listen(port, function(req, res) {
    console.log('app is running at port '+port);
});