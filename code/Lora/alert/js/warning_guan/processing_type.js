var pageNum = 10;//每次条数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var flag = null;
var isExport=null;
$(document).ready(function(){
    isShow("","","1000400020002");
    if(!isExport){
        $(".con-oper a.export").hide();
    }
    dateChooses("#startTime","#endTime");
    load(paGe,{currentPage:paGe,pageSize:pageNum});
    //1----企业     2----设备组    3----安全管理员、巡检员
    //获取设备组下拉框信息
    facilityGroup("groupId");
    //获取报警类型下拉框信息
    getWarningType("warningType");
    //获取报警处理类型下拉框信息
    /*solutionType("solutionType");*/
});
function load(page,date){
    var pageCount,vpage;   //初始的
    //如果有keyword，则说明是搜索
    if(date!=undefined){
        $.ajax({
            type:'post',
            url: server_url + '/web/warning/searchSolvedWarnings',
            data:date,
            dataType:'json',
            success:function(data){
                $("#waring_list tbody").empty();
                if(data.code === 200){
                    var html='';
                    $.each(data.data.content,function(index,item){
                        var currentStatus=item.currentStatus=="alarm"?"报警中":item.currentStatus=="receive"?"已报警":item.currentStatus=="processing"?"处理中":item.currentStatus=="declare"?"故障申报":item.currentStatus=="applyfor"?"申报维保":item.currentStatus=="complete"?"完成":"";
                        var warningType=item.warningType=="fire_alarm"?"火警报警":item.warningType=="device_fault"?"故障报警":"";
                        html+='<tr><td><input data-id="'+item.id+'" type="checkbox" name=""><i></i></td><td>'+(index+1)+'</td><td>'+item.warningDesc+'</td><td>'+item.groupName+'</td><td>'+item.serialNumber+'</td><td>'+item.address+'</td><td>'+new Date(item.startTime).toLocaleString()+'</td><td>'+new Date(item.endTime).toLocaleString()+'</td><td>'+currentStatus+'</td><td>'+item.manager+'</td><td>'+item.companyName+'</td><td>'+warningType+'</td><td>'+item.sureWarningType+'</td></tr>';
                    });
                    $("#waring_list tbody").append(html);
                    //分页
                    pageCount = data.data.totalPages;
                    $(".total .num").text(pageCount);
                    if(pageCount>1){
                        $('.pages').removeClass("undis");
                        $(".total").removeClass("hide");
                        flag = true;
                        initPagination('#pagination',pageCount,1,page,function(num,type){
                            if(type === 'change'){
                                paGe = num;
                                date.currentPage=paGe;
                                load(paGe,date);
                            }
                        });
                    }else{
                        $('.pages').addClass("undis");
                        if(flag) {
                            paGe = 0;
                            date.currentPage=paGe;
                            load(paGe,date);
                            flag = false;
                        }
                    }
                }else if(data.code==204){
                    $("#waring_list tbody").html('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
                }else{
                    $('.pages').addClass("undis");
                    //无数据提醒框
                    returnMessage(2,data.message);
                }
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }
}
//搜索
function search(page){
    var data={
        currentPage:page,
        pageSize:pageNum,
        searchKey:$("#searchKey").val(),
        warningType:$("#warningType").val(),
        groupId:$("#groupId").val(),
        waringDesc:$("#solutionType").val()
    };
    if($("#startTime").val()!=""){
        data.searchStartTime=$("#startTime").val();
    }
    if($("#endTime").val()!=""){
        data.searchEndTime=$("#endTime").val();
    }
    load(page,data);
}
//导出Excel表格
function export_excel(_this,page){
    $(_this).attr("href",server_url+"/web/excel/exportExcel?currentPage="+page+"&type=1&tag=2&searchKey="+$("#searchKey").val()+"&warningType="+$("#warningType").val()+"&groupId="+$("#groupId").val()+"&solutionType="+$("#solutionType").val()+"");
console.log("192.168.1.136:6359"+ $(_this).attr("href"));
}

//获取报警描述下拉
$.ajax({
    type:'post',
    url: server_url + '/web/common/select',
    dataType:'json',
    data:{'type':5},
    success:function(data){
        if(data.code==200){
            var options='<option value="">全部</option>';
            $.each(data.data,function(index,item){
                options+='<option value="'+item.id+'">'+item.name+'</option>';
            });
            $("#solutionType").html(options);
        }else{
            returnMessage(2,data.message);
        }
    },
    error:function(data){
        //报错提醒框
        returnMessage(2,'报错：' +  data.status);
    }
});

//Enter
function searchKey(e){
    if(e.keyCode==13){
        search();
    }
}