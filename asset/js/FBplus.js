function FBplus() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        modules = (args[0] && typeof args[0] === "string") ?
        args : args[0],
        i;
    if (!(this instanceof FBplus)) {
 　　　　 return new FBplus(modules, callback);
 　 }

  　if (!modules || modules === '*') {
      　modules = [];
  　  　for (i in FBplus.modules) {
   　     　if (FBplus.modules.hasOwnProperty(i)) {
    　　　　　modules.push(i);
    　　　　}
   　 　}
  　}
 　 for (i = 0; i < modules.length; i++) {
      　FBplus.modules[modules[i]](this);
    }

    this.send = function(type, link, params, scallback, fcallback){
        var _fcallback,
            _scallback,
            _params = "";
        if (typeof params === "object" || typeof params === "undefined") {
            if(type === "get") {
                for (var name in params) {
                    if (typeof params[name] === "string") {
                        _params += (name + "=" + params[name] + "&");
                    }
                }
                _params += ("access_token=" + this.config.TOKEN);
            }
            else{
                params.access_token = this.config.TOKEN;
                _params = params;
            }
            _scallback = (scallback) ? scallback : this.SCALLBACK;
            _fcallback = (fcallback) ? fcallback : this.FCALLBACK;
        }
        else {
            _scallback = (params)    ? params    : this.SCALLBACK;
            _fcallback = (scallback) ? scallback : this.FCALLBACK;
            _params += ("access_token=" + this.config.TOKEN);
        }
        $.ajax({
            url:link,
            data:_params,
            dataType:"json",
            type:type
            }).done(_scallback).fail(_fcallback);
    };
　　callback(this);
};
/*
 * using in user not set fail handle callback
 */
FBplus.prototype.SCALLBACK = function(res) {
    console.error("need the parameter of success callback function");
    console.log(res);
};

/*
 * using in user not set success handle callback
 */
FBplus.prototype.FCALLBACK = function(res) {
    console.error("need the parameter of fail callback function");
    console.log(res);
};

FBplus.modules = {};
FBplus.modules.checkin = function(box){
    box.listCheckin = function(){};
    box.checkin = {};
    box.checkin.getName = function(){};
};

FBplus.modules.config = function(box){
    box.config = box.config || {};
    box.config.FB_SERVER  = "https://graph.facebook.com/";
    box.config.OAUTH_LINK = "https://www.facebook.com/dialog/oauth?";
    box.config.TOKEN_LINK = "https://graph.facebook.com/oauth/access_token?";
};

FBplus.modules.auth = function(box){
    box.auth = box.auth || {};
    box.auth.getToken = function(){
       return box.config.TOKEN;
    };

    box.auth.reloadToken = function(scallback, fcallback){
        var _link = box.config.TOKEN_LINK + "client_id=" + this.config.CLIENT_ID + "&redirect_uri=" + this.config.REDIRECT_URI + "&secret_id=" + this.config.SECRET_ID + "&code=" + this.config.CODE;
        this.send("get", _link, scallback, fcallback);
    };

    box.auth.getLoginUrl = function(scope){
        return box.config.OAUTH_LINK + "client_id=" + box.config.CLIENT_ID + "&redirect_uri=" + box.config.REDIRECT_URI + "&scope=" + scope;
    };

    box.auth.getLogoutUrl = function(uri){
        return "https://www.facebook.com/logout.php?next=" + uri + "&access_token=" + box.config.TOKEN;
    };

    box.auth.getLongLiveToken = function(scallback, fcallback){
        var _link = "https://graph.facebook.com/oauth/access_token?client_id=" + this.config.CLIENT_ID + "&client_secret=" + this.config.SECRET_ID + "&grant_type=fb_exchange_token&fb_exchange_token=" + this.config.TOKEN;
        this.send("get", _link, scallback, fcallback);
    };
};

FBplus.modules.friends = function(box){
    box.friends = box.friends || box;
    box.friends.getFriendList = function(params, scallback, fcallback){
        var link = box.config.FB_SERVER + "me/friends/";
        box.send("get", link, params);
    };
    box.friends.getFriendInfo = function(fid, params, scallback, fcallback){
         var link = box.config.FB_SERVER + fid;
        box.send("get",link, params, scallback, fcallback);
    }
};

FBplus.modules.checkin = function(box){
    box.checkin = box.checkin || {};
    box.checkin.getFriendCheckIn = function(fid, params, scallback, fcallback){
        var link = box.config.FB_SERVER + fid + "/checkins/";
        box.send("get", link, params, scallback, fcallback);
    },
    box.checkin.getMeCheckin = function(params, scallback, fcallback){
        box.checkin.getFriendCheckIn("me", params, scallback, fcallback);
    };

    box.checkin.insert = function(fid, params){
       var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           link = box.config.FB_SERVER + _fid + "/checkins/";
       box.send("post", link, _params);
    };
};

FBplus.modules.wall = function(box){
    box.wall = box.wall || {};
    box.wall.insert = function(fid, params){
       var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           link = box.config.FB_SERVER + _fid + "/feed/";
       box.send("post", link, _params);
    };

    box.wall.home = function(params){
        var link = box.config.FB_SERVER + "me/home/";
        box.send("get", link, params);
    };

    box.wall.feed = function(fid, params){
        var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           link = box.config.FB_SERVER + _fid + "/feed/";
        box.send("get", link, _params);
    };
};

FBplus.prototype.config = {
    TOKEN:"AAADZCBZAhRc5QBAFGKZBdXXzp9FoygcJDgH17nfEr43lnBwm8TFiZCZCTR8a2tojsI9g3K8otoLmqfkgfTCI2XjELZCIZAuhgaRCl6SDETguQZDZD",
    CLIENT_ID:"280399495394196",
    SECRET_ID:"4cc040f7d05cf311c9fbf615c0ae6168",
    CODE:"AQBssBRamxqQ8qEcqNFixJZj1auOkGvXCKbnpbjmPMILs5crGmsuuQmLBSFiC9S6dye98e6JzL8Fs1bFtG_GYDnulE1lGejCkoR2zVMODkI_ZoT1jK9FFuZPqINNPZ7mVlvju4Fb8vx90Z5elvcPEUJfU6nbVetI3tsH8KceFdo2VXE79HKtUirKrlh0UlX6yVE3J-02mQbSG-Ov--HdWRUG#_=_",
    REDIRECT_URI:"http://carpo.terrence-tang.com/"
};

new FBplus(["checkin", "friends", "config", "auth", "wall"], function(box){
   //box.checkin.getFriendCheckIn("100000296498273");
   //box.checkin.getFriendCheckIn("100000296498273", function(res){console.log(res)});
   //box.checkin.getMeCheckin();
   //box.checkin.getMeCheckin({limit:3});
   /*
   box.checkin.insert(
       {
           coordinates:
            {
              latitude:"25.07698687147",
              longitude:"121.23201566872"
            },
           message:"test",
        place:"142800992448822"
        });
   */
   var scope = "read_stream,publish_checkins,publish_stream,user_status,user_checkins,read_stream,user_birthday,friends_status";
   //console.log(box.auth.getLoginUrl(scope));
   //console.log(box.auth.getLogoutUrl("http://tw.yahoo.com"));


   //box.wall.insert({message:"test"});
   //box.wall.home();
   //box.wall.feed("100000296498273");

   //box.friends.getFriendList();
   //box.friends.getFriendInfo("100000296498273");
   //box.friends.getFriendInfo("me");
   //box.friends.getFriendInfo("me", function(res){console.log(res)});
});


