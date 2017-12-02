$(".list>li.active .btn").click(function(){//兑换积分
    var text=$(this).parents("ul").attr("class").split("list")[1];
    $(".screen_shade .content span").addClass("hide");
    $(".screen_shade .shade-head ."+Trim(text)).removeClass("hide");
    $(".screen_shade .text ."+Trim(text)).removeClass("hide");
    $(".screen_shade").removeClass("hide");
    setTimeout(function(){
        $(".screen_shade").addClass("hide");
    },1000);
    $(this).parents("li").removeClass("active").addClass("finish");
    $(this).text("已兑换");
    $(this).attr("disabled","disabled");
});
$(".screen_shade").click(function(){//点击遮罩层关闭弹框
    $(".screen_shade").addClass("hide");
});
$("nav>div").click(function(){
    $("nav>div.active").removeClass("active");
    $(this).addClass("active");
    var text=$(this).attr("class").split("active")[0];
    $(".list").addClass("hide");
    $(".list."+text).removeClass("hide");
});
//使用trim()去除字符串前后空格
function   Trim(m){
    while((m.length>0)&&(m.charAt(0)==' '))
        m   =   m.substring(1, m.length);
    while((m.length>0)&&(m.charAt(m.length-1)==' '))
        m = m.substring(0, m.length-1);
    return m;
}