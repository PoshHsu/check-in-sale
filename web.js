var express  = require('express'),
    app = express.createServer(express.logger()),
    DB_URL = "mongodb://heroku_app7984633:ljtiqmuc5so4cvc057vf98vvcq@ds039007.mongolab.com:39007/heroku_app7984633",
    mongoose = require("mongoose"),
    QRCODE_TABLE = "qrcode";

mongoose.connect(DB_URL);

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
    //require("./db.js").insertQRCode(request.query);
});

app.post('/db/insert/qrcode', function(request, response) {
    //require("./db.js").insertQRCode(request.body);
});

app.post('/db/query/qrcode', function(request, response) {
    console.log("==1==");
    //var place = require("./db.js").queryQRCode(request.body);
    console.log("==2==");
    console.log(place);
    console.log("==3==");
    response.send(place);
    console.log("==4==");
     mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
       //console.log(err);
         console.log(request.body.pid);
       collection.findOne({pid:qrcode.pid}, function(err,data){
         console.log(data);
         response.send(data);
       });

    console.log("==4==");
});
});

app.get('/channel.html', function(request, response) {
      response.sendfile(__dirname+'/pages/channel.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
      console.log("Listening on " + port);
});
