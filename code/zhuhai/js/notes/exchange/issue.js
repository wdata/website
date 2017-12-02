
//给上传的视频生成一个地址
function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}
function InsertImage(_this){
    var filepath =getObjectURL(_this.files[0]);
    $(".headline .video").html("<video  poster='../../images/notes/ff.png' style='width:100%' src="+filepath+"></video>");
    $(".headline .video").removeClass("hide");
    $(".img_con").addClass("hide");
    $(".headline>span").addClass("hide");
}
$("video").click(function(){
    $("video").pause();
});
var u = navigator.userAgent;
var device =""; //当前设备信息
if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
    device = "Android";
} else if (u.indexOf('iPhone') > -1) {//苹果手机
    device = "iPhone";
} else if (u.indexOf('Windows Phone') > -1) {//winphone手机
    device = "Windows Phone";
}
if (device == "Android") {
   $(".people_focuse").focus(function(){
       $(".content").css("top", "-15%");
   });
    $(".people_focuse").blur(function(){
        $(".content").css("top", "1.3" + "rem");
    });
}