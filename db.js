var DB_URL = "mongodb://heroku_app7984633:ljtiqmuc5so4cvc057vf98vvcq@ds039007.mongolab.com:39007/heroku_app7984633",
    mongoose = require("mongoose"),
    QRCODE_TABLE = "qrcode";

mongoose.connect(DB_URL);

exports.insertQRCode = function(qrcode){
    console.log("insertQRCode : " + qrcode);

     mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
       //console.log(err);
       collection.insert(qrcode);
     });
};

exports.queryQRCode = function(qrcode){
     mongoose.connection.db.collection(QRCODE_TABLE, function(err, collection) {
       //console.log(err);
       var cursor = collection.findOne({pid:qrcode.pid});
       console.log(cursor);
       return cursor;
     });
};
