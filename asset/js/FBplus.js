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


 　 this.initStatus = false;
 　 this.b = 2;

    /*
     * using in user not set fail handle callback
     */
    this.SCALLBACK = function(res) {
        console.error("need the parameter of success callback function");
        console.log(res);
    };

    /*
     * using in user not set success handle callback
     */
    this.FCALLBACK = function(res) {
        console.error("need the parameter of fail callback function");
        console.log(res);
    };

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
                _params += ("access_token=" + this.TOKEN);
            }
            else{
                params.access_token = this.TOKEN;
                _params = params;
            }
            _scallback = (scallback) ? scallback : this.SCALLBACK;
            _fcallback = (fcallback) ? fcallback : this.FCALLBACK;
        }
        else {
            _scallback = (params)    ? params    : this.SCALLBACK;
            _fcallback = (scallback) ? scallback : this.FCALLBACK;
        }
        console.log(_params);
        $.ajax({
            url:link,
            data:_params,
            dataType:"json",
            type:type
            }).done(_scallback).fail(_fcallback);
    };

　　callback(this);
}


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

FBplus.modules.ajax = function(box){
    box.ajax = box.ajax || {};
    box.ajax.send = function(link, params, scallback, fcallback){
        var _fcallback,
            _scallback,
            _params = "";
        if (typeof params === "object" || typeof params === "undefined") {
            for (var name in params) {
                _params += (name + "=" + configs[name] + "&");
            }
            _scallback = (scallback) ? scallback : box.SCALLBACK;
            _fcallback = (fcallback) ? fcallback : box.FCALLBACK;
        }
        else {
            _scallback = (params)    ? params    : box.SCALLBACK;
            _fcallback = (scallback) ? scallback : box.FCALLBACK;
        }

        _params += ("access_token=" + box.TOKEN);
        $.ajax({
            url:link,
            data:_params,
            dataType:"json",
            type:"get"
            }).done(_scallback).fail(_fcallback);

    };
};

FBplus.modules.auth = function(box){
    box.auth = box.auth || {};
    box.auth.getToken = function(){
       return box.TOKEN;
    };

    box.auth.reloadToken = function(scallback, fcallback){
        var _link = box.config.TOKEN_LINK + "client_id=" + this.CLIENT_ID + "&redirect_uri=" + this.REDIRECT_URI + "&secret_id=" + this.SECRET_ID + "&code=" + this.CODE;
        this.send(_link, scallback, fcallback);
    };

    box.auth.getLoginUrl = function(scope){
        return box.config.OAUTH_LINK + "client_id=" + box.CLIENT_ID + "&redirect_uri=" + box.REDIRECT_URI + "&scope=" + scope;
    };

    box.auth.getLogoutUrl = function(uri){
        return "https://www.facebook.com/logout.php?next=" + uri + "&access_token=" + box.TOKEN;
    };
};

FBplus.modules.friends = function(box){
    box.listFriends = function(){};
};

FBplus.modules.checkin = function(box){
    box.checkin = box.checkin || {};
    box.checkin.getFriendCheckIn = function(fid, params, scallback, fcallback){
        var link = box.config.FB_SERVER + fid + "/checkins/";
        box.send(link, params, scallback, fcallback);
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
};

FBplus.prototype = {
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
});


