// 党员发展空间tab选项卡
$(".nav_container>.title:nth-child(1)").click(function(){
	//导航字体颜色变红	
	$(this).siblings(".title").removeClass("active");
	$(this).addClass("active");
// 导航的底部红框
	$(this).siblings(".title").children("p").removeClass("red");
	$(this).children("p").addClass("red");
//切换列表
	$(this).parents(".page").find('.zonelist').hide();
	$(this).parents(".page").find('.apply_mainBody').show();
})
$(".nav_container>.title:nth-child(2)").click(function(){
	//导航字体颜色变红	
	$(this).siblings(".title").removeClass("active");
	$(this).addClass("active");
// 导航的底部红框
	$(this).siblings(".title").children("p").removeClass("red");
	$(this).children("p").addClass("red");
//切换列表

	$(this).parents(".page").find('.zonelist').hide();
	$(this).parents(".page").find('.thought_report').show();
})
$(".nav_container>.title:nth-child(3)").click(function(){
	//导航字体颜色变红	
	$(this).siblings(".title").removeClass("active");
	$(this).addClass("active");
// 导航的底部红框
	$(this).siblings(".title").children("p").removeClass("red");
	$(this).children("p").addClass("red");
//切换列表

	$(this).parents(".page").find('.zonelist').hide();
	$(this).parents(".page").find('.exam_record').show();
})
$(".nav_container>.title:nth-child(4)").click(function(){
	//导航字体颜色变红	
	$(this).siblings(".title").removeClass("active");
	$(this).addClass("active");
// 导航的底部红框
	$(this).siblings(".title").children("p").removeClass("red");
	$(this).children("p").addClass("red");
//切换列表

	$(this).parents(".page").find('.zonelist').hide();
	$(this).parents(".page").find('.party_opinion').show();
})
// 左边点击时间减少
$(".chooseYear>.substract").click(function(){
	var thisSubstract = $(this).parents(".chooseYear").find(".i_time").text();
	if(thisSubstract>0){
		thisSubstract--;
		$(this).parents(".chooseYear").find(".i_time").text(thisSubstract);
	}
	
})

// 右边点击时间增加
$(".chooseYear>.plus").click(function(){
	var thisPlus = $(this).parents(".chooseYear").find(".i_time").text();
	thisPlus++;
	$(this).parents(".chooseYear").find(".i_time").text(thisPlus);
	
})
