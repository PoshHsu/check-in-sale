function getQRCode(content, width, height){
    // 預設寬高為 120x120
    width = !!width ? width : 120 ;
    height = !!height ? height : 120;
    // 編碼
    content = encodeURIComponent(content);
    return 'http://chart.apis.google.com/chart?cht=qr&chl=' + content + '&chs=' + width + 'x' + height;
}
var queryQRcode = function(pid, scallback, fcallback){
    //var  _host = "http://checkinsale.com",
    //var _host = "http://checkinsale.com",
    var _host = "http://localhost:5000",
    _query = "/db/query/activity/",
    _config = {
        url:_host + _query,
        data:pid,
        dataType:"json",
        type:"get"
    };
    $.ajax(_config).done(scallback).fail(fcallback);
};


var wait_to_delete_queryQRCode = function(pid, success_callback, fail_callback){
    var data = {pid:pid};
    $.ajax({
        type:"post",
        url:"http://carpo.terrence-tang.com/db/query/qrcode",
        data:{pid:pid},
        dataType:"json",
        timeout:5000
    }).done(function(res){
        success_callback(res);
    });
};

var writeUserIntoDb = function(result){
    FBPlugs.getUser(function(res){
        var user = {
            qid:null,
            cid:null,
            uid:res.id,
            name:res.name,
            gender:res.gender,
            birthday:res.birthday,
            like:[],
            page_id:result.id,
            ctime:new Date().getTime()
        };


        $.ajax({
            type:"post",
            url:"http://carpo.terrence-tang.com/db/insert/checkin",
            data:{pid:pid},
            dataType:"json",
            timeout:5000
            }).done(function(res){
                success_callback(res);
            });
    });
};

