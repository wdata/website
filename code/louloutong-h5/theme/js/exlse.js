/**
 * Created by Administrator on 2017/8/9.
 */

//  1、如果从列表跳转进入例如：派单、填写处理页面，返回应该是列表；2、如果是详情页面跳转进入应该返回详情；
// sessionStorage.setItem("repairJump",2);
var repairJump = parseInt(sessionStorage.getItem("repairJump"));


//显示
var ww=$(window).width();
function showEdit(_this){
    $('#editor_box').show();
    $(_this).hide();
}
function receiveShow(){
    $('.p-layout').css('transform','translateX(-'+ww+'px)');
}


function returnTran(){
    $('.p-layout').css('transform','translateX(0)');
}

$(document).ready(function(){
    var ww=$(window).width();

});

//搜索相关js
$('.search-main,.p-layout').width(ww*2);
$('.main-wrap,.tran-wrap,.tap-footer').width(ww);

$('#search_btn').focus(function(){
    $('.sBox-wrapper').addClass('active');
});
//点击关键字后
$('.sBox-wrapper .list-con .list').click(function(){
    if($(this).is(".shb")){
        showMask("可筛选中搜索");
        return;
    }
    $('#search_btn').attr('placeholder',$(this).text());
    $('.search-main').css('transform','translateX(-'+ww+'px)');
    $('.sBox-wrapper .top-search').addClass('active');

});
//取消回到列表页
$('.sBox-wrapper .cancel').click(function(){
    $("#search_btn").val("");
    $('.search-main').css('transform','translateX(0)');
    $('#search_btn').attr('placeholder','搜索').val('');
    $(".sBox-wrapper").removeClass("hei").removeClass("heiA");
    // $('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');
    // 因为重复绑定事件，会导致次事件在前，

});
//返回回到关键词页
$('.sBox-wrapper .top-search .back').click(function(){
    $('.search-main').css('transform','translateX(0)');
    $('.sBox-wrapper .top-search').removeClass('active');
    $('#search_btn').attr('placeholder','搜索');
    $(".sBox-wrapper").removeClass("hei");
});
//搜索内容输入即开始搜索
function searchList(){

}

// //  搜索框回车事件，调用搜索
//     searchId.keypress(function(e){
//         if(e.keyCode === 13) {
//             //  处理相关逻辑
//             callback();
//             //  禁止页面刷新
//             window.event.returnValue = false;
//         }
//     });







