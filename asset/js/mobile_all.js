var getAid = function(){
 var temp = (location.href).substr((location.href).indexOf("checkin") + 8),
         aid  = temp.substr(0,temp.lastIndexOf("?"));
return aid;
};

function getQRCode(content, width, height){
    // 預設寬高為 120x120
    width = !!width ? width : 120 ;
    height = !!height ? height : 120;
    // 編碼
    content = encodeURIComponent(content);
    return 'http://chart.apis.google.com/chart?cht=qr&chl=' + content + '&chs=' + width + 'x' + height;
}


var queryQRcode = function(pid, scallback, fcallback){
    console.log(11);
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

var initLayout = function(layout_data){
    var _logined    = layout_data.login_status ||  false,
        _place_name = layout_data.place_name || "",
        _slogan     = layout_data.slogan || "";


    //do login pic
    if (_logined) {
        $("#page1").css("display","block");
    }
    else {

    }

    $("#place").html(_place_name);
    $("#slogan").html(_slogan);

};

var initEvent = function(event_data){
    console.log("event data",event_data);
    $("#btn-checkin").click(function(){
        var _message = $("#message").val();
        /*
        FBplus(["checkin","config"], function(plus){
            var _data = {
                    coordinates:{
                        latitude:event_data.place.lat,
                        longitude:event_data.place.long
                    },
                    message:message,
                    place:event_data.place.pid
            };
            console.log("data", _data);
            plus.checkin.insert(_data, function(){alert(123);});
        });
        */
       FBplus(["wall"], function(plus){
           var privacy = {} ;
           //privacy.value ='CUSTOM' ;
           //privacy.friends='SOME_FRIENDS';
           //privacy.allow ="1524376598";
           privacy.value = 'ALL_FRIENDS' ;
           console.log(event_data.place)
           var _place= event_data.place.pid;
           var _data = {
               message:_message,
               place:_place,
               picture:event_data.place.pic_link,
                          description:event_data.place.slogan,
                          name:event_data.place.link_name,
                          link:event_data.place.web_link,
               tags:[]
           };

           console.log(_data);
           plus.wall.insert(_data);

       });
    });
};


var initIndex = function(){
    console.log(11);
    var _place = null,
        _pid   = location.pathname.substr(16);


    queryQRcode(_pid, function(res){
            console.log("in query qrcode", res);
            var _place = res,
            layout_data ={},
            event_data = {};

            layout_data.place_name = _place.name;
            layout_data.slogan     = _place.slogan;
            layout_data.login_status = true;

            console.log("place",_place)
            event_data.place = _place;

            initLayout(layout_data);
            initEvent(event_data);
    });
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

