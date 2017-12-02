$(document).ready(function(){
    send_object(function(data){
        if(data.code==200){
            var html='';
            $.each(data.data,function(index,item){
                var checked=item.val==="安全巡检员"?"checked":"";
                var disable=item.val==="安全巡检员"?"":"disabled";
                html+='<span><input value="'+item.id+'" name="ids" type="checkbox" '+checked+' '+disable+'>'+item.val+'</span>';
            });
            $("#send_name").html(html);
        }else{
            returnMessage(2,data.message);
        }
    });
    //获取报警类型下拉框数据
    getWarningType("warningType");
});
$("#save").click(function(){
    var id=[];
    $.each($("#send_name input:checked"),function(index,item){
        id.push($(item).val());
    });
    var sendApp=$("#sendApp").prop('checked')?true:false;
    var sendSms=$("#sendSms").prop('checked')?true:false;
    var sendDviceAddress=$("#sendDviceAddress").prop('checked')?true:false;
    var sendWarningType=$("#sendWarningType").prop('checked')?true:false;
    if(sendApp||sendSms){
        $.ajax({
        type:'post',
        url: server_url + '/web/warning/addMsgPushSet',
        data:JSON.stringify({
            msgScopeType:$("input[name='device']:checked").val(),
            ids:id,
            sendApp:sendApp,
            sendSms:sendSms,
            sendDeviceAddress:sendDviceAddress,
            sendWarningType:sendWarningType,
            warningType:$("#warningType").val()
        }),
        
        'contentType' : 'application/json',
        dataType:'json',
        success:function(data){
            if(data.code==200){
                returnMessage(1,"报警推送设置添加成功");
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
        returnMessage(2,"推送目的地点至少选择一个");
    }
});