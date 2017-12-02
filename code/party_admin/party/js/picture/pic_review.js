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


$(document).ready(function(){
    label(paGe,pageNum);
    // getComp("#firmId");
    // getComp("#edit_firmId");
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
        url: DMBserver_image_url + '/web/api/images.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            $("#userlist_tab .list").empty();
            //list.empty();  //清空
            if(data.code === 0){
                var html='';
                $.each(data.data.items,function(index,item){
                    var isShow=item.isShow===1?"":"No";
                    //审核状态 0:待审核,1:通过,-1:不通过
                    var status=item.status===0?"待审核":item.status===1?"通过":"不通过";
                    var reason=item.status===-1?item.reason:"";

                    html+='<tr><td><input onclick="checkDown(this)" data-id="'+item.id+'" type="checkbox"></td><td>'+ (index + 1 + page * 10) +'</td><td>'+item.id+'</td><td class="img"><img src="'+unite_img_url+(item.fileName)+'"></td><td>'+item.remark+'</td><td class="yesNo '+isShow+'"><div><button></button><span></span></div></td><td>'+item.createTime+'</td><td>'+item.companyName+'</td><td>'+item.sort+'</td><td>'+status+'</td><td style="max-width: 200px;word-wrap: break-word;">'+reason+'</td class="caozhuo"><td class="caozhuo"><a  onclick="picRevlewYes(this)">修改</a><a  onclick="deleteImage(this)">删除</a></td></tr>';
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
        });
    }else{
        returnMessage(2,'请选择要删除的图片！')
    }
    $("#userlist_tab thead th:first input").removeAttr("checked");
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
//删除图片
function deteleImage(id){
    $.ajax({
        type:'post',
        url:DMBserver_image_url+'/web/api/images/delete.json',
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
function picRevlewYes(_this){
    var id=$(_this).parents("tr").find("input").attr("data-id");
    $.ajax({
        type:'get',
        url:  DMBserver_image_url +'/web/api/images/'+id+'.json',
        data: {},
        dataType:'json',
        success:function(data){
            if(data.code === 0){
                //添加数据
                $("#edit_id").val(id);
                // $("#edit_firmId").val(data.data.firmId);   //所属公司
                $("#sort").val(Number(data.data.sort));  //排序值
                $(".abs").attr("src",unite_img_url + data.data.fileName);  //图片
                // $("#fileName").val(data.data.fileName);
                $("#remark").val(data.data.remark); //图片描述
            }else{
                //data.code === -1
                returnMessage(2,'暂无数据');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
    $(".pic-review-edit").addClass("show").addClass("in");
}
// 编辑框---确定
function picEditYes(){
    var form = new FormData($("#edit_image")[0]);
    $.ajax({
        type:'post',
        url:  DMBserver_image_url + '/web/api/images/update.json',
        data:form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0){
                returnMessage(1,'修改成功！');
                //修改成功，跳转至图片列表
                label(paGe,pageNum,keyword);
                $(".pic-review-edit").removeClass("show").removeClass("in");
            }else{
                returnMessage(2,'修改失败data.code为：' + data.code);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//展示图片审核
//不通过原因--出现编辑框
//修改审核状态
function picReviewEditBy(_this){
    var assessor=$(_this).text()=="通过"?true:false;
    if($('#userlist_tab .list input[type=checkbox]:checked').length!=0){
        var dataID = $('#userlist_tab tbody input[type=checkbox]:checked');   //单选按钮
        var id = [];
        $.each(dataID,function(index,val){
            id.push($(val).attr("data-id"));   //获取id
        });
        //审核状态 0:待审核,1:通过,-1:不通过
        if(assessor){
            $.ajax({
                type:'POST',
                url: DMBserver_image_url + '/web/api/images/status.json',
                data:{ids:id,status:1},
                dataType:'json',
                traditional:true,
                success:function(data){
                    if(data.code === 0){
                        returnMessage(1,'显示状态修改成功！');
                        $("#userlist_tab thead th:first input").removeAttr("checked");
                        label(paGe,pageNum,keyword);
                    }else{
                        returnMessage(2,'修改显示状态失败！');
                    }
                },
                error:function(data){
                    //报错提醒框
                    returnMessage(2,'报错：' +  data.status);
                }
            });
        }else{
            $(".pic-review-edit-by").addClass("show").addClass("in");
        }
    }else{
        returnMessage(2,'请选择图片！')
    }
}
//不通过原因--确定不通过
function picEditByYes(){
    var reason=$("#reason").val();
    var dataID = $('#userlist_tab tbody input[type=checkbox]:checked');   //单选按钮
    var id = [];
    $.each(dataID,function(index,val){
        id.push($(val).attr("data-id"));   //获取id
    });
    $.ajax({
        type:'POST',
        url: DMBserver_image_url + '/web/api/images/status.json',
        data:{ids:id,status:-1,reason:reason},
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                returnMessage(1,'显示状态修改成功！');
                $("#userlist_tab thead th:first input").removeAttr("checked");
                label(paGe,pageNum,keyword);
            }else{
                returnMessage(2,'修改显示状态失败！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
    $(".pic-review-edit-by").removeClass("show").removeClass("in");
}




// 编辑框---取消
function picEditNo(self){
    $(self).parents(".modal").removeClass("show").removeClass("in");
}

//是否显示切换
$(document).on("click",".list .yesNo",function(){
    var isShow=$(this).hasClass("No");
    var status=null;
    if(isShow){
        status=1;
    }else{
        status=0;
    }
    var id=[];
    id.push($(this).parents("tr").find("input").attr("data-id"));
    $.ajax({
        type:'POST',
        url: DMBserver_image_url + '/web/api/images/isshow.json',
        data:{ids:id,status:status},
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                returnMessage(1,'显示状态修改成功！');
                label(paGe,pageNum,keyword);
            }else{
                returnMessage(2,'修改显示状态失败！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });


});