//获取报警处理类型下拉框信息
function solutionType(id){
    $.ajax({
        type:'post',
        url: server_url + '/public/getTypeSolutionForJson',
        data:{},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                var options='<option value="">全部</option>';
                $.each(data.data,function(index,item){
                    options+='<option value="'+item.key+'">'+item.val+'</option>';
                });
                $("#"+id).html(options);
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
//日期初始化
function date(start_time,end_time){
    $(start_time).datetimepicker({
        format: "yyyy-mm-dd hh:ii:ss",
        autoclose: true,
        todayBtn: true,
        language: 'zh-CN',
        clearBtn: true,
        startDate:new Date()
    }).on("changeDate",function(){
        $(end_time).datetimepicker("setStartDate",$(start_time).val());
    });
    $(end_time).datetimepicker({
        format: "yyyy-mm-dd",
        minView:'month',
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true,
        startDate:new Date()
        //pickerPosition: "bottom-left"
    }).on("changeDate",function(){
        $(end_time).datetimepicker("setStartDate",$(start_time).val());
    });
}
function dateChooses(start_time,end_time){
    $(start_time).datetimepicker({
        format: "yyyy-mm-dd",
        minView:'month',
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
    }).on("changeDate",function(){
        $(end_time).datetimepicker("setStartDate",$(start_time).val());
    });
    $(end_time).datetimepicker({
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
        $(end_time).datetimepicker("setStartDate",$(start_time).val())
    });
}

//获取处理状态下拉框信息
function currentStatus(id){
    $.ajax({
        type:'post',
        url: server_url + '/public/getStatusWarningForJson',
        data:{},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                var options='<option value="">全部</option>';
                $.each(data.data,function(index,item){
                    options+='<option value="'+item.key+'">'+item.val+'</option>';
                });
                $("#"+id).html(options);
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
//获取设备组下拉框
function facility(callback){
    $.ajax({
        type:'post',
        url: server_url + '/web/common/select',
        data:{type:2},
        dataType:'json',
        success:callback,
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//获取发送对象的
function send_object(callback){
    $.ajax({
        type:'post',
        url: server_url + '/web/common/select',
        data:{type:6},
        dataType:'json',
        success:callback,
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
