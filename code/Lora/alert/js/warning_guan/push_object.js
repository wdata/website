var id=null;
var isAdd=null,isEdit=null;
$(document).ready(function(){
    isShow("1000400030001","1000400030002");
    //目前没有添加操作
    if(!isAdd){

    }
    load();
    //获取报警类型下拉框信息
    $.ajax({
        type:'post',
        url: server_url + '/public/getTypeWarningForJson',
        data:{},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                var options='';
                $.each(data.data,function(index,item){
                    options+='<option value="'+item.key+'">'+item.val+'</option>';
                });
                $("#warningType").html(options);
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
});
function load(){
    $.ajax({
            type:'post',
            url: server_url + '/web/warning/getMsgPushList',
            data:{},
            dataType:'json',
            success:function(data){
                $("#waring_list tbody").empty();
                if(data.code==200){
                    var html='';
                    $.each(data.data,function(index,item){
                        if (item.warningType === 'fire_alarm') {//火警
                            sessionStorage.setItem('fire_alarm_voice', item.warningVoiceDomain);
                            sessionStorage.setItem('fire_alarm_open', item.voiceOpen);
                        } else {//故障
                            sessionStorage.setItem('device_fault_voice', item.warningVoiceDomain);
                            sessionStorage.setItem('device_fault_open', item.voiceOpen);
                        }

                        var sendApp='',sendSms='',sendDeviceAddress='',sendWarningType='';
                        if(item.sendApp){
                            sendApp="APP";
                        }
                        if(item.sendSms){
                            sendSms="短信";
                        }
                        if(item.sendDeviceAddress){
                            sendDeviceAddress="设备详细地址";
                        }
                        if(item.sendWarningType){
                            sendWarningType="报警类型";
                        }
                        var warningTypeName=item.warningType=="device_fault"?"故障报警":item.warningType=="fire_alarm"?"火警报警":"";
                        var edit ="";
                        if(isEdit){
                            edit=`<a class="btn" onclick="myModal('${item.id}');">修改</a>`;
                        }else{
                            edit='-';
                        }
                        html+=`
                        <tr>
                            <td><input type="checkbox" data-id="${item.id}"><i></i></td>
                            <td>${index+1}</td><td>${warningTypeName}</td>
                            <td>${sendApp+' '+sendSms}</td>
                            <td>${item.sendObject}</td>
                            <td>${sendDeviceAddress+' '+sendWarningType}</td>
                            <td>${edit}</td>
                        </tr>`;
                    });
                    $("#waring_list tbody").html(html);

                }else if(data.code==204){
                    $("#waring_list tbody").html('<tr><td style="text-align: center" colspan="7">当前条件下无数据展示！！！</td></tr>');
                }else{
                    returnMessage(2,data.message);
                }
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' + data.status);
            }
        });
}

var warningVoiceChange = '';
function myModal(_id){
    $('#newForm')[0].reset();
    $.ajax({
        type:'post',
        url: server_url + '/web/warning/getMsgPushSetById',
        data:{id:_id},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                $.ajax({
                    type:'post',
                    url: server_url + '/public/getTypeRoleForJson',
                    data:{},
                    dataType:'json',
                    success:function(date){
                        if(date.code==200){
                            var html='';
                            $.each(date.data,function(index,item){
                                var checked=item.val==="安全巡检员"?"checked":"";
                                var disable=item.val==="安全巡检员"?"disabled":item.val==="服务商管理员"?"disabled":item.val==="运营商管理员"?"disabled":"";
                                if(data.data.sendObject!=null&&data.data.sendObject.indexOf(item.val)!=-1){
                                    checked="checked";
                                }
                                html+=`<label><input data-id="${item.id}" ${checked} type="checkbox" ${disable} value=""><i></i>${item.val}</label>`;
                            });
                            $("#send_name").html(html);
                        }else{
                            returnMessage(2,data.message);
                        }
                    },
                    error:function(date){
                        //报错提醒框
                        returnMessage(2,'报错：' + date.status);
                    }
                });
                id=data.data.id;
                $("#warningType").val(data.data.warningType);
                if(data.data.sendApp){
                    $("#sendApp").prop('checked', true);
                }
                if(data.data.sendDeviceAddress){
                    $("#sendDeviceAddress").prop('checked', true);
                }
                if(data.data.sendSms){
                    $("#sendSms").prop('checked', true);
                }
                if(data.data.sendWarningType){
                    $("#sendWarningType").prop('checked', true);
                }

                if(data.data.msgScopeType=="device"){
                    $("#device").prop('checked', true);
                }else if(data.data.msgScopeType=="deviceGroup"){
                    $("#deviceGroup").prop('checked', true);
                }else if(data.data.msgScopeType=="allDeviceGroup"){
                    $("#allDeviceGroup").prop('checked', true);
                }
                warningVoiceChange = data.data.warningVoice;
                if(data.data.voiceOpen){
                    $("#voiceOpen").prop('checked', true);
                }else {
                    $("#voiceOpen").prop('checked', false);
                }
                $("#myModal").modal();
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
}
$("#save").click(function(){
    var $warningVoice = $('#warningVoice');
    if($warningVoice.val()!==''){
        console.log($('#warningVoice')[0].files[0].size);
        var filesForm = new FormData();
        filesForm.append('file',$warningVoice[0].files[0]);
        $.ajax({
            type:'post',
            url:server_url+"/file/uploadFile",
            contentType:false,
            processData:false,
            data:filesForm,
            success:function(res) {
                if(res.code==200){
                    warningVoiceChange = res.data[0].url;
                    unData();
                }
            },
            error:function(res){
                returnMessage(2,'报错：' +  res.status);
            }
        });
    }else {
        unData();
    }

});


function unData(){
    var ids=[];
    $.each($("#send_name input:checked"),function(index,item){
        ids.push($(item).attr("data-id"));
    });
    var sendApp=$("#sendApp").prop('checked')?true:false;
    var sendSms=$("#sendSms").prop('checked')?true:false;
    var sendDeviceAddress=$("#sendDeviceAddress").prop('checked')?true:false;
    var sendWarningType=$("#sendWarningType").prop('checked')?true:false;
    var voiceOpen = $('#voiceOpen').is(':checked');
    if(sendApp||sendSms){
        $.ajax({
            type:'post',
            url: server_url + '/web/warning/updateMsgPushSet',
            data:JSON.stringify({
                id:id,
                msgScopeType:$("input[name='device']:checked").val(),
                ids:ids,
                sendApp:sendApp,
                sendSms:sendSms,
                sendDeviceAddress:sendDeviceAddress,
                sendWarningType:sendWarningType,
                warningType:$("#warningType").val(),
                warningVoice:warningVoiceChange,
                voiceOpen:voiceOpen
            }),
            dataType:'json',
            contentType: 'application/json',
            success:function(data){
                if(data.code==200){
                    returnMessage(1,"修改成功");
                    $('#myModal').modal('hide');
                    load();
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
}

//判断音乐文件
function uploadVoice(_this){
    var file = _this.files[0];
    if(file.type!=='audio/mp3'){
        returnMessage(2,'请上传MP3格式的文件！');
        _this.value='';
        return false;
    }
}
