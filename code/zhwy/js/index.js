//导航展开与关闭
function navToggle(_this){
    $('.triangle').removeClass('activate');
    if($(_this).hasClass('down')){//关闭
        $('.nav-parent-a').removeClass('down');
        $('.nav-second-level').slideUp();
    }else {//展开
        $(_this).addClass('down');
        $(_this).find('.triangle').addClass('activate');
        $('.nav-second-level').slideUp();
        $(_this).siblings('ul').slideDown();
    }
    $('.nav-second-level a').removeClass('activate_bg');
}



$('#menu').on('click','.first-ul a',function(e){
    console.log(this);
    $('.nav-second-level a').removeClass('activate_bg');
    if($(this).hasClass('activate_bg')){
        $(this).removeClass('activate_bg');
    }else {
        $('.nav-parent-a').removeClass('activate_bg');
        $(this).addClass('activate_bg');
    }
});


goPage('home.html');
// goPage('page/inform/inform_list.html');
//goPage('page/affiche/affiche_list.html');
//goPage('page/lease/reservation_list.html');
//goPage('page/lease/lease_list.html');
//goPage('page/news/news_list.html');
//goPage('page/activity/activity_report_list.html');
//goPage('page/company/company_list.html');
//goPage('page/building/building_list.html');
//goPage('page/office/office_list.html');
//goPage('page/system/log_list.html');


//iframe的windowd对象：
var iWin = document.getElementById("iframe").contentWindow;



//关闭Layer：
var closeLayer = function(myLayer){
    layer.close(myLayer);
};

// function parseQueryString(url){
//     var obj={};
//     var keyvalue=[];
//     var key="",value="";
//     var paraString=url.substring(url.indexOf("?")+1,url.length).split("&");
//     for(var i in paraString)
//     {
//         keyvalue=paraString[i].split("=");
//         key=keyvalue[0];
//         value=keyvalue[1];
//         obj[key]=value;
//     }
//     return obj;
// }
// var urlJson = parseQueryString(location.href);
// //获取用户Id
// function getUserId(){
//     $.ajax({
//         type:'get',
//         url:'/cas-server/serviceValidate',
//         dataType:'XML',
//         data:{
//             "ticket":urlJson.ticket,
//             "service":location.href
//         },
//         success:function(res){
//             cosole.log(res);
//             /*if(res.code === 0){
//                 alertMsg('登录成功！');
//                 deposited("sysid",res.data);  // 存入sysid值；
//                 //window.location.href = "../page/org_control/not_org.html";
//             }else{
//                 alertMsg('用户名或密码不正确');
//             }*/
//         },
//         error:function(res){
//             alertMsg('登录失败');
//         }
//     });
//
// }
// getUserId();