var FBplus = FBplus || {};
FBplus.namespace = function(ns_string) {
        var parts  = ns_string.split('.'),
        parent = FBplus,
        i;
        if (parts[0] === "FBplus") {
            parts = parts.slice(1);
        }
        for (i = 0; i < parts.length; i+=1) {
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
};

FBplus.init = function(setting){
    FBplus.namespace("FBplus.setting");
    var _setting = FBplus.setting;
    _setting.token = setting.token;
    _setting.app_id = setting.app_id;


    var ajax = function(link, scallback, fcallback, configs){
        var data = "";
        if (typeof configs !== "undefined") {
            for (var name in configs) {
                data = data + (name + "=" + configs[name] + "&");
            }
        }
        data = data + ("access_token=" + _setting.token);
        $.ajax({
            url:link,
            data:data,
            dataType:"json",
            type:"get"
            }).done(scallback).fail(fcallback);
    };

    /*
     * using in user not set fail handle callback
     */
    var _defaultFcallback = function(res) {
        console.error(res);
    };

    /*
     * using in user not set success handle callback
     */
    var _defaultScallback = function(res) {
        console.log(res);
    };


    /**
     * using in paging query string
     * configs: object type, set how many numbers data are searched
     */
    var PageProjection = function(configs){
        var pages = ["limit", "offset", "util", "since"];
        for (var name in configs) {
            if (pages.indexOf(name) === -1) {
                console.error("the parameter error, no name = " + name);
            }
        }
    };

    var AuthorProjection = function(permision) {
        var _permision = ["scope","redirect_url"]
        for (var name in permision) {
            if (_permision.indexOf(name) === -1) {
                console.error("the parameter error, no name = " + name);
            }
        }
    };

    //[config]
    FBplus.namespace("FBplus.configs");
    FBplus.configs = (function(){
        return {
            fb_server:"https://graph.facebook.com/",
            oauth_link:"https://www.facebook.com/dialog/oauth?",
            checkin:"me/checkins"
        };
    }());
    //[Setting]

    FBplus.namespace("FBplus.auth");
    FBplus.auth = (function(){
        var setting = FBplus.setting,
        _token  = setting.token || "";
        return {
            setToken: function(token) {
                _token = token;
            },
            getToken: function() {
                return _token;
            },
            getLoginUrl : function(permision) {
                AuthorProjection(permision);
                var setting = FBplus.setting,
                    configs = FBplus.configs,
                    app_id  = setting.app_id,
                    token   = setting.token,
                    scope   = permision.scope,
                    redirect_url = permision.redirect_url,
                    oauth_link   = configs.oauth_link;
                return oauth_link + "client_id=" + app_id + "&redirect_url=" + redirect_url + "&scope=" + scope;
            },
            getLogoutUrl: function(url){
                var token = FBplus.setting.token;
                return "https://www.facebook.com/logout.php?next=" + url + "&access_token=" + token;
            }
        }
    }());

    FBplus.namespace("FBplus.checkins");
    FBplus.checkins = (function(){
        return {
            /*  get checkin by frineds id
             *  fid : the id of frineds
             *  configs :
             *  scallback : success callback function
             *  fcallback : fail callback function
             */
            getFriendCheckIn: function(fid, configs, scallback, fcallback){
                var _configs,
                    _scallback = scallback,
                    _fcallback = fcallback,
                    link = FBplus.configs.fb_server + fid + "/checkins/";

                if (typeof configs !== "object" && typeof configs === "function") {
                     _scallback = configs;
                     _fcallback = scallback;
                }
                else {
                    _configs = configs;
                    PageProjection(_configs);
                }

                if (typeof _scallback === "undefined") {
                    _scallback = _defaultScallback;
                }

                if (typeof _fcallback === "undefined") {
                    _fcallback = _defaultFcallback;
                }
                ajax(link, _scallback, _fcallback, _configs);
            },
            getMeCheckin: function(configs, scallback, fcallback){
                this.getFriendCheckIn("me", configs, scallback, fcallback);
            }
        };
    }());

    FBplus.namespace("FBplus.fql");
    FBplus.fql = (function(){
        return {
            exec: function(sql, scallback, fcallback){}
        };
    });

    FBplus.namespace("FBplus.utils.rss");
    FBplus.utils.rss = (function() {
        //dosomething
        var auth = FBplus.auth;
        return {};
    }());

};

var  setting = {
    token:"AAADZCBZAhRc5QBAPY1PJvXppJbUN8ITHbtpz7cBdNPPChgbeOZBCigrNuS0rfTzSlwfGRNJDFkuJwra2BmBc0KkK6WXkmOYKfSUC3E5HQZDZD",
    app_id:"280399495394196",
}
FBplus.init(setting);



//[checkin]
var checkins = FBplus.checkins;
//checkins.getMeCheckin(function(res){console.log(res)}, function(res){console.log(res)});
//checkins.getMeCheckin({limit:3}, function(res){console.log(res)}, function(res){console.log(res)});
//checkins.getMeCheckin({limit:100});
//checkins.getFriendCheckIn("100000296498273", function(res){console.log(res)}, function(res){console.log(res)});
//checkins.getFriendCheckIn("100000296498273", {limit:3}, function(res){console.log(res)}, function(res){console.log(res)});


//[Login]
var auth = FBplus.auth,
    scope = "read_stream,publish_checkins,publish_stream,user_status,user_checkins,read_stream,user_birthday,friends_status",
    redirect_url = "http://carpo.terrence-tang.com";

console.log(auth.getLoginUrl({scope:scope, redirect_url:redirect_url}));
console.log(auth.getLogoutUrl(redirect_url));










// logout : https://www.facebook.com/logout.php?
//     next=YOUR_REDIRECT_URL
//        &access_token=USER_ACCESS_TOKEN
// &response_type=token
// https://graph.facebook.com/oauth/access_token?client_id=APP_ID&client_secret=APP_SECRET&grant_type=fb_exchange_token&fb_exchange_token=EXISTING_ACCESS_TOKEN
// fb_exchange_token dont change



/** Ref
 *  Ling Live Token : http://developers.facebook.com/roadmap/offline-access-removal/#extend_token
 */
