var express  = require('express'),
    app = express.createServer(express.logger());

app.use(express.static(__dirname + "/assert"));
app.use(express.bodyParser());
app.get('/admin/parse', function(request, response) {
      require("./parse.js").run();
      response.send('Hello World!');
});



app.get('/', function(request, response) {
//      response.send('Hello World!');
      response.sendfile(__dirname+'/pages/index.html');
});

app.get('/mobile/*', function(request, response) {
      response.sendfile(__dirname+'/assert/mobile_index.html');
});

app.get('/admin/qrcode', function(request, response) {
      console.log(response);
      console.log(request);
      response.sendfile(__dirname+'/assert/admin_qrcode.html');
});

app.get('/db/insert/qrcode', function(request, response) {
    require("./db.js").insertQRCode(request.query);
});

app.post('/db/insert/qrcode', function(request, response) {
    require("./db.js").insertQRCode(request.body);
});

app.post('/db/query/qrcode', function(request, response) {
    var place = require("./db.js").queryQRCode(request.body);
    console.log(place);
    response.send(place);
});

app.get('/channel.html', function(request, response) {
      response.sendfile(__dirname+'/pages/channel.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
      console.log("Listening on " + port);
});
