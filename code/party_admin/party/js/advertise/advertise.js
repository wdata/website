var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var flag = null;

var keyword = [];

/*日期初始化*/
$("#begin").datetimepicker({
    format: "yyyy-mm-dd",
    minView:'month',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
}).on("click",function(){
    $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
});
$("#end").datetimepicker({
    format: "yyyy-mm-dd",
    minView:'month',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
    //pickerPosition: "bottom-left"
}).on("click",function(){
    $("#datetimeEnd").datetimepicker("setStartDate",$("#datetimeStart").val())
});
// getComp("#firmId");

$(document).ready(function(){
    label(paGe,pageNum);
});

function label(page,size,keyword){
    var pageCount,vpage;   //初始的
    //如果有keyword，则说明是搜索
    //开始时显示数据
    var dataObject = {
        page:page,
        size:size
    };
    //如果有keyword，则说明是搜索
    if(keyword){
        dataObject["keyword"] = keyword[0];
        dataObject["begin"] = keyword[1];
        dataObject["end"] = keyword[2];
        dataObject["status"] = keyword[3];
        // dataObject["firmId"] = keyword[4];
    }
    $.ajax({
        type:'get',
        url: DMBserver_notice_url + '/web/api/notices.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            $("#userlist_tab .list").empty();
            if(data.code === 0){
                var html='';
                $.each(data.data.items,function(index,item){
                    var status=item.status==0?"已关闭":"已开启";
                    var open=item.status==0?"closed":"opened";
                    html+='<tr><td><input onclick="checkDown(this)" data-id="'+item.id+'" type="checkbox"></td><td>'+ (index + 1 + page * 10) +'</td><td>'+item.title+'</td><td class="img"><img src="'+unite_img_url+(item.icon)+'"></td><td>'+item.createTime+'</td><td>'+item.beginTime+'</td><td>'+item.endTime+'</td><td class="caozhuo"><a onclick="picEditByYes(this)" class="oper-status  '+open+'">'+status+'</a><button class="btn bg-info text-muted btn-dialog-tab" onclick="change_advertise(this)" href="party/advertise/advertise/advertise_edit.html">修改</button><a onclick="deleteImage(this)">删除</a></td></tr>';
                });
                $("#userlist_tab .list").append(html);
                //分页
                pageCount = data.data.pageCount;
                vpage = pageCount>10?10:pageCount;
                if(pageCount>1){
                    $('.pages').show();
                    flag = true;
                    initPagination('#pagination',pageCount,vpage,page+1,function(num,type){
                        if(type === 'change'){
                            paGe = num - 1;
                            label(paGe,pageNum,keyword);
                        }
                    });
                }else{
                    if(flag) {
                        paGe = 0;
                        label(paGe,pageNum,keyword);
                        flag = false;
                        $('.pages').hide();
                    }
                }
            }else{
                //无数据提醒框
                // returnMessage(2,'暂无数据！');
                $('.pages').hide();

            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });

}
/*跳转到第几页*/
function pageTo(_this){
    var max=parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
    var val=parseInt($(_this).siblings('input').val());
    var num=(val>0?val:1)>max?max:(val>0?val:1);
    paGe = num - 1;
    label(paGe,pageNum,keyword);
    $(_this).siblings('input').val(num);
}
/*批量删除*/
function deleteUser(){
    if($('#userlist_tab .list input[type=checkbox]:checked').length!=0){
        var dataID = $('#userlist_tab tbody input[type=checkbox]:checked');   //单选按钮
        var id = [];
        $.each(dataID,function(index,val){
            id.push($(val).attr("data-id"));   //获取id
        });
        confirmMsg('你确认删除吗？',function(dialog){
            dialog.close();  //关闭确定提示框
            deteleImage(id);      //调用删除函数，删除列表中的图片
            $("#userlist_tab thead th:first input").removeAttr("checked");
        });
    }else{
        returnMessage(2,'请选择要删除的图片！')
    }
}
//单个删除
function deleteImage(_this){
    var id=[];
    id.push($(_this).parents("tr").find("input").attr("data-id"));
    confirmMsg('你确认删除吗？',function(dialog){
        dialog.close();  //关闭确定提示框
        deteleImage(id);      //调用删除函数，删除列表中的图片
    });
}
//删除公告
function deteleImage(id){
    $.ajax({
        type:'post',
        url:DMBserver_notice_url+'/web/api/notices/delete.json',
        data:{
            ids:id    //图片ID,数组
        },
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                //删除成功
                returnMessage(1,'删除成功！');
                label(paGe,pageNum,keyword);
            }else{
                //无数据提醒框
                returnMessage(2,'删除失败！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//搜索查询
function search(){
    keyword = [];
    $.each($('.input-sm .form-control'),function(index,val){
        keyword.push($(val).val());
    });
    if(keyword.length >= 1){
        console.log(keyword);
        paGe = 0;   //如果在1以上页面，则返回1页面并搜索内容
        //调用台账模板列表
        label(paGe,pageNum,keyword);
    }else{
        //无内容，不搜索，并且提示
        returnMessage(3,'请输入搜索内容！');
    }
}
// 修改
function change_advertise(_this){
    var id=$(_this).parents("tr").find("input").attr("data-id");
    session("advertise_id",id);
}
//多条编辑公告状态
function picReviewEditBy(_this){
    var assessor=$(_this).text()=="开启"?true:false;
    if($('#userlist_tab .list input[type=checkbox]:checked').length!=0){
        var dataID = $('#userlist_tab tbody input[type=checkbox]:checked');   //单选按钮
        var id = [],status=null;
        $.each(dataID,function(index,val){
            id.push($(val).attr("data-id"));   //获取id
        });
        //状态, 0:关闭,1:开启
        if(assessor){
            status=1;
        }else{
            status=0;
        }
        edit_assessor(id,status);
        $("#userlist_tab thead th:first input").removeAttr("checked");
    }else{
        returnMessage(2,'请选择公告！')
    }
}
//单条编辑公告状态
function picEditByYes(_this){
    var id=[],status=null;
    id.push($(_this).parents("tr").find("input").attr("data-id"));
    var assessor=$(_this).hasClass("opened");
    if(assessor){
        status=0;
    }else{
        status=1;
    }
    edit_assessor(id,status);
}
//编辑公告状态
function edit_assessor(id,status){
    $.ajax({
        type:'POST',
        url: DMBserver_notice_url + '/web/api/notices/status.json',
        data:{ids:id,status:status},
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                returnMessage(1,'公告状态修改成功！');
                label(paGe,pageNum,keyword);
            }else{
                returnMessage(2,'公告状态修改失败！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}