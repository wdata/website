/**
 * Created by Administrator on 2017/6/22.
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
$("#examDate").datetimepicker({
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
    $("#examDate").datetimepicker("setStartDate",$("#datetimeStart").val())
});

var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var keyword = [];  //搜索内容
var flag = null;
$(document).ready(function(){
    label(paGe,pageNum);
    // getComp("#firmId");
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
        // dataObject["firmId"] = keyword[3];
        dataObject["status"] = keyword[3];
    }
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/exams.json',
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
                        case 0:status = '<td class="status" data-status="0">未发布</td>';statusBtn = '<a onclick="onOFFClick(this,1)" class="oper-status  opened">发布</a>';
                            break;
                        case 1:status = '<td class="status" data-status="1">发布</td>';statusBtn = '<a onclick="onOFFClick(this,0)"  class="oper-status  closed">取消</a>';
                            break;
                    }
                    //性别, -1:未知,0:女,1:男,
                    var sex = '';
                    switch (val.sex){
                        case -1:sex = "未知";
                            break;
                        case 0:sex = "女";
                            break;
                        case 1:sex = "男";
                            break;
                    }
                    //阶段 0:群众,10:积极份子,20:重点对象,30预备党员,100党员
                    var stage = '';
                    switch(val.stage){
                        case 0:stage = '群众';
                            break;
                        case 10:stage = '积极份子';
                            break;
                        case 20:stage = '重点对象';
                            break;
                        case 30:stage = '预备党员';
                            break;
                        case 100:stage = '党员';
                            break;
                    }
                    listData += '<tr> <td><input onclick="checkDown(this)" type="checkbox"  data-id="'+ val.id +'"></td> <td>'+ (index + 1 + page * 10) +'</td> <td>'+ val.name +'</td> <td>'+ val.phone +'</td> <td data-status = "1">'+ sex +'</td> <td>'+ stage +'</td> <td>'+ val.organizationName +'</td> <td>'+ val.examName +'</td> <td>'+ val.examDate +'</td> <td>'+ val.examScore +'</td> '+ status +' <td> '+ statusBtn +' <a onclick="details($(this))">修改</a> <a onclick="deteleAlone(this)">删除</a> </td> </tr>';

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

//******************************************  搜索  **************************************************
function search(){
    keyword = [];
    $.each($('.input-sm .form-control'),function(index,val){
        keyword.push($(val).val());
    });
    if(keyword.length >= 1){
        console.log(keyword);
        paGe = 0;   //如果在1以上页面，则返回1页面并搜索内容
        //调用党费记录列表
        label(paGe,pageNum,keyword);
    }else{
        //无内容，不搜索，并且提示
        returnMessage(3,'请输入搜索内容！');
    }
}
//******************************************  导出  **************************************************
function Export(_this){
    var form = $("#searchForm").serialize();  //将form序列化
    $(_this).attr({"href":DMBServer_url + "/web/api/exams/export.json?" + form});
}
//******************************************  导入  **************************************************
function Import(_this){

    //判断格式
    var name = _this.value;
    var postfix = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if(postfix!=='xls' && postfix!=='xlsx'){
        returnMessage(2,'请选择xls和xlsx的格式文件上传！');
        _this.value==' ';
        return false;
    }else{

        var form = new FormData($("#Import")[0]);
        $.ajax({
            type:'post',
            url:  DMBServer_url + '/web/api/exams/import.json',
            data: form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){

                    returnMessage(1,'导入成功：'+ data.data.successCount + " ； 导入失败数：" + data.data.failCount);
                    label(paGe,pageNum);
                    importDetails(data);
                }else{
                    //data.code === -1
                    returnMessage(2,'data.code为-1');
                }
            },
            beforeSend:function(){
                $('.opering-mask').show().find('.con').text('正在处理中，处理结束后该弹窗消失！');
            },
            complete:function(){
                $('.opering-mask').hide()
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
        $(_this).val("");   //清空数据，以防noChange内容不变时，不执行函数
    }
}
//******************************************  导入模板下载  **************************************************
function templateExport(_this){
    $(_this).attr({"href":DMBServer_url + "/web/api/download/exams.xls" });
}

//******************************************删除**************************************************
//删除点击事件  参数：tr下第一个th中input的属性ID
function deteleAlone(wo){
    var self = wo;
    confirmMsg("是否删除记录",function(dialog){
        var id = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
        dialog.close();  //关闭确定提示框
        deteleRmake(id);      //调用删除函数，删除数组内的党费记录
    });
}
//选择多个删除
function deteleAll(){
    var dataID = $('#lebel_tab tbody input[type=checkbox]:checked');   //单选按钮
    var id = [];
    $.each(dataID,function(index,val){
        id.push($(val).attr("data-id"));   //获取id
    });
    confirmMsg("是否删除记录",function(dialog){
        dialog.close();  //关闭确定提示框
        deteleRmake(id);        //调用删除函数，删除数组内的党费记录
        $("#lebel_tab thead th:first input").removeAttr("checked");
    });
}

//----------------删除函数 参数：党费记录ID----------------
function deteleRmake(id){
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/exams/delete.json',
        data:{
            ids:id    //党费记录ID,数组
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
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
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
        url: DMBServer_url + '/web/api/exams/status.json',
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
                        returnMessage(1,'取消成功！');
                        break;
                    case 1:
                        //禁用成功
                        returnMessage(1,'发布成功！');
                        break;
                }
                $("#lebel_tab thead th:first input").removeAttr("checked");
                label(paGe,pageNum,keyword);
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

//******************************************修改**************************************************
//------------------取消---------------------
function cancel(){
    //隐藏添加标签框
    $(".new-label").removeClass("show").removeClass("in");
}

function details(self){
    //self = this  jquery数据
    var id = self.parent().siblings("td:first").find("input").attr("data-id");
    //请求标签详情数据
    $.ajax({
        type:'get',
        url:  DMBServer_url +  '/web/api/exams/'+ id +'.json',
        data: {},
        dataType:'json',
        success:function(data){
            if(data.code === 0){

                //显示添加标签框
                $(".new-label").addClass("show").addClass("in");

                $("#edit_id").val(data.data.id);
                $("#examName").val(data.data.examName);
                $("#examDate").val(data.data.examDate);
                $("#examScore").val(data.data.examScore);
                $("#stage").val(data.data.stage);

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
function modify(){
    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/exams/update.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0){

                //添加成功
                returnMessage(1,'修改成功！');
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
/*  导入成功导入失败
 ---------------------------------------------------------------------------------------------------------*/
function importDetails(data){
    var pageCount,vpage;   //初始的
    var html,sum = 1;
    var import_list = $(".import_list");
    import_list.empty();
    $.each(data.data.failList,function(index,val){
        //阶段 0:群众,10:积极份子,20:重点对象,30预备党员,100党员
        var type = '';
        switch(val.type){
            case 0:type = '群众';
                break;
            case 10:type = '积极份子';
                break;
            case 20:type = '重点对象';
                break;
            case 30:type = '预备党员';
                break;
            case 100:type = '党员';
                break;
        }
        var joinPartyDate = val.joinPartyDate?val.joinPartyDate:" ";
        html += '<tr><td>'+ sum +'</td>'+
            '<td>'+ val.name +'</td>'+
            '<td>'+ val.examName +'</td>'+
            '<td>'+ val.examScore +'</td></tr>';
        // <tr>
        // <th>姓名</th>
        // <th>科目</th>
        // <th>成绩</th>
        // </tr>
        sum++;
    });
    import_list.append(html);

    // 显示弹出框
    $("#importModal").addClass("show in");
}
function importDown(){
    // 关闭弹出框
    $("#importModal").removeClass("show in");
}