/**
 * Created by Administrator on 2017/6/14.
 */
var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var keyword = null;  //搜索内容
var flag = null;
$(document).ready(function(){
    label(paGe,pageNum);
});
function label(page,size,keyword){
    var pageCount,vpage;   //初始的
    //开始时显示数据
    var dataObject = {
        page:page,
        size:size
    };
    //如果有keyword，则说明是搜索
    if(keyword){
        dataObject["keyword"] = keyword;
    }

    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/tags.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            $("#lebel_tab thead th:first input").removeAttr("checked");
            const list = $(".list");  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 0){
                var listData = '';
                $.each(data.data.items,function(index,val){
                    //状态, 0:禁用, 1:启用
                    var status = '<td class="status" data-status="0">null</td>';
                    var statusBtn = '<button class="btn">null</button>';
                    switch (val.status){
                        case 0:status = '<td class="status" data-status="0">禁用</td>';statusBtn = '<a onclick="onOFFClick(this,1)" class="oper-status  closed">已禁用</a>';
                            break;
                        case 1:status = '<td class="status" data-status="1">启用</td>';statusBtn = '<a onclick="onOFFClick(this,0)"  class="oper-status  opened">已启用</a>';
                            break;
                    }
                    listData += ' <tr> <td><input onclick="checkDown(this)" type="checkbox" data-isSystem="'+ val.isSystem +'" data-id="'+ val.id +'"></td> <td>'+ (index + 1 + page * 10) +'</td> <td>'+ val.name +'</td><td>'+ val.remark +'</td> <td>'+ val.sort +'</td>'+ status +' <td class="caozhuo"> '+ statusBtn +' <a onclick="modifyLabel($(this))" >修改</a> <a  onclick="deteleAlone(this)">删除</a> </td> </tr>'
                });
                list.append(listData);

                //分页
                pageCount = data.data.pageCount;
                vpage = pageCount>10?10:pageCount;
                if(pageCount>1){
                    $('.pages').show();
                    flag = true;
                    initPagination('#pagination',pageCount,vpage,page + 1,function(num,type){
                        if(type === 'change'){
                            paGe = num - 1;
                            label(paGe,pageNum,keyword);
                        }
                    });
                }else{
                    if(flag){
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
    label(paGe,pageNum);
    $(_this).siblings('input').val(num);
}


//******************************************删除**************************************************
//删除点击事件  参数：tr下第一个th中input的属性ID
function deteleAlone(wo){
    var self = wo;
    if(parseInt($(self).parents("tr").find("input[type=checkbox]").attr("data-isSystem")) === 1){
        returnMessage(2,'该标签是系统内置标签,禁止删除!');
    }else{
        confirmMsg("是否删除标签",function(dialog){
            var id = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
            dialog.close();  //关闭确定提示框
            deteleRmake(id);      //调用删除函数，删除数组内的标签
        });
    }
}
//选择多个删除
function deteleAll(){
    var dataID = $('#lebel_tab tbody input[type=checkbox]:checked');   //单选按钮
    var id = [];
    var bur = false;
    $.each(dataID,function(index,val){
        if(parseInt($(val).attr("data-isSystem")) === 1){
            //有系统内置标签禁止删除跳过
            bur = true;
        }else{
            id.push($(val).attr("data-id"));   //获取id
        }
    });
    if(bur){
        returnMessage(2,'该频道是系统内置标签,禁止删除!');
        return ;
    }
    if(!(id.length === 0)){
        confirmMsg("是否删除记录",function(dialog){
            dialog.close();  //关闭确定提示框
            deteleRmake(id);        //调用删除函数，删除数组内的党费记录
        });
    }else{
        returnMessage(2,'请选择至少一条数据进行删除！');
    }
}



//******************************************启用，禁用**************************************************
//选择多个启用或者禁用
function onOFFAll(status){
    var dataID = $('#lebel_tab tbody input[type=checkbox]:checked');   //单选按钮
    var id = [];
    $.each(dataID,function(index,val){
        id.push($(val).attr("data-id"));   //获取id
    });
    if(id.length > 0){
        onOFF(id,status);   //调用函数
    }else{
        returnMessage(3,'请选择标签！');
    }
}
//单个点击
function onOFFClick(wo,status){
    var self = wo;
    var id = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
    if(id.length > 0){
        switch (status){
            case 0:
                onOFF(id,status);
                break;
            case 1:
                onOFF(id,status);
                break;
        }
    }else{
        returnMessage(3,'请选择标签！');
    }
}



//******************************************搜索标签******************************************
function search(){
    var account = $("#account");
    keyword = account.val();
    if(keyword.length >= 0){
        paGe = 0;   //如果在1以上页面，则返回1页面并搜索内容
        //调用标签列表
        label(paGe,pageNum,keyword);
        //清空输入框内容
        account.val("");
    }else{
        //无内容，不搜索，并且提示
        returnMessage(3,'请输入搜索内容！');
    }
}



//-----------------------------------------新添加标签-------------------------------------------------------
function newLabel(){
    //显示添加标签框
    $(".new-label").addClass("show").addClass("in");
}

//------------------确定---------------------
function picEditYes(){
    if($("#newForm").valid()){
        $("#edit_id").val('');
        var form = new FormData($("#newForm")[0]);       //需要是JS对象
        $.ajax({
            type:'post',
            url:  DMBServer_url + '/web/api/tags.json',
            data: form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){

                    //添加成功
                    returnMessage(1,'添加成功！');
                    //刷新数据
                    label(paGe,pageNum);
                    //隐藏添加标签框
                    $(".new-label").removeClass("show").removeClass("in");

                }else{
                    //data.code === -1
                    returnMessage(2,'data.code为-1');
                }
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }
}
//------------------取消---------------------
function picEditNo(){
    //隐藏添加标签框
    $(".new-label").removeClass("show").removeClass("in");
    $("#xiuGai").attr("onclick","picEditYes()");  //修改确定点击事件 -- 修改为添加事件
}


//-------------------------------------------修改标签---------------------------------------------------
function modifyLabel(self){
    //self = this  jquery数据
    var id = self.parent().siblings("td:first").find("input").attr("data-id");
    //请求标签详情数据
    $.ajax({
        type:'get',
        url:  DMBServer_url +  '/web/api/tags/'+ id +'.json',
        data: {},
        dataType:'json',
        success:function(data){
            if(data.code === 0){

                //显示添加标签框
                $(".new-label").addClass("show").addClass("in");

                //添加数据
                $("#name").val(data.data.name);  //标签名
                $("#sort").val(data.data.sort);  //热门值
                $("#remark").val(data.data.remark);  //描述
                data.data.status === 1?$("#open").attr("checked",true):$("#close").attr("checked",true);   //是否禁用

                $("#xiuGai").attr("onclick","ajaxXiuGai("+ data.data.id +")");  //修改确定点击事件  -- 修改为修改事件

            }else{
                //data.code === -1
                returnMessage(2,'修改失败：data.code为'+ data.code +'');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}

//确定按钮 ----  修改标签
function ajaxXiuGai(id){
    $("#edit_id").val(id);
    var form = $("#newForm").serialize();   //序列化
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/tags/update.json',
        data: form,
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){

                //添加成功
                returnMessage(1,'修改成功！');
                //刷新数据
                label(paGe,pageNum);
                //隐藏添加标签框
                $(".new-label").removeClass("show").removeClass("in");

                $("#xiuGai").attr("onclick","picEditYes()");  //修改确定点击事件 -- 修改为添加事件

            }else{
                //data.code === -1
                returnMessage(2,'data.code为-1');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}



//-----------------------------------------删除函数 参数：标签ID-------------------------------------------------------
function deteleRmake(id){
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/tags/delete.json',
        data:{
            ids:id    //标签ID,数组
        },
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                //删除成功
                returnMessage(1,'删除成功！');
                label(paGe,pageNum);
            }else{
                //无数据提醒框
                returnMessage(2,'修改失败！');
            }
            $("#lebel_tab thead th:first input").removeAttr("checked");
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//------------------------------------------启用/关闭标签---------------------------------------------
function onOFF(id,status){
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/tags/status.json',
        data:{
            ids	:id,    //标签ID，数组
            status:status  //状态, 0:禁用,1:启用
        },
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                switch (status){
                    case 0:
                        //启用成功
                        returnMessage(1,'禁用成功！');
                        break;
                    case 1:
                        //禁用成功
                        returnMessage(1,'启用成功！');
                        break;
                }
                label(paGe,pageNum);
                $("#lebel_tab thead th:first input").removeAttr("checked");
            }else{
                //无数据提醒框
                returnMessage(2,'修改失败！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
}