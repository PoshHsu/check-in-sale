//init chinkin but
var FBPlugs ={};
/**
 * make check-in
 * pid : place id
 * lat : latitude
 * long : longitude
 * message : the user's message
 * callback : callback function
 */
FBPlugs.checkin = function(pid, lat, long, message, callback){
    FB.api("me/checkins",
            "post",
            {
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


