$(document).ready(function(){
    var u=$(window).width()>750?54:$(window).width()/10;
    var ww=$(window).width();
    var wh=$(window).height();
    $('.publish-add-box').css('height',wh-$('.return-column').height()-$('.add-bot').height());
    $('#editor_box').css('min-height',wh-$('.return-column').height()-$('.publish-add-box .tt').height()-$('.add-bot').height()-u);
    $('.receive-box .list-con').height(wh-$('.search').height()-$('.return-column').height());
    $('.publish-box,.receive-box,.return-column').width(ww);
})

//选择接收人之后
function rePublish(){
    $('.p-layout').css('transform','translateX(0)');
    var recei_str="";
    var recei_num = 0;
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
        $('#icon-wrap').addClass('cblue').text('共'+recei_num+'个接收人');
    }else{
        $('#recei_comp').text('全部企业'); 
        $('#icon-wrap').removeClass('cblue').html("选择接收人<i class='icon icon-in'></i>");
    }
    
}


//上传附件
var fileData = [];var imgBur = false;  //如果图片正在上传则禁止发送请求；
function getDocu(_this){
    var name=_this.value;
    var postfix=name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if(postfix!='doc' && postfix!='docx' && postfix!='docm' && postfix!='dotx' && postfix!='dotm' && postfix!='xlsx' && postfix!='xls' && postfix!='xlsm' && postfix!='xltx' && postfix!='xltm' && postfix!='pdf'){
        alert('请选择word，excel，pdf的格式文件上传！');
        _this.value==' ';
        $(_this).attr('src',' ');
        return false;
    }else{
        var icon_class=postfix.indexOf('do')!=-1?'word-icon':postfix.indexOf('xl')!=-1?'excel-icon':'pdf-icon';
        // console.info($('.p-layout').height());

        var form = new FormData($("#newForm")[0]);       //需要是JS对象
        $.each($(_this)[0].files,function(index,val){
            form.append("file",val);
        });

//      添加文件；
        $.ajax({
            type:'post',
            url:  server_zuui + server_v1 + '/file/upload.json',
            data: form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0 && data.data){
                    fileData.push(data.data);

                    var da = data.data.originalName.split(".");
                    var i = "";
                    switch(da[1]){
                        case "pdf":i = '<i class="suffix-icon pdf-icon"></i>';
                            break;
                        case "excel":i = '<i class="suffix-icon excel-icon"></i>';
                            break;
                        case "word":i = '<i class="suffix-icon word-icon"></i>';
                            break;
                        // default:i = '<i class="suffix-icon pdf-icon"></i>';
                        //     break;
                    }

                    var code = '<li> ' + i + '<p class=""><span>'+ da[0] +'</span>'+ da[1] +'</p><i class="delete-icon" data-name="'+ data.data.url +'" onclick="delDocu(this)"></i></li>';

                    $('#up_attach').append(code);
                }else{
                    showMask("文件太大了！");
                }
            },
            beforeSend:function(){
                imgBur = true;
            },
            complete:function(){
                imgBur = false;
            },
            error:function(data){
                ErrorReminder(data);
            }
        });

    }
}
//删除附件
function delDocu(_this){
    var name = $(_this).attr("data-name");
    var ind = $(_this).parents("li").index();
    $.ajax({
        type:'post',
        url:  server_core + server_v1 + '/file/delete.json',
        data: {
            "name":name
        },
        dataType:'json',
        success:function(data){
            if(data.code === 0 && data.message === "SUCCESS"){
                $(_this).parent("li").remove();
                fileData.splice(ind,1); //删除呗删除图片数据；
            }
        },
        beforeSend:function(){
            imgBur = true;
        },
        complete:function(){
            imgBur = false;
        },
        error:function(data){
            ErrorReminder(data);
        }
    });
}





function release(){

    var content = $("#editor_box").text();  // 内容
    var title = $("#title").val();       //标题
    var data = {};
    var urls = [];

    if(imgBur){
        showMask("文件正在上传！");
        return;
    }

    if(title.length < 4){
        showMask("请输入长度大于4个字符的标题！");
        return;
    }
    if(reg.test(content)||content === ""){
        showMask("请输入正文！");
        return;
    }
    if($(".firmIds:checked").length <= 0){
        showMask("请选择接收人！");
        return;
    }

    var firmIds = "";             // 接收数组
    $.each($(".firmIds:checked"),function(x,y){
        if(x === 0){
            firmIds += $(y).attr("data-id");
        }else{
            firmIds += "," + $(y).attr("data-id");
        }
    });
    $.each(fileData,function(index,val){
        urls.push(val.url);
    });
    console.log(urls);
    var type = $("#type").val();     // 通知类型
    data["propertyId"] = propertyId;
    data["userId"] = userId;
    data["title"] = title;
    data["content"] = content;
    data["type"] = type;
    data["urls"] = urls;      // 附件数组
    data["firmIds"] = firmIds;

    $.ajax({
        type:'post',
        url:  server_url_notice + server_v1 + '/notify.json',
        data: data,
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                window.location.href = "notice_list.html";
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
$.ajax({
    type:'get',
    url:  server_LouDong + server_v1 + '/propertyFirms/'+ 2 +'.json',
    data: null,
    dataType:'json',
    success:function(data){
        var list = $(".list-con");
        $(".list-top").siblings().remove();  // 清除其他
        var html = '';
        if(data.code === 0 && data.data){
            $.each(data.data,function(index,val){
                html += '<div class="list"> <div class="tx fl"><img src="../../images/icon/photo.png" alt="" class="full"></div> <div class="tit fl">'+ val.name +'</div> <div class="check-box fr"> <input class="firmIds " data-id="'+ val.id +'" type="checkbox" /> <label for=""></label> </div> <div class="clear"></div> </div>'
            });
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









