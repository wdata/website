let typeId = null;
$.ajax({
    type:'get',
    url: url + robotDevice + version1 +'/device/info',
    data:{
        "id":obtain("id")
    },
    dataType:'json',
    success:function(data){
        if(data.code === 200){
            $("#sequence").val(data.data.sequence);
            $("#deviceName").val(data.data.deviceName);
            $("#version").val(data.data.version);
            typeId = data.data.typeId;

            equipment.model("#equipmentModel",data.data.typeId,0,data.data.modelId);  // 设备类型列表
            agents("#agentId",0);  // 代理商
            ome("#agentId",0);  // OME

        }else{
            layer.msg(data.message);
        }
    },
    error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
});

function determine(){
    $.ajax({
        type:'POST',
        url: url + robotDevice + version1 +'/device/edit',
        data:JSON.stringify({
            "id":obtain("id"),
            "userId":userId,
            "typeId":typeId,
            "modelId":$("#equipmentModel").val(),
            "devicelName":$("#deviceName").val(),
            "agentId":$("#agentId").val(),
            "oemId":$("#oemId").val(),
            "version":$("#version").val()
        }),
        dataType:'json',
        contentType: 'application/json',
        success:function(data){
            if(data.code === 200){
                layer.msg("修改成功！");
            }else{
                layer.msg(data.message);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
    });
}
$(function(){
    $(".determine").on("click",function(){
        determine();
    })
});