var express  = require('express'),
    app = express.createServer(express.logger()),
    DB_URL = "mongodb://heroku_app7984633:ljtiqmuc5so4cvc057vf98vvcq@ds039007.mongolab.com:39007/heroku_app7984633",
    mongoose = require("mongoose"),
    QRCODE_TABLE = "qrcode";

mongoose.connect(DB_URL);

app.use(express.static(__dirname + "/asset"));
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
      response.sendfile(__dirname+'/asset/mobile_index.html');
});

app.get('/admin/qrcode', function(request, response) {
      console.log(response);
      console.log(request);
      response.sendfile(__dirname+'/asset/admin_qrcode.html');
});

app.get('/db/insert/qrcode', function(request, response) {
     mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
       collection.insert(qrcode);
       response.send(1);
     });
});

app.post('/db/insert/qrcode', function(request, response) {
     mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
       collection.insert(request.body);
       response.send(1);
     });
});

app.post('/db/query/qrcode', function(request, response) {
    mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
       collection.findOne({pid:request.body.pid}, function(err,data){
         response.send(data);
       });
    });
});

app.get('/channel.html', function(request, response) {
      response.sendfile(__dirname+'/pages/channel.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
      console.log("Listening on " + port);
});
