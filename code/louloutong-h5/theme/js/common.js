/**
 * Created by Administrator on 2017/8/7.
 */
// var server_IP = "http://192.168.1.42:8910";
var server_IP = "";
var server_v1="/v1";
var server_url = server_IP + "/louloutong-rent/api";
var server_url_repair = server_IP + "/louloutong-repair/api";          // 物业管理
var server_url_notice = server_IP + "/louloutong-notice/api";          // 通知管理
var server_rent = server_IP + "/louloutong-rent/api";                  // 租房管理
var server_core = server_IP + "/louloutong-core/api";                  // 文件删除管理
var server_zuui = server_IP + "/zuul/louloutong-core/api";             // 文件上传管理
var server_LouDong = server_IP + "/louloutong-property/api";          // 切换楼栋

// var server_url_img = 'http://oud4j7ifk.bkt.clouddn.com/';
var server_url_img = '';
var server_uel_user_img = '';


var dataS = JSON.parse(sessionStorage.getItem("dataSession"));   // 本地存储；
var dataSession = dataS?dataS:{};   // 本地存储对象,添加判断，以继承本地存储内数据；如果没有本地存储则创建一个对象；
var userId = obtain("userId");    //  用户ID；
if(!userId){
    userId = "1977";
    deposited("userId","1977");
}else{
    $("#select option[value='"+ userId +"']").attr("selected",true);
}
$(document).on("change","#select",function(){
    sessionStorage.clear();        // 删除所有的零时存储，重新导入；

    deposited("rentTop",0);
    deposited("rentBot",0);
    deposited("userId",$(this).val());
    location.reload();
});




var propertyId = dataS?dataS["propertyId"]:null;              //  物业ID；
var propertyName = dataS?dataS["propertyName"]:null;              //  物业名；


// var propertyId = "1";
var authority = JSON.parse(sessionStorage.getItem("authority"));       //  权限
var firmId = "1762";                                    //  公司ID


var page = 1;
var reg = /^[\s]*$/;  //为空判断；
//  将报错提示放入公共文件，以方便后期修改；
function ErrorReminder(data){
    console.log("报错：" + data.status);
};
//  头像跳转；
function headJumps(data){
    return "javascript:";
}

// GET http://ip:port/louloutong-repair/api/v1/property/manager/{userId}.json

// 用户Id	姓名	角色	所属公司
// 1977	刘玄德	物业管理员	科信物业公司
// 1978	关羽	物业管理员	科信物业公司
// 1979	张飞	物业维修人员	科信物业公司
// 1980	赵云	物业维修人员	科信物业公司
// 1981	黄忠	物业运营人员	科信物业公司
// 1982	马超	物业前台人员	科信物业公司
// 1983	李平	物业普通人员	科信物业公司
//
// 1985	荀彧	物业管理员	南山物业公司
// 1987	曹仁	物业管理员	南山物业公司
// 1984	曹操	物业维修人员	南山物业公司
// 1986	陈宇	物业维修人员	南山物业公司
// 1988	甄姬	物业运营人员	南山物业公司
// 1989	荀攸	物业前台人员	南山物业公司
// 1990	曹洪	物业普通人员	南山物业公司

//  将签到修改成点击修改职业；



//------------------------------获取网址ID，key是参数名-------------------------------
var urlParams = function (key) {
    var ret = location.search.match(new RegExp('(\\?|&)' + key + '=(.*?)(&|$)'));
    return ret && decodeURIComponent(ret[2])
};

//  将数组转化为字符串，使用.join；并使用字符串判断是否有权限；
function authMethod(data){
    var auth = authority.join("");
    var bur = null;
    if(auth.indexOf(data) > 0){
        bur = true;
    }else{
        bur = false;
    }
    return bur;
}

//  为null或者没有参数时，显示为空；
function noTd(elem){
    return elem?elem:' ';
}

//  将值存入dataSession
function deposited(name,value){
    dataSession[""+ name +""] = value;
    sessionStorage.setItem("dataSession",JSON.stringify(dataSession));
}
//  获取dataSession值
function obtain(name){
    var data = false;
    if(sessionStorage.getItem("dataSession")){
        data = JSON.parse(sessionStorage.getItem("dataSession"))[name];
    }
    return data;
}

//选择全部
function checkAll(elem,_this){
    if($(_this).prop('checked')){
        $(elem).find('input[type=checkbox]').prop('checked',true);
    }else{
        $(elem).find('input[type=checkbox]').prop('checked',false);
    }
}


//  底部导航
$(".click-footer a").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
});

// img加载不成功设置默认头像和默认图片；
function defaultP(_this){
    $(_this).attr("src","../../images/anounce/default.png");
    _this.onerror='';  // 如果更换的图片加载不成功不重复加载；
}
function defaultPA(_this){
    $(_this).attr("src","../../images/anounce/avatar.png");
    _this.onerror='';  // 如果更换的图片加载不成功不重复加载；
}


function closeMask(){
	$('.mask-bg').remove();
}

function showMask(msg){
	var code = ' ' +
        '<div class="mask-bg"> ' +
        '<div class="mask-con"> ' +
        '<div class="tit">提示</div> ' +
        '<div class="main">'+ msg +'</div> ' +
        '<div class="bot"> ' +
        '<button class="btn" onclick="closeMask()">确认</button> ' +
        '</div> </div> </div>';
	$('body').append(code);
}

// 是否删除;
function confirm(msg,z){
    var code = ' ' +
        '<div class="mask-bg"> ' +
        '<div class="mask-con"> ' +
        '<div class="tit">提示</div> ' +
        '<div class="main">'+ msg +'</div> ' +
        '<div class="bot"> ' +
        '<button class="btn confirm">确认</button><button class="btn cancel" onclick="closeMask()">取消</button>  ' +
        '</div> </div> </div>';
    $('body').append(code);

    // 点击事件
    $(".mask-bg .confirm").on("click",function(){
        z();
        $('.mask-bg').remove();
    })

}

Array.prototype.unique = function(){
 var res = [this[0]];
 for(var i = 1; i < this.length; i++){
  var repeat = false;
  for(var j = 0; j < res.length; j++){
   if(this[i] == res[j]){
    repeat = true;
    break;
   }
  }
  if(!repeat){
   res.push(this[i]);
  }
 }
 return res;
};


var curTime=(new Date()).getTime();
$('.tap-footer a').eq(1).attr('src','/html/rent/rent.html?cur='+curTime)

function wxConfig(wx) {
    $.ajax({
        url: '/weixin/permissionValidation',
        type: 'get',
        dataType: 'json',
        async:false,
        contentType: 'application/json',
        data:{'url':location.href.split('#')[0]},
        success: function (res) {
            var data = res.data;
            //微信配置
            wx.config({
                debug: false,
                //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ',
                    'onMenuShareWeibo','onMenuShareQZone','chooseImage','previewImage','uploadImage',
                    'downloadImage','getLocalImgData',
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                //alert(1)
            });
            wx.error(function (res) {
                throw res;
                //console.log(2);
            });

        },
        error: function (res) {

        }
    })
}

