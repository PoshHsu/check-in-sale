var getAid = function(){
    var temp = (location.href).substr((location.href).indexOf("checkin/") + 8),
        len  = temp.lastIndexOf("?"),
        aid  = temp.substr(0, (len != -1) ? len : temp.length);
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
    var _host = (location.hostname != 'localhost') ? "http://checkinsale.com" : "http://localhost:5000",
        _query = "/db/query/activity/",
        _config = {
            url:_host + _query + (location.pathname.substr("mobile/checkin/".length + 1)),
            data:pid,
            dataType:"json",
            type:"get"
        };
        console.log("host name : ", _host);
    $.ajax(_config).done(scallback).fail(fcallback);
};

var initLayout = function(layout_data){
    var _logined    = layout_data.login_status ||  false,
    _place_name = layout_data.place_name || "",
    _slogan     = layout_data.slogan || "";


    //do login pic
    //if (_logined) {
     //   $("#page1").css("display","block");
   // }
    //else {

    //}

    $("#place").html(_place_name);
    $("#slogan").html(_slogan);

};

var showLoding = function(){
    $.mobile.loading( 'show', {
        text: 'loading',
        textVisible: false,
        theme: 'b'
    });
};

var closeLoding = function(){
    $.mobile.loading( 'hide');
};

var initEvent = function(event_data){
    console.log("event data",event_data);
    $("#btn-close").bind("click", function(event, ui){
        window.close();
    });
    $("#btn-checkin").click(function(){
        showLoding();
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

                console.log("before insert", _data);
                plus.wall.insert(_data,
                    function(result){
                        console.log("success insert into wall", result);
                        closeLoding();
                        $.mobile.changePage('#dialog', 'pop', true, true);
                    },
                    function(resule){
                        console.log("fail insert into wall", result)
                        closeLoding();
                        $.mobile.changePage('#dialog', 'pop', true, true);
                    }
            );

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
            $.mobile.changePage("#CheckinPage");
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

var initLoginPage = function(){
     var scope = "read_stream,publish_checkins,publish_stream,user_status,user_checkins,read_stream,user_birthday,friends_status";
    FBplus(["auth"], function(plus){
        var link = plus.auth.getLoginUrl(scope);
        $("#btn-login").attr("href", link)
    });
}

var init = function(res) {
    if(FB.getAccessToken()){
        FBplus.prototype.config.TOKEN = FB.getAccessToken();
    }
    else if(location.search !== "") {
        var _href = location.href,
            _code = _href.substr(_href.indexOf("?")+6);
        FBplus.prototype.config.CODE = _code;
        FBplus(["auth"], function(plus){
            plus.auth.getLongLiveToken(function(res){
                var _data = res.responseText,
                    _token = _data.substr(13, (_data.lastIndexOf("&") -13));
                console.log("auth =", _data);
                console.log("tokin query by code", _token);
                FBplus.prototype.config.TOKEN = _token;
                console.log("init FBplus.prototype.config : ", FBplus.prototype.config);
            });
        });
    }
    initIndex();
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

