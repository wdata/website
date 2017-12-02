var calendar1 = new datePicker();
calendar1.init({
    'trigger': '#unit_time',
    /*按钮选择器，用于触发弹出插件*/
    'type': 'ym',
    /*模式：date日期；datetime日期时间；time时间；ym年月；*/
    'minDate': '1900-1-1',
    /*最小日期*/
    'maxDate': '2020-10-31',
    /*最大日期*/
    'onSubmit': function() { /*确认时触发事件*/
        var theSelectData = calendar1.value;
        $("#unit_time").find("span").html(theSelectData);
    },
    'onClose': function() { /*取消时触发事件*/ }
});
var calendar2 = new datePicker();
calendar2.init({
    'trigger': '#branch_time',
    /*按钮选择器，用于触发弹出插件*/
    'type': 'ym',
    /*模式：date日期；datetime日期时间；time时间；ym年月；*/
    'minDate': '1900-1-1',
    /*最小日期*/
    'maxDate': '2020-12-31',
    /*最大日期*/
    'onSubmit': function() { /*确认时触发事件*/
        var theSelectData = calendar2.value;
        $("#branch_time").find("span").html(theSelectData);
    },
    'onClose': function() { /*取消时触发事件*/ }
});

var calendar3 = new datePicker();
calendar3.init({
    'trigger': '#political_time',
    /*按钮选择器，用于触发弹出插件*/
    'type': 'ym',
    /*模式：date日期；datetime日期时间；time时间；ym年月；*/
    'minDate': '1900-1-1',
    /*最小日期*/
    'maxDate': '2020-12-31',
    /*最大日期*/
    'onSubmit': function() { /*确认时触发事件*/
        var theSelectData = calendar3.value;
        $("#political_time").find("span").html(theSelectData);
    },
    'onClose': function() { /*取消时触发事件*/ }
});

//显示弹框的按钮
function remind(remind,pop,swiper_ctr,index){//pop:remind层级下的弹框的类名,swiper_ct:轮播控制器，index：首次显示弹框的轮播显示索引
    $("."+remind).show().find("."+pop).show();
//	写在外层,只有拖动,但是没有范围和效果
    var mySwiper = new Swiper('.'+swiper_ctr,{
        direction : 'vertical',  //垂直
        initialSlide :index //初始索引
    });
}
//点击阴影部分关闭弹框
function remind_text(_this,id,e){
    //var text=$("."+id+" .swiper-slide-active").text();
    //if(id=='position'&&text.indexOf("(")!=-1){
    //    var new_str=text.slice(0,text.indexOf("("));
    //    var str=new_str+"<br/>&nbsp&nbsp&nbsp"+text.slice(text.indexOf("("));
    //    $("#"+id+" span").html(str);
    //}else{
    //    $("#"+id+" span").html(text);
    //}
    var index = parseInt($(_this).css("height"));
    if(e.pageY <= index/2){
        $(_this).hide().find(".id").hide();
    }
}
//弹框确定按钮
function save_remind(remind,id){
    var text=$("."+id+" .swiper-slide-active").text();
    $("#"+id+" span").html(text);
    $("."+remind).hide().find("."+id).hide();
    $("#"+id+" .addto").addClass(".hide").siblings("img").removeClass("hide");
}
//弹框取消按钮
function cancel(remind,id){
    $("."+remind).hide().find("."+id).hide();
}
//显示弹框的按钮
function branch(remind,pop,swiper_ctr,index){//pop:remind层级下的弹框的类名,swiper_ct:轮播控制器，index：首次显示弹框的轮播显示索引
    $("."+remind).show().find("."+pop).show();
//	写在外层,只有拖动,但是没有范围和效果
    var mySwiper = new Swiper('.'+swiper_ctr,{
        direction : 'vertical',  //垂直
        initialSlide :2 , //初始索引
        slidesPerView: 5,
        centeredSlides: true
    });
}
function position(remind,pop,swiper_ctr,index){
    $("."+remind).show().find("."+pop).show();
//	写在外层,只有拖动,但是没有范围和效果
    var mySwiper = new Swiper('.'+swiper_ctr,{
        direction : 'vertical',  //垂直
        initialSlide :2 , //初始索引
        slidesPerView: 5,
        centeredSlides: true,
    });
}
var branch_text="";//选择的支部名称
function choice_branch(remind,pop,swiper_ctr,index){
    branch_text=$(".swiper-branch .swiper-slide-active").text();
    $("."+remind).show().find("."+pop).show();
    var mySwiper = new Swiper('.'+swiper_ctr,{
        direction : 'vertical',  //垂直
        initialSlide :index //初始索引
    });
}
//是否为支部书记
function isSecretary(remind,id){
    var isSecretary=$(".swiper-secretary .swiper-slide-active").hasClass("yes");
    if(isSecretary){
        $("#"+id+" span").html(branch_text+"(支部书记)");
    }else{
        $("#"+id+" span").html(branch_text);
    }
    $("."+remind).hide().find("."+id).hide();
    $("#"+id+" .addto").addClass(".hide").siblings("img").removeClass("hide");
}
//党组成员二级选项
function party_group(){
    var isParty=$(".swiper_position .swiper-slide-active").attr("class").indexOf("party");
    var isLevel=$(".swiper_position .swiper-slide-active").attr("class").indexOf("level");
    $(".remind_pos").hide().find(".position").hide();
    if(isParty!=-1){
        $(".remind_group").show().find(".group").show();
        var mySwiper = new Swiper('.swiper_group',{
            direction : 'vertical',  //垂直
            initialSlide :1 //初始索引
        });
    }else if(isLevel!=-1){
        $(".remind_level").show().find(".level").show();
        var mySwiper = new Swiper('.swiper_level',{
            direction : 'vertical',  //垂直
            initialSlide :0 //初始索引
        });
    }else{
        var text=$(".swiper_position .swiper-slide-active").text();
        $("#position  .addto").addClass(".hide").siblings("img").removeClass("hide");
        $("#position span").html(text);
    }
}
//当前职务的组织职位
function pos_group(){
    var pos_text=$(".swiper_position .swiper-slide-active").text();
    var text=$(".swiper_group .swiper-slide-active").text();
    $("#position span").html(pos_text+"<br/>"+"("+text+")");
    $("#position  .addto").addClass(".hide").siblings("img").removeClass("hide");
}
function pos_level(){
    var pos_text=$(".swiper_position .swiper-slide-active").text();
    var text=$(".swiper_level .swiper-slide-active").text();
    $("#position span").html(pos_text+"<br/>"+"("+text+")");
    $("#position  .addto").addClass(".hide").siblings("img").removeClass("hide");
}
//是否党务管理人员选择
function isAdmin(){
    var admin_name=$(".swiper-admin .swiper-slide-active").attr("class").indexOf("admin_name");
    var admin_user=$(".swiper-admin .swiper-slide-active").attr("class").indexOf("admin_user");
    var admin=$(".swiper-admin .swiper-slide-active").text();
    $(".remind_admin").hide().find(".admin").hide();
    if(admin_name!=-1){
        $(".remind_name").show().find(".admin_name").show();
        var mySwiper = new Swiper('.swiper-name',{
            direction : 'vertical',  //垂直
            initialSlide :2 , //初始索引
            slidesPerView: 5,
            centeredSlides: true
        });
    }else if(admin_user!=-1){
        $("#admin  .addto").addClass(".hide").siblings("img").removeClass("hide");
        $("#admin span").html(admin+"(监察室党支部)");
    }else{
        $("#admin  .addto").addClass(".hide").siblings("img").removeClass("hide");
        $("#admin span").html(admin);
    }
}
//党组（班子）成员管理员 名字
function admin_name(){
    var admin=$(".swiper-admin .swiper-slide-active").text();
    var text=$(".swiper-name .swiper-slide-active").text();
    $("#admin  .addto").addClass(".hide").siblings("img").removeClass("hide");
    $("#admin span").html(admin+" "+text);
}