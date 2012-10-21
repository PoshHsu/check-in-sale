var express  = require('express'),
    app = express.createServer(express.logger()),
    request = require('request'),
    CLOUDANT_URL = process.env.CLOUDANT_URL,
    DB_URL = CLOUDANT_URL + '/check-in-sale';

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
      response.sendfile(__dirname+'/asset/s_login.html');
});

app.get('/mobile/checkin/*', function(request, response) {
      response.sendfile(__dirname+'/asset/mobile_index.html');
});

app.get('/admin/qrcode', function(request, response) {
      response.sendfile(__dirname+'/asset/admin_qrcode.html');
});

app.get('/db/insert/qrcode', function(request, response) {
     // mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
     //   collection.insert(qrcode);
     //   response.send(1);
     // });
});


app.get('/website/yahoo', function(request, response) {
      response.sendfile(__dirname+'/asset/redir.html');
});

app.post('/db/insert/qrcode', function(request, response) {
     // mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
     //   collection.insert(request.body);
     //   response.send(1);
     // });
});

app.post('/db/query/qrcode', function(request, response) {
    // mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
    //    collection.findOne({pid:request.body.pid}, function(err,data){
    //      response.send(data);
    //    });
    // });
});

app.get('/db/query/activity/:aid', function(request, response) {
    var _aid = request.params.aid,
        _data;
    if(_aid == 2){
        _data = {
            pid:354651051295822,
            lat:"25.07698687147",
            long:"121.23201566872",
            name:"2012 Yahoo! Taiwan Open Hack ",
            pic_link:"http://checkinsale.com/image/yahoo_dm.png",
            slogan:"Yahoo Open Hack 號召絕頂高手，一戰成名",
            web_link:"http://checkinsale.com/website/yahoo",
            link_name:"Yahoo Open Hack官方網站"
        }
    }
    else if (_aid == 1){
        _data = {
            pid:354651051295822,
            name:"2012 Yahoo! Taiwan Open Hack ",
            pic_link:"http://checkinsale.com/image/yahoo_dm2.jpeg",
            slogan:"YAHOO! 產品開發中心全球菁英募集中。",
            web_link:"http://tw.info.yahoo.com/careers/",
            link_name:"Yahoo! 徵才網站"
        }
    };
    response.send(_data);
});

app.get('/channel.html', function(request, response) {
      response.sendfile(__dirname+'/pages/channel.html');
});

var db_helper = {
  'post_doc': function(req, res) {
    request.post({ url: DB_URL, json: req.body }).pipe(res);
  }
};

/**
 Add a user by following json:

 {
   'fb-user-id': babababa,
   'check-in-points': [
     {
       'name': 'foo', 'fb-place-id': balabala
     },
     {
       'name': 'bar', 'fb-place-id': labalaba
     }
   ],
   'joined-at': [2012, 10, 20]
 }
 */
app.post('/users/add', function(req, res) {
  db_helper.post_doc(req, res);
});

app.post('/users/update', function(req, res) {
  request.put({ url: DB_URL + '/' + req.body._id, json: req.body }).pipe(res);
});

/**
 Get a user by fb-user-id
 */
// FIXME: looks like \" and \" are workarounds
app.get('/users/:fbid', function(req, res) {
  request.get({ url: DB_URL + '/_design/demo/_view/users?key=\"' + req.params.fbid + '\"'}).pipe(res);
});

/**
 {
   'checkInPoint': {
     'fbPlaceId':
     'name':
   },
   'creator': fb-user-id,
   'description'
   'slogan'
   'session': {
     'start':
     'end':
   },
   'webTitle':
   'webURL':
 }
 */
app.post('/promotions/add', function(req, res) {
  request.post({url: DB_URL, json: req.body }).pipe(res);
});

app.get('/promotions/:id', function(req, res) {
  request.get({ url: DB_URL + '/_design/demo/_view/promotions-by-id?key=\"' + req.params.id + '\"'}).pipe(res);
});

app.get('/promotions/createdBy/:fbid', function(req, res) {
  request.get({ url: DB_URL + '/_design/demo/_view/promotions?key=\"' + req.params.fbid + '\"'}).pipe(res);
});

app.post('/promotions/update', function(req, res) {
  request.put({ url: DB_URL + '/' + req.body._id, json: req.body }).pipe(res);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
      console.log("Listening on " + port);
});
