var pageNum = 10;//每次条数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var flag = null;
var isExport=null,isAlarm=null,isKoriyasu=null;
$(document).ready(function(){
    isShow("","","1000400010002","1000400010001","1000400010003");
    //导出
    if(!isExport){
        $(".con-oper a.export").hide();
    }
    //手动报警推送
    if(!isAlarm){
        $(".con-oper .open.alarm").hide();
    }
    //维保
    if(!isKoriyasu){
        $(".con-oper .open.koriyasu").hide();
    }
    /*日期初始化*/
    dateChooses("#startTime","#endTime");


    //获取设备组下拉框信息
    facilityGroup("groupId");
    //获取报警类型下拉框信息
    getWarningType("warningType");


/*
    //获取处理状态下拉框信息
    function currentStatus(){
        $.ajax({
            type:'post',
            url: server_url + '/public/getStatusWarningForJson',
            data:{},
            dataType:'json',
            success:function(data){
                console.log(1);
                if(data.code==200){
                    var options='<option value="">全部</option>';
                    $.each(data.data,function(index,item){
                        options+='<option value="'+item.key+'">'+item.val+'</option>';
                    });
                    $("#"+id).html(options);
                    if(sessionStorage.getItem("currentStatus")){
                        $("#currentStatus").val(sessionStorage.getItem("currentStatus"));

                    }
                }else{
                    returnMessage(2,data.message);
                }
                return 3333;
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }
    //获取报警描述下拉
    function waringDescSelect(){
        $.ajax({
            type:'post',
            url: server_url + '/web/common/select',
            dataType:'json',
            data:{'type':5},
            success:function(data){
                console.log(2);
                if(data.code==200){
                    var options='<option value="">全部</option>';
                    $.each(data.data,function(index,item){
                        options+='<option value="'+item.id+'">'+item.name+'</option>';
                    });
                    $("#solutionType").html(options);
                    if(sessionStorage.getItem("waringDesc")){
                        $("#solutionType").val(waringDesc);
                    }
                }else{
                    returnMessage(2,data.message);
                }
                return true;
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }

    */


    $.when(
        $.ajax({//获取处理状态下拉框信息
            type:'post',
            url: server_url + '/public/getStatusWarningForJson',
            data:{},
            dataType:'json',
            beforeSend:function(){
                $('.opering-mask').show();
            },
            success:function(data){
                console.log(1);
                if(data.code==200){
                    var options='<option value="">全部</option>';
                    $.each(data.data,function(index,item){
                        options+='<option value="'+item.key+'">'+item.val+'</option>';
                    });
                    $("#currentStatus").html(options);
                    if(sessionStorage.getItem("currentStatus")){
                        $("#currentStatus").val(sessionStorage.getItem("currentStatus"));
                    }
                }else{
                    returnMessage(2,data.message);
                }
                return 3333;
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        })
        ,
        $.ajax({//获取报警描述下拉
            type:'post',
            url: server_url + '/web/common/select',
            dataType:'json',
            data:{'type':5},
            success:function(data){
                console.log(2);
                if(data.code==200){
                    var options='<option value="">全部</option>';
                    $.each(data.data,function(index,item){
                        options+='<option value="'+item.id+'">'+item.name+'</option>';
                    });
                    $("#solutionType").html(options);
                    if(sessionStorage.getItem("waringDesc")){
                        $("#solutionType").val(waringDesc);
                    }
                }else{
                    returnMessage(2,data.message);
                }
                return true;
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        })
    ).then(function(){
        console.log('ok');
        search(1);
    });
    var waringDesc="";
    if(sessionStorage.getItem("waringDesc")){
        waringDesc=sessionStorage.getItem("waringDesc");
        $("#solutionType").val(waringDesc);
    }else{
        waringDesc=null;
    }
    //load(paGe,{currentPage:paGe,pageSize:pageNum,warningDesc:waringDesc});

});
function load(page,date){
    var pageCount;   //初始的
    //如果有keyword，则说明是搜索
    if(date!=undefined){
        $.ajax({
            type:'post',
            url: server_url + '/web/warning/searchUnsolvedWarnings',
            data:date,
            dataType:'json',
            complete:function(){
                $('.opering-mask').hide();
            },
            success:function(data){
                $("#waring_list tbody").empty();
                if(data.code === 200){
                    var html='';
                    $.each(data.data.content,function(index,item){
                        var currentStatus=item.currentStatus=="alarm"?"报警中":item.currentStatus=="receive"?"已报警":item.currentStatus=="processing"?"处理中":item.currentStatus=="declare"?"故障申报":item.currentStatus=="applyfor"?"申请维保":item.currentStatus=="complete"?"完成":"";
                        var warningType=item.warningType=="fire_alarm"?"火警报警":item.warningType=="device_fault"?"故障报警":"";
                        var handle=null;
                        if(item.currentStatus=="complete"){
                            handle="-";
                        }else{
                            if(isAlarm){
                                if(isKoriyasu){
                                handle='<a onclick="maintenance([\''+item.id+'\'],\''+item.currentStatus+'\')" style="margin:0 15px;">申请维保</a><a onclick="push([\''+item.id+'\'])" >报警推送</a>'
                                }else{
                                    handle='<a onclick="push([\''+item.id+'\'])">报警推送</a>'
                                }
                            }else{
                                if(isKoriyasu){
                                    handle='<a onclick="maintenance([\''+item.id+'\'],\''+item.currentStatus+'\')" style="margin:0 15px;">申请维保</a>'
                                }else{
                                    handle="-";
                                }
                            }
                        }

                            html+='<tr><td><input data-id="'+item.id+'" type="checkbox" name=""><i></i></td><td>'+(index+1)+'</td><td>'+item.warningDesc+'</td><td>'+item.deviceName+'</td><td>'+item.serialNumber+'</td><td>'+warningType+'</td><td>'+item.address+'</td><td>'+new Date(item.startTime).toLocaleString()+'</td><td>'+new Date(item.endTime).toLocaleString()+'</td><td class="statues" data_status="'+item.currentStatus+'">'+currentStatus+'</td><td>'+item.manager+'</td><td>'+item.patrol+'</td><td>'+item.groupName+'</td><td>'+item.companyName+'</td><td>'+item.sureWarningType+'</td><td style="color: #4395ff; cursor:pointer;white-space:nowrap; overflow:hidden; text-overflow:ellipsis">'+handle+'</td></tr>';

                    });
                    $("#waring_list tbody").html(html);
                    //分页
                    pageCount = data.data.totalPages;//总页数
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
                    $('.pages').addClass("undis");
                    $("#waring_list tbody").html('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
                }else{
                    //无数据提醒框
                    $('.pages').addClass("undis");
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
        currentStatus:$("#currentStatus").val(),
        warningDesc:$("#solutionType").val()
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
    $(_this).attr("href",server_url+"/web/excel/exportExcel?currentPage="+page+"&type=0&tag=2&searchKey="+$("#searchKey").val()+"&warningType="+$("#warningType").val()+"&groupId="+$("#groupId").val()+"&currentStatus="+$("#currentStatus").val());
}
//多条改变维保状态
function adit_main(){
    if($('#waring_list tbody input[type=checkbox]:checked').length!=0){
        var dataID = $('#waring_list tbody input[type=checkbox]:checked');   //单选按钮
        var id = [];
        $.each(dataID,function(index,val){
            id.push($(val).attr("data-id"));   //获取id
        });
        var status=$('#waring_list tbody input[type=checkbox]:checked').parents("tr").find(".statues");
        var currentStatus=[];
        $.each(status,function(index,item){
            currentStatus.push($(item).attr("data_status"));
        });
        if(currentStatus.indexOf("alarm")==-1&&currentStatus.indexOf("receive")==-1&&currentStatus.indexOf("processing")==-1&&currentStatus.indexOf("applyfor")==-1&&currentStatus.indexOf("complete")==-1&&currentStatus.indexOf("declare")!=-1){
            maintenance(id,'declare');      //调用删除函数，删除列表中的图片
        }else{
            returnMessage(2,'只有故障申报的处理状态才能申请维保！')
        }
    }else{
        returnMessage(2,'请选择需要申请维保的数据！')
    }
}
//改变维保状态
function maintenance(_id,currentStatus){
    if(currentStatus=="declare"){
        $.ajax({
        type:'post',
        url: server_url + '/web/warning/applyforMaintence',
        data:JSON.stringify({ids:_id}),
        dataType:'json',
        contentType: 'application/json',
        traditional:true,
        success:function(data){
            if(data.code==200){
                returnMessage(1,data.message);
                load(1,{currentPage:paGe,pageSize:pageNum});
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
    }else{
        returnMessage(2,'当前处理状态不能申请维保！')
    }
}
//多条报警推送
function edit_push(){
    if($('#waring_list tbody input[type=checkbox]:checked').length!=0){
        var dataID = $('#waring_list tbody input[type=checkbox]:checked');   //单选按钮
        var id = [];
        $.each(dataID,function(index,val){
            id.push($(val).attr("data-id"));   //获取id
        });
        push(id);
    }else{
        returnMessage(2,'请选择需要修改的数据！')
    }
}
//报警推送
function push(_id){
    $.ajax({
        type:'post',
        url: server_url + '/web/warning/manualSendWarnings',
        data:JSON.stringify({ids:_id}),
        dataType:'json',
        beforeSend:function(){
            $('.opering-mask').show();
        },
        complete:function(){
            $('.opering-mask').hide();
        },
        contentType: 'application/json',
        traditional:true,
        success:function(data){
            if(data.code==200){
                returnMessage(1,"报警推送成功！！");
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });

}

//Enter
function searchKey(e){
    if(e.keyCode==13){
        search();
    }
}