// 党员发展

$('.nav_ul li').click(function(){
	//点击当个li，背景颜色加深
	$(this).addClass("whenTab").siblings("li").removeClass("whenTab");
	$(this).children(".container").children("p").addClass("active");
	//点击更换图片
	$(this).find(".pic1").addClass("hide");
	$(this).find(".pic2").removeClass("hide");
	$(this).siblings("li").find(".pic1").removeClass("hide");
	$(this).siblings("li").find(".pic2").addClass("hide");
	//改变p标签字体等样式
	$(this).children(".container").children("p").addClass("active");
	$(this).siblings("li").children(".container").children("p").removeClass("active");
	$(".nav_ul li .container>span").addClass("active");
	$(this).children(".container").children("span").removeClass("active");
	//切换列表
	var index=$(this).index();
	$(this).parents(".page").find(".content_ul").eq(index).removeClass("hide").siblings(".content_ul").addClass("hide");
	console.log($(this).parents(".page").find(".content_ul"));

});
//群众头部切换
$(".mass_ul>li>.nav").click(function(){
	$(".screen_shade").removeClass("hide");
});
$(".screen_shade li").click(function(){
	$(".screen_shade li.active").removeClass("active");
	$(this).addClass("active");
	$(".mass_ul>li>.nav").html($(this).text()+"<i></i>");
	setTimeout(function(){
		$(".screen_shade").addClass("hide");
	},300)
})