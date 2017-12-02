/**
 * Created by Administrator on 2017/8/17.
 */
$(document).on("click",".head",function(){
    $(this).toggleClass("active")
        .siblings("ul").toggleClass("active");
});

//  获取接单人列表；
$.ajax({
    type:'get',
    url:  server_url_repair + server_v1 + '/user/list/receptionist.json',
    data: {
        "firmId":firmId
    },
    dataType:'json',
    success:function(data){
        var list = $("#sent-list");
        var html = '';
        list.empty();
        if(data.code === 0){
            $.each(data.data,function(index,val){
                html += '<li> <a href="'+ headJumps(val.id) +'"> <img class="avatar" src="'+ server_uel_user_img + val.photo +'" alt="avatar" onerror="defaultPA(this)"> </a> <a data-id="'+ val.id +'" class="orders" href="javascript:"> <div class="information"> <div class="name"><span class="na">'+ val.name +'</span><span class="position">'+ val.duty[0] +'</span></div> <time>上班时间：08:00-23:00</time> <div class="picked-up">已有'+ val.count +'单</div> </div> </a> </li>'
            })
        }
        list.append('<div class="team"> <header class="head"><i class="shrink-icon"></i><div class="title">'+ data.data[0].orgName +'</div></header> <ul>'+ html +'</ul> </div>');
    },
    error:function(data){
        ErrorReminder(data);
    }
});

$(document).on("click",".orders",function(){
    var _this = $(this);
    var sum = '';
    if(urlParams("status") === "1"){
        sum = 'sendOrder';
    }else if(urlParams("status") === "2"){
        sum = 'sendAgain';
    }
   //   点击接单人派单；
    /*$.ajax({
        type:'post',
        url:  server_url_repair + server_v1 + '/repair/'+ sum +'.json',
        data: {
            "id":urlParams("id"),
            "handlerId":_this.attr("data-id"),
            "allocationId":userId
        },
        dataType:'json',
        success:function(data){
            if(data.code === 0){
                if(data.data === true){
                    window.location.href = "repair_details.html?id="+ urlParams("id") +"";
                }
            }
        },
        error:function(data){
            ErrorReminder(data);
        }
    });*/
    $.ajax({
        type:'post',
        url:server_rent+server_v1+'/rentBespeaks/allot.json',
        dataType:'json',
        data:{
            'bespeakId':urlParams("id"),
            'receptUserId':_this.attr("data-id"),
            'allocationUserId':userId
        },
        success:function(res){
            if(res.code==0){
                showMask('分配成功！');
                setTimeout(function(){
                    closeMask();
                    window.location.href = "rent.html?show=3";
                },1000)
            }else{
                showMask('分配失败！');
            }
        },
        error:function(res){
            showMask('分配失败！');
        }
    })
});

// 搜索接收人
function dataFilter(_this){
    if($(_this).val() <= 0){
        $(".sBox-wrapper").removeClass("heiA");
    }else{
        $(".sBox-wrapper").addClass("heiA");
        processing($(_this).val());
    }
}
function processing(data){
    //  如果搜索内容和公司名像匹配，则显示；其他则隐藏；
    $.each($(".name .na"),function(index,val){
        if($(val).text().match(data)){
            $(val).parents("li").show();
        }else{
            $(val).parents("li").hide();
        }
    });
    //  如果所属部门没有查询的人，则隐藏这个部门；
    // $.each($(".team"),function(index,val){
    //     console.log($(val).find("ul").css("height"));
    //     if($(val).find("ul").css("height") === "0px"){
    //         $(val).hide();
    //     }else{
    //         $(val).show();
    //     }
    // })
}
$('.cancel').click(function(){
    $('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');
    $(".team li").show();
});