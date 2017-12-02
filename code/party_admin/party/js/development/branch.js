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
});

function label(page,size,keyword){
    var pageCount,vpage;   //初始的
    //如果有keyword，则说明是搜索
    //开始时显示数据
    var dataObject = {
        page:page,
        size:size,
        type:3
    };
    //如果有keyword，则说明是搜索
    if(keyword){
        dataObject["keyword"] = keyword[0];
        dataObject["begin"] = keyword[1];
        dataObject["end"] = keyword[2];
    }
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/articles.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            $("#userlist_tab .list").empty();
            if(data.code === 0){
                var html='';
                $.each(data.data.items,function(index,item){
                    var sex=item.user.sex==0?"女":item.user.sex==1?"男":"未知";
                    html+='<tr><td><input onclick="checkDown(this)" data-id="'+item.id+'" type="checkbox"></td><td>'+ (index + 1 + page * 10) +'</td><td>'+item.user.name+'</td><td>'+sex+'</td><td>'+item.user.phone+'</td><td>'+item.user
.organName+'</td><td>'+item.companyName+'</td><td>'+item.reviewer+'</td><td>'+item.changeTime+'</td><td><a onclick="verifier(this)" class="btn btn-info">查看</a></td><td><a onclick="picEditByYes(this)" class="btn">发布</a><button onclick="session(\'branch_id\','+item.id+');" href="party/development/branch/branch_edit.html" class="btn bg-info text-muted btn-dialog-tab">修改</button><a class="btn" onclick="deleteImage(this)">删除</a></td></tr>';
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
        returnMessage(2,'请选择要删除的意见！')
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
//删除意见
function deteleImage(id){
    $.ajax({
        type:'post',
        url:DMBServer_url+'/web/api/article/delete.json',
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
            $("#userlist_tab thead th:first input").removeAttr("checked");
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
//多条发布意见
function picReviewEditBy(_this){
    if($('#userlist_tab .list input[type=checkbox]:checked').length!=0){
        var dataID = $('#userlist_tab tbody input[type=checkbox]:checked');   //单选按钮
        var id = [];
        $.each(dataID,function(index,val){
            id.push($(val).attr("data-id"));   //获取id
        });
        edit_assessor(id);
    }else{
        returnMessage(2,'请选择公告！')
    }
}
//单条发布意见
function picEditByYes(_this){
    var id=[];
    id.push($(_this).parents("tr").find("input").attr("data-id"));
    edit_assessor(id);
}
//发布意见
function edit_assessor(id){
    $.ajax({
        type:'POST',
        url: DMBServer_url + '/web/api/article/publish.json',
        data:{ids:id},
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                returnMessage(1,'发布成功！');
                label(paGe,pageNum,keyword);
            }else{
                returnMessage(2,'发布失败！');
            }
            $("#userlist_tab thead th:first input").removeAttr("checked");
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
// 查看审核详情
function verifier(_this){
    var id=$(_this).parents("tr").find("input").attr("data-id");
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/article/'+id+'.json',
        data:{},
        dataType:'json',
        success:function(data){
            var type=data.data.user.type==0?"群众":data.data.user.type==10?"积极分子":data.data.user.type==20?"重点对象":data.data.user.type==30?"预备党员":"党员";
            if(data.code === 0){
                //$("#userName").text(data.data.user.userName);
                $("#type").text(type);
                $("#content").text(data.data.content);
                $("#reviewer").text(data.data.reviewer);
                $("#reviewTime").text(data.data.reviewTime);
                $("#name").text(data.data.user.name);
                $("#organName").text(data.data.user.organName);
                $("#joinPartyDate").text(data.data.user.joinPartyDate);
                $("#myModal").modal();
            }else{
                //无数据提醒框
                returnMessage(2,'暂无数据！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}