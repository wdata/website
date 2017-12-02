/**
 * Created by Administrator on 2017/6/20.
 */
/*日期初始化*/
$("#datetimeStart").datetimepicker({
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
$("#datetimeEnd").datetimepicker({
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

var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var keyword = [];  //搜索内容
var flag = null;
$(document).ready(function(){
    label(paGe,pageNum);
    // getComp("#company_select");
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
        dataObject["keyword"] = keyword[0];
        dataObject["begin"] = keyword[1];
        dataObject["end"] = keyword[2];
        dataObject["firmId"] = keyword[3];
        dataObject["status"] = keyword[4];
    }
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/templates.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
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
                    //所属栏目 模板分类 1:党组带头,2:领导表率,3:支部堡垒,4:党员先锋
                    var type = '';
                    switch(val.type){
                        case 1:type = '党组带头';
                            break;
                        case 2:type = '领导表率';
                            break;
                        case 3:type = '支部堡垒';
                            break;
                        case 4:type = '党员先锋';
                            break;
                    }
                    listData += '<tr><td><input onclick="checkDown(this)" type="checkbox" data-id="'+ val.id +'" data-isSystem="'+ val.isSystem +'"></td> <td>'+ (index + 1 + page * 10) +'</td> <td class="img"><img src="'+ unite_img_url + val.icon +'" alt=""></td> <td>'+ val.name +'</td> <td>'+ val.remark +'</td> <td>'+ type +'</td> <td>'+ val.createTime +'</td> <td>'+ val.companyName +'</td> '+ status +' <td class="caozhuo"> '+ statusBtn +' <button class="btn bg-info text-muted btn-dialog-tab" href="party/label/account/account_modify.html" onclick="modifyAccount(this)">修改</button> <a  onclick="deteleAlone(this)">删除</a> </td></tr>'
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

//******************************************修改 -- 页面**************************************************
function modifyAccount(self){
    session("modify_Id",$(self).parent().siblings("td").find("input[type=checkbox]").attr("data-id"));   //将频道ID存入临时存储：channel_xiuGai_Id
}
//******************************************  搜索  **************************************************
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

//******************************************启用，禁用**************************************************
//选择多个启用或者禁用
function onOFFAll(status){
    var dataID = $('#lebel_tab tbody input[type=checkbox]:checked');   //单选按钮
    var id = [];
    $.each(dataID,function(index,val){
        id.push($(val).attr("data-id"));   //获取id
    });
    onOFF(id,status);   //调用函数
}
//单个点击
function onOFFClick(wo,status){
    var self = wo;
    switch (status){
        case 0:
            var id1 = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
                onOFF(id1,status);
            break;
        case 1:
            var id2 = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
                onOFF(id2,status);
            break;
    }
}

//----------------------启用/关闭台账模板AJAX--------------
function onOFF(id,status){
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/templates/status.json',
        data:{
            ids	:id,    //台账模板ID，数组
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

//******************************************删除**************************************************
//删除点击事件  参数：tr下第一个th中input的属性ID
function deteleAlone(wo){
    var self = wo;
    if(parseInt($(self).parents("tr").find("input[type=checkbox]").attr("data-isSystem")) === 1){
        returnMessage(2,'该模板是系统内置标签,禁止删除!');
    }else{
        confirmMsg("是否删除模板",function(dialog){
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

//----------------删除函数 参数：台账模板ID----------------
function deteleRmake(id){
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/templates/delete.json',
        data:{
            ids:id    //台账模板ID,数组
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