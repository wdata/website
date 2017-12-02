$(document).ready(function(){
    equipment.types("#equipmentType","#equipmentModel",0);  // 设备类型列表
    agents("#agentId",0);   // 代理商
    companyFm("#oemId");   // OME厂商

    const newForm = $("#newForm");
    newForm.on("click","#determine",function(){
        if(newForm.valid()){
            let form = new FormData(newForm[0]);       //需要是JS对象
            form.append("userId",userId);
            $.ajax({
                type:'post',
                url: url + robotDevice + version1 +'/device/add',
                data: form,
                contentType: false,
                processData: false,
                success:function(data){
                    if(data.code === 200){
                        layer.msg('添加成功');
                    }else{
                        layer.msg(data.message);
                    }
                },
                beforeSend:function(){
                    layer.load(0, {shade:[0.1,'#000']}); //0代表加载的风格，支持0-2
                },
                complete:function(){
                    layer.closeAll('loading'); //关闭信息框
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        }
    })
});



function companyFm(el){
    $.ajax({
        type:'get',
        url: url + robotAgent + version1 +'/agent/firm/list.json',
        data:null,
        dataType:'json',
        success:function(data){
            const list = $(el);  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 200){
                let listData = '';
                $.each(data.data,function(i,d){
                    listData += `<option value="${ d.id }">${ d.name }</option>`;
                });
                list.append(listData);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
    });
}