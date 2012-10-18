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

//add by squall
//upload test start
app.get('/upload', function(req, res) {
	res.write('<html><body><form method="post" enctype="multipart/form-data" action="/fileUpload">'
	+'<input type="file" name="uploadingFile"><br>'
	+'<input type="submit">'
	+'</form></body></html>');
	res.end();
});

var fs = require('fs');
app.post('/fileUpload', function(req, res) {
	console.log('start fileUpload function');
    var uploadedFile = req.files.uploadingFile;
    console.log('uploadFile:'+uploadedFile);
        var tmpPath = uploadedFile.path;
    console.log('tmpPath:'+tmpPath);    
        var targetPath = './' + uploadedFile.name;

        fs.rename(tmpPath, targetPath, function(err) {
            if (err) throw err;
               fs.unlink(tmpPath, function() {
                   
                   console.log('File Uploaded to ' + targetPath + ' - ' + uploadedFile.size + ' bytes');
            });
        });
    res.send('file upload is done.');
    res.end();
});

/* add by squall end */


app.get('/', function(request, response) {
//      response.send('Hello World!');
      response.sendfile(__dirname+'/pages/index.html');
});

app.get('/mobile/checkin/*', function(request, response) {
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

app.get('/db/query/activity/*', function(request, response) {
    var _data = { pid:142800992448822,
    lat:"25.07698687147",
    long:"121.23201566872",
    name:"桃園機場",
    pic_link:"http://farm4.static.flickr.com/3063/2598835973_7b2e14133e_o.jpg",
    slogan:"台北飛日本機票雄獅半價起"
};
response.send(_data);
});

app.get('/channel.html', function(request, response) {
      response.sendfile(__dirname+'/pages/channel.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
      console.log("Listening on " + port);
});
