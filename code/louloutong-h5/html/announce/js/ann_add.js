$(document).ready(function(){
	var u=$(window).width()>750?54:$(window).width()/10;
	var ww=$(window).width();
	var wh=$(window).height();
	$('.publish-add-box').css('height',wh-$('.return-column').height()-$('.add-bot').height());
    $('#editor_box').css('min-height',wh-$('.return-column').height()-$('.publish-add-box .tt').height()-$('.add-bot').height()-u);
	$('.receive-box .list-con').height(wh-$('.search').height()-$('.return-column').height());
	$('.publish-box,.receive-box,.return-column').width(ww);
});


//选择接收人之后
function rePublish(){
    $('.p-layout').css('transform','translateX(0)');
    var recei_str="";
    var recei_num=0;
    $('input[type=checkbox]:checked').each(function(index){
        if(index <= 0){
            recei_str += $(this).parents('.list').find('.tit').text();
        }else{
            recei_str += $(this).parents('.list').find('.tit').text() + ',';
        }
        recei_num ++;
    });
    if(recei_str){
        $('#recei_comp').text(recei_str);
        $('.icon-wrap').addClass('cblue').html('共'+recei_num+'个接收人');
    }else{
        $('#recei_comp').text('全部企业'); 
        $('.icon-wrap').removeClass('cblue').html("选择接收人<i class='icon icon-in'></i>");
    }
}


function release(){
    var title = $("#title").val();

    if(title.length < 4){
        showMask("请输入长度大于4个字符的标题！");
        return;
    }
    if($(".placeholader").length === 1){
        showMask("请输入正文！");
        return;
    }
    if($(".firmIds:checked").length <= 0){
        showMask("请选择接收人！");
        return;
    }

    $("#content").val($("#editor_box").html());

    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    var firmIds = "";
    $.each($(".firmIds:checked"),function(x,y){
        if(x === 0){
            firmIds += $(y).attr("data-id");
        }else{
            firmIds += "," + $(y).attr("data-id");
        }
    });
    var urls = [];
    console.log(wxImg.fileData);
    $.each(wxImg.fileData,function(index,val){
        urls.push(val.url);
    });


    // 隐藏文本编辑区域的图片；
    $("#editor_box img").css("display","none");

    form.append("propertyId",propertyId);
    form.append("userId",userId);
    form.append("title",title);
    form.append("content",$("#editor_box").html());
    form.append("firmIds",firmIds);
    form.append("urls",urls);

    $.ajax({
        type:'post',
        url:  server_url_notice + server_v1 + '/notice.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0 && data.message === "SUCCESS"){
                window.location.href = "ann_list.html";
            }
        },
        beforeSend:function(){
            showMask("正在发布!");
        },
        complete:function(){
            showMask("正在发布!");
        },
        error:function(data){ErrorReminder(data);}
    });
}

//  入驻企业；
var dataList = [];
$.ajax({
    type:'get',
    url:  server_LouDong + server_v1 + '/propertyFirms/'+ 2 +'.json',
    data: null,
    dataType:'json',
    success:function(data){
        var list = $(".list-con");
        var html = '';
        $(".list-top").siblings().remove();  //清除元素
        if(data.code === 0 && data.data){
            $.each(data.data,function(index,val){
                html += '<div class="list"> <div class="tx fl"><img src="../../images/icon/photo.png" alt="" class="full"></div> <div class="tit fl">'+ val.name +'</div> <div class="check-box fr"> <input class="firmIds " data-id="'+ val.id +'" type="checkbox" /> <label for=""></label> </div> <div class="clear"></div> </div>'
            });
            dataList = data.data;
            list.append(html);
        }
    },
    error:function(data){ErrorReminder(data);}
});


// 搜索接收人
function dataFilter(_this){
    processing($(_this).val());
}
$(document).keypress(function(e){
    if(e.keyCode === 13) {
        //  处理相关逻辑
        processing($('#search').val());
        //  禁止页面刷新
        window.event.returnValue = false;
    }
});
function processing(data){
    //  如果搜索内容和公司名像匹配，则显示；其他则隐藏；
    $.each($(".list-top").siblings(),function(index,val){
        if($(val).find(".tit").text().match(data)){
            $(val).show();
        }else{
            $(val).hide();
        }
    })
}














