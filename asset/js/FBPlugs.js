//init chinkin but
var FBPlugs ={};

FBPlugs.login = function(success_callback, fail_callback){
    FB.login(function(response) {
        if (response.authResponse) {
console.log("authresponse");
           FB.getLoginStatus(function(response){
               if (response.authResponse) {
console.log("authresponse true");
                  success_callback();
               }
               else {
console.log("authresponse fail");
                  fail_callback();
               }
           });
        }
        else {
console.log("authresponse fail");
           fail_callback();
        }
    });
};
/**
 * make check-in
 * pid : place id
 * lat : latitude
 * long : longitude
 * message : the user's message
 * callback : callback function
 */
FBPlugs.checkin = function(pid, lat, long, message, callback,token){
    FB.api("me/checkins",
            "post",
            {
                access_token:token,
                coordinates:
                {
                    latitude:lat,
                    longitude:long
                },
                message:message,
                place:pid
            },
            callback);
};

FBPlugs.getCheckins = function(callback){
    FB.api("me/checkins", callback);
};

FBPlugs.getUser = function(callback){
    FB.api("me", callback);
};


