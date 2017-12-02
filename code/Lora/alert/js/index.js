//获取系统配置：
var $sys = $('#system');
$sys.find('.logo_img').attr('src',sessionStorage.getItem('logo'));
$sys.find('.title').text(sessionStorage.getItem('maintitle'));
$sys.find('.text').text(sessionStorage.getItem('subtitle'));
$(document).ready(function() {
    if (sessionStorage.getItem('suc')) {
        var suc = sessionStorage.getItem('suc');
        $('.name_person').html(suc);
        $('#login_role').text(sessionStorage.getItem('login_role'))
    } else {
        window.parent.location.replace("html/sign_in/sign_in.html");
    }
    if(sessionStorage.getItem('changePwd')=='false'){
        $("#workspace").attr('src','html/system/modify_password.html');
    }
    load({currentPage: 1, pageSize: 10000, currentStatus:'nocomplete'});
    //侧边栏
    $.ajax({
        type: "POST",
        url: '/web/accountCtr/getResourcesByUser',
        dataType: 'json',
        data: {},
        success: function (data) {
            if (data.isSuccess) {
                var html = '';
                $.each(data.data, function (index, item) {
                    var li = '';
                    if (item.name == "首页") {
                        li += "";
                        html += '<li><div class="link" data-id="' + item.path + '">' + item.name + '</div></li>';
                    } else {
                        if (item.children) {
                            $.each(item.children, function (num, icon) {
                                var add = null, edit = null, deleted = null;
                                var status_code = [];
                                if (icon.children.length != 0) {
                                    $.each(icon.children, function (len, current) {
                                        status_code.push(current.resourceCode);
                                    });
                                } else {
                                    status_code = [];
                                }
                                if (status_code != "") {
                                    li += '<li class="L_set_up_one"><a href="#" data-id="' + icon.path + '?status_code=' + status_code + '">' + icon.name + '</a></li>'
                                } else {
                                    li += '<li class="L_set_up_one"><a href="#" data-id="' + icon.path + '">' + icon.name + '</a></li>'
                                }
                            });
                            var lis = '<ul class="submenu">' + li + '</ul>';
                        }
                        html += '<li><div class="link">' + item.name + '<i class="fa-chevron-down"></i></div>' + lis + '</li>';
                    }
                });
                $("#accordion").html(html);
                var Accordion = function (el, multiple) {
                    this.el = el || {};
                    this.multiple = multiple || false;
                    var links = this.el.find('.link');
                    links.on('click', {el: this.el, multiple: this.multiple}, this.dropup);
                };
                Accordion.prototype.dropup = function (e) {
                    var $el = e.data.el;
                    var $this = $(this),
                        $next = $this.next();
                    $("#accordion .link").removeClass("active");
                    $('.submenu a').removeClass("active");
                    $this.addClass("active");
                    $('#bread-nav .one').show();
                    $('#bread-nav .two').hide();
                    $('#bread-nav .three').hide();
                    $('#bread-nav .one span').text($this.text());
                    if ($this.attr("data-id")) {
                        $("#workspace").attr("src", $this.attr("data-id"));
                    }
                    $next.slideToggle();
                    $this.parent().toggleClass('open');
                    if (!e.data.multiple) {
                        $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
                    }
                };
                var accordion = new Accordion($('#accordion'), false);
                $('.submenu a').click(function () {//左边菜单栏点击时：
                    var pageUrl = $(this).attr('data-id');
                    if(pageUrl.indexOf('wait_surface.html')!==-1){//清除‘报警处理列表’页面的搜索条件
                        sessionStorage.setItem('currentStatus','');
                        sessionStorage.setItem("waringDesc",'');
                    }else if(pageUrl.indexOf('administration.html')!==-1){
                        sessionStorage.setItem('isEditPersonMsg',false);
                    }

                    $('.submenu a').removeClass("active");
                    $(this).addClass("active");
                    $($(this).parents(".submenu").parent("li").children(".link")).removeClass("active");
                    $("#workspace").attr("src", $(this).attr("data-id"));
                    $('#bread-nav .two').show();
                    $('#bread-nav .three').hide();
                    $('#bread-nav .two span').text($(this).text());
                });
                $(".amend").click(function () {
                    $("#workspace").attr("src", $(this).attr("data-id"));
                });
            } else {
                returnMessage(1, data.message);
            }
        },
        error: function (msg) {
            returnMessage(2, msg.status);
        }
    });


    //推送
    var clt = sessionStorage.getItem('clt');
    var goEasy = new GoEasy({appkey: 'BC-bc8aca99c2334b7d980144423300d20c'});
    goEasy.subscribe({
        channel: clt,
        onMessage: function(message){
            console.log(message);
            //var myVideo=null;
           if(message.content.indexOf("火警报警")!==-1){
               playVoice('fire_alarm');
           }else{
               playVoice('device_fault');
           }
            console.log(message.content);
            setTimeout(function(){
                load({currentPage: 1, pageSize: 10000, currentStatus:'nocomplete'});
            },10000);
        }
    });



    $('.change').click(function () {
        $('.L_system_statistics').attr('src', 'html/system/modify_password.html');
    });
    $('.person').click(function () {
        var usid = sessionStorage.getItem('userid');
        var roleType = sessionStorage.getItem('roleType');
        var companyId = sessionStorage.getItem('companyID');
        if(roleType == 'unit_manager') {//使用单位管理员
            $.ajax({
                type: "POST",
                url:'/web/managementCtr/getManagementDetail',
                dataType: 'json',
                data:{companyId:companyId},
                success:function(e){
                    var user = JSON.stringify(e);
                    data = false;
                    sessionStorage.setItem('apply',user);
                    sessionStorage.setItem('datas',data);
                    $('#bread-nav .one span').text("修改个人信息");
                    $('#bread-nav .two').hide();
                    $('.L_system_statistics').attr('src', 'html/use_company/new_company/new_company.html');
                },
                error:function(data){
                    returnMessage(2,'报错：' +  data.status);
                }
            });
        } else {
            sessionStorage.setItem('isEditPersonMsg',true);
            $.ajax({
                type: "POST",
                url:'/web/accountCtr/getAccountInfo',
                dataType: 'json',
                data:{id:usid},
                success:function(e){
                    if(e.code == 200) {
                        data = false;
                        var rlgou = JSON.stringify(e);
                        sessionStorage.setItem('rlgou',rlgou);
                        sessionStorage.setItem('dataone',data);
                        $('#bread-nav .one span').text("修改个人信息");
                        $('#bread-nav .two').hide();
                        $('.L_system_statistics').attr('src', 'html/system/account_number/account_number.html');
                    } else {
                        returnMessage(2,data.message);
                    }
                },
                error:function(data){
                    returnMessage(2,data.status);
                }
            });
        } 
    });
    $('.logout').click(function () {
        confirmMsg('是否退出系统？', function () {
            $.ajax({
                type: "POST",
                url: '/web/loginCtr/loginOut',
                dataType: 'json',
                data: {},
                success: function (e) {
                    sessionStorage.clear();
                    window.parent.location.replace("html/sign_in/sign_in.html");
                },
                error: function (msg) {
                    returnMessage(2, msg.status);
                }
            });
        });
    });
    /*$("#roll").click(function(){
        $("#workspace").attr("src","html/warning_guan/wait_surface.html");
        $('#bread-nav .two span').text("报警处理列表");
        $('#bread-nav .one span').text("报警管理");
        $('#bread-nav .two').show();
    });*/
    $('header .warn').click(function(){
        $("#workspace").attr("src","html/warning_guan/wait_surface.html");
        $('#bread-nav .two span').text("报警处理列表");
        $('#bread-nav .one span').text("报警管理");
        $('#bread-nav .two').show();
        sessionStorage.setItem('currentStatus','nocomplete');
        sessionStorage.setItem("waringDesc",'');
        pausePlay();
    });
    //平台设置
    if(sessionStorage.getItem('systemSetting')==='true'){
        $('#systemSetting').css('display','inline')
    }
    $(".setting").click(function(){
        /*$('.L_system_statistics').attr('src', 'html/system/systemSetting.html');
        $('#bread-nav .one span').text("平台设置");*/
        layer.open({
            type: 2,
            title: '平台设置',
            shadeClose: true,
            shade: 0.75,
            move: false,
            area: ['1000px', '70%'],
            content: 'html/system/systemSetting.html' //iframe的url
        });
    })
});
function load(date){
    if(date!=undefined){
            $.ajax({
                type:'post',
                url: server_url + '/web/warning/searchUnsolvedWarnings',
                data:date,
                dataType:'json',
                success:function(res){
                    if(res.code==200){
                        $("header .warn .icon").text(res.data.totalElements);//报警中的数目
                        /*$("#icon").html(res.data.totalElements);
                        $("#roll .text a").html(res.data.content[0].warningDesc+"："+res.data.content[0].address);*/
                    }else if(res.code==204){
                        $("header .warn .icon").text('0');//报警中的数目
                        /*$("#icon").html(0);
                        $("#roll .text a").html("没有报警中的信息推送！！");*/
                    }else{
                        returnMessage(1,res.message);
                    }
                },
                error:function(res){
                    //报错提醒框
                    returnMessage(2,'报错：' +  res.status);
                }
            });
        }
}

/*
 *   这是一个弹出框
 *   弹出框里面的时间每秒减少一下5-0   5秒后跳转至登录页面；
 *   如果点击确定直接跳转至登录页面；
 *   缺点：只在子页面显示，未解决在遮罩层显示在index页面；
 *   解决：将函数写在Index.js中，在修改密码页面调用此函数；
 * */
function modifyDialog(){
    BootstrapDialog.show({
        'type':'type-primary',
        "closable": false,
        'title':"返回信息",
        'message':"密码修改成功，<span id='time'>5</span>秒后跳转至登录页面",
        'buttons':[
            {
                label: '确定',
                cssClass:'btn-primary',
                action: function(dialog){
                    sessionStorage.clear();
                    window.location.replace("html/sign_in/sign_in.html");
                    dialog.close();
                }
            }
        ]
    });
    var index = 4;
    var time = setInterval(function(){
        $("#time").text(index);
        index --;
        if(index === -1){
            clearInterval(time);
            sessionStorage.clear();
            window.location.replace("html/sign_in/sign_in.html");
        }
    },1000);
}


//获取报警音效
function getVoice(){
    $.ajax({
        type: 'post',
        url: server_url + '/web/warning/getSysMsgPushList',
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                $.each(data.data, function (index, item) {
                    if (item.warningType === 'fire_alarm') {//火警
                        sessionStorage.setItem('fire_alarm_voice', item.warningVoiceDomain);
                        sessionStorage.setItem('fire_alarm_open', item.voiceOpen);
                    } else {//故障
                        sessionStorage.setItem('device_fault_voice', item.warningVoiceDomain);
                        sessionStorage.setItem('device_fault_open', item.voiceOpen);
                    }
                });
            }
        }
    });
}
getVoice();
//播放报警音效：
function playVoice(voiceType){
    pausePlay();
    var $voice = $('#voice');
    if(voiceType=='fire_alarm'){//火警
        var fire_alarm_voice = sessionStorage.getItem('fire_alarm_voice');
        var fire_alarm_open = sessionStorage.getItem('fire_alarm_open');
        $voice.attr('src',fire_alarm_voice);
        if(fire_alarm_open==='true'){
            $voice[0].play();
        }
    }else {//故障
        var device_fault_voice = sessionStorage.getItem('device_fault_voice');
        var device_fault_open = sessionStorage.getItem('device_fault_open');
        $voice.attr('src',device_fault_voice);
        if(device_fault_open==='true'){
            $voice[0].play();
        }
    }
}
//停止播放：
function pausePlay(){
    var $voice = $('#voice');
    $voice[0].pause();
}


///workspace
$('#workspace').load(function(){
    $('#workspace').css('height','100%');
});