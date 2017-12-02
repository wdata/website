// 领导表率空间
// 最新台账滑动操作
var leader_newledger = new Swiper('.leader_newledger',{
    slidesPerView : 3.8,
    spaceBetween : 4,
})
//轨迹按钮与滑动
var leader_track = new Swiper('.leader_track',{
    prevButton:'.swiper-button-prev',
    nextButton:'.swiper-button-next',
})
// 台账模板
var leader_model = new Swiper('.leader_model',{
    slidesPerView : 3.8,
    spaceBetween : 4,
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
});
function change_bg(_this,src,href){
	$(_this).children(".black-img").children("img").attr("src",src);
	setTimeout(function(){
		window.location.href=href;
	},200);
}

