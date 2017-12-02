var default_tx="../../images/anounce/avatar.png";           //默认头像
var default_img='../../images/upload/pic2@2x.png';              //默认上传的底图

//显示
var ww=$(window).width();
function showEdit(_this){
	$('#editor_box').show();
	$(_this).hide();
}
function receiveShow(){
	$('.p-layout').css('transform','translateX(-'+ww+'px)');
}
function tranShow(_this){
	$('.tran-wrap .tran-inner').eq(_this).show().siblings().hide();
	$('.p-layout').css('transform','translateX(-'+ww+'px)');
	$('.sBox-wrapper').addClass('z0');
}

function returnTran(){
	$('.p-layout').css('transform','translateX(0)');
}

function session(key,value){
	sessionStorage.setItem(key,value);
}

function clearForm(elem){
	$(elem).find('input[type=text]').text(' ');
}

function checkMobile(phone){ 
 	var sMobile = phone; 
 	if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))){ 
  		return false; 
 	}else{
 		return true;
 	}
} 

//图片默认处理
function imgDefault(url,de_url){
	return (url=="null" || url==null)?de_url:server_uel_user_img+url;
}

function nullCheck(elem){
	return (elem=="null" || elem==null)?' ':elem;
}
//搜索相关js
$('.search-main,.p-layout').width(ww*2);

$('.main-wrap,.tran-wrap,.tap-footer,.issue-editbox,.pic-wrap').width(ww);
$(".sCon-wrapper").removeClass("hide");  // 先隐藏，防止出现开始时图形非常小然后变大的差异！！！

$('#search_btn').focus(function(){
	$('.sBox-wrapper').addClass('active');
})
//返回回到关键词页
$('.sBox-wrapper .top-search .back').click(function(){
    $('.search-main').css('transform','translateX(0)');
	$('.sBox-wrapper .top-search').removeClass('active');
	$('#search_btn').attr('placeholder','搜索');
})



