// 党员先锋空间
// 最新台账滑动操作
var member_newledger = new Swiper('.member_newledger',{
    slidesPerView : 3.8,
    spaceBetween : 4
})
//轨迹按钮与滑动
var member_track = new Swiper('.member_track',{
    prevButton:'.swiper-button-prev',
    nextButton:'.swiper-button-next',
})
// 台账模板
var member_model = new Swiper('.member_model',{
    slidesPerView : 3.8,
    spaceBetween : 4
})
// 弹出层
$(".choose-button").click(function(event){
	$(".black-container").addClass("black-show");
	$(".black-container").removeClass("black-hide");
	$(".choose-button").css("display","none");
	event.preventDefault();//阻止冒泡
},false)
$(".detail-close").click(function(){
	$(".black-container").addClass("black-hide");
	$(".black-container").removeClass("black-show");
	$(".choose-button").css("display","block");
})

