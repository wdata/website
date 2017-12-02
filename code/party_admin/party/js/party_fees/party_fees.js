/**
 * Created by Administrator on 2017/6/22.
 */
/*日期初始化*/
$("#datetimeStart").datetimepicker({
    format: "yyyy-mm",
    startView:'year',
    minView:'year',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
}).on("click",function(){
    $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
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
        dataObject["month"] = keyword[1];
        dataObject["firmId"] = keyword[2];
        dataObject["status"] = keyword[3];
    }
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/dues.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            const list = $(".list");  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 0){
                var listData = '';
                $.each(data.data.items,function(index,val){
                    //支付状态 0:未支付,1已支付
                    var payStatus = '<th class="status" data-status="0">null</th>';
                    switch (val.payStatus){
                        case 0:payStatus = '<th class="payStatus" data-payStatus="0">未支付</th>';
                            break;
                        case 1:payStatus = '<th class="payStatus" data-payStatus="1">已支付</th>';
                            break;
                    }
                    //为空时，会出现undefined
                    var payNumber = val.payNumber?val.payNumber:" ";
                    var payTime = val.payTime?val.payTime:" ";
                    listData += '<tr> <th><input onclick="checkDown(this)" type="checkbox"  data-id="'+ val.id +'"></th> <th>'+ (index + 1 + page * 10) +'</th> <th>'+ val.username +'</th> <th>'+ val.name +'</th> <th>'+ val.month +'</th> <th>'+ val.money +'</th> <th>'+ val.createTime +'</th> '+ payStatus +' <th>'+ payTime +'</th><th>'+ payNumber +'</th><th>'+ val.organizationName +'</th> <th>'+  val.companyName  +'</th> <th> <a  onclick="deteleAlone(this)">删除</a> </th> </tr>';
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
    $(_this).attr({"href":DMBServer_url + "/web/api/dues/export.json?" + form});
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
            url:  DMBServer_url + '/web/api/dues/import.json',
            data: form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){

                    returnMessage(1,'导入成功：'+ data.data.successCount + " ； 导入失败数：" + data.data.failCount);
                    label(paGe,pageNum);
                    importDetails(data);

                }else{

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
    $(_this).attr({"href":DMBServer_url + "/web/api/download/dues.xls" });
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
    if(!(id.length === 0)){
        confirmMsg("是否删除记录",function(dialog){
            dialog.close();  //关闭确定提示框
            deteleRmake(id);        //调用删除函数，删除数组内的党费记录
        });
    }else{
        returnMessage(2,'请选择至少一条数据进行删除！');
    }
}

//----------------删除函数 参数：党费记录ID----------------
function deteleRmake(id){
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/dues/delete.json',
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
            $("#lebel_tab thead th:first input").removeAttr("checked");
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
        html += '<tr><td>'+ sum +'</td>'+
            '<td>'+ val.username +'</td>'+
            '<td>'+ val.name +'</td>'+
            '<td>'+ val.month +'</td>'+
            '<td>'+ val.money +'</td>'+
            '<td>'+ val.payTime +'</td>'+
            '<td>'+ val.payNumber +'</td></tr>';
            // <tr>
            // <td>序号</td>
            // <td>账号</td>
            // <td>姓名</td>
            // <td>缴纳月份</td>
            // <td>金额</td>
            // <td>缴费时间</td>
            // <td>支付流水</td>
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