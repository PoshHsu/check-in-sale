function getQRCode(content, width, height){
    // 預設寬高為 120x120
    width = !!width ? width : 120 ;
    height = !!height ? height : 120;
    // 編碼
    content = encodeURIComponent(content);
    return 'http://chart.apis.google.com/chart?cht=qr&chl=' + content + '&chs=' + width + 'x' + height;
}
var queryQRCode = function(pid, success_callback, fail_callback){
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

