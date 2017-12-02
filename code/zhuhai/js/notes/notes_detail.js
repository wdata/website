var mySwiper = new Swiper('.content', {
    spaceBetween : 10
});
var height=document.documentElement.clientHeight;
$(".swiper-container").css("height",(height-parseInt($(".swiper-container").offset().top))-25);
var slider_height=parseFloat($(".swiper-container").css("height"));
var slider_width=parseFloat($(".swiper-container").css("width"));
    var font_s = parseFloat($(".swiper-container .swiper-slide").css("font-size"));
    var line_h = parseFloat($(".swiper-container .swiper-slide").css("line-height"));
var text_len = Math.floor(slider_width/font_s);
var text_line = Math.floor(slider_height/line_h);
var slider_text=$(".swiper-container .swiper-slide").eq(0).html();
var con2 = slider_text;
var html="<div class='swiper-slide'>"+con2.substring(text_len*(text_line-1),con2.length)+"</div>";
con2 = con2.replace(con2.substring(text_len*(text_line-1),con2.length),"");//替换
$(".swiper-container .swiper-slide").eq(0).html(con2);
$(".swiper-container .swiper-slide").eq(0).after(html);
mySwiper.update();


