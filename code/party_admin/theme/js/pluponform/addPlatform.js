var _type='16',_subType='64';//type字段含义：16-->种类 32-->实例 48-->(组)//subType字段含义： 64-->平台 80-->应用 96-->微服务 112-->微服务接口
var obj={};
var _timeout = 5000;//ajax超时设置
//获取上级平台数据
(function(){
    $.ajax({
        type: "get",
        url: server_url + '/plat/api/platform/thinglist.json',
        dataType: 'json',
        data: {
            'type':_type,
            'subType':_subType,
            "sort":'',
            "dir":''
        },
        timeout:_timeout,
        success:function(res){
            console.log(res);
            if(res.data.length<=0){
                return false;
            }
            var options = '<option value="0">请选择上一级平台</option>';
            $.each(res.data,function(index,item){
                //console.log(item.name)
                options+=`
                    <option value="${item.id}">${item.name}</option>
                `;
            });
            $('#superior').html(options);
        },
        error:function(res){
            console.log(res);
            returnMessage(5,'获取上级平台数据失败，请稍后重试！');
        }
    });
})();
//获取单位列表
(function(page,size){
    $.ajax({
        type:'get',
        url:server_url+'/crm/unit/list/data.json',
        dataType:'json',
        data:{
            'page':page,
            'size':size,
            //"auStatus":1//认证通过的单位
        },
        timeout:_timeout,
        success:function(data){
            console.info(data);
            var oData=data.data;
            var code="";
            for(var i=0;i<oData.items.length;i++){
                code+=`
                    <option value="${oData.items[i].name}" data-orgid="${oData.items[i].orgId}">${oData.items[i].name}</option>
				`;
            }
            $('#unit').html(code);
        },
        error:function(res){
            console.log(res);
            returnMessage(5,'获取单位列表数据失败，请稍后重试！');
        }
    })
})(1,10000);




//保存新增平台：
$('#save_btn').click(function(){
    obj._superior = $("#superior").val();
    _name = $('#platform').val();
    obj._version = $("#version").val();
    obj._location = $('#location').val();
    obj._unit =$('#unit').val();
    obj._orgid =$('#unit option:selected').data('orgid');
    obj._desc = $('#describe').val();
    console.dir(obj);
    postData();
    return false;
});
function postData(){
    $.ajax({
        type:"post",
        url:server_url+'/plat/api/platform.json',
        dataType:'json',
        data:{
            "relationType":16,
            "pid":obj._superior,
            "type":_type,
            "subType":_subType,
            "name":_name,
            "desc":obj._desc,
            "extension":{
                "superior":obj._superior,
                "versionCode":obj._version,
                "locationId":obj._location,
                "organizationId":obj._orgid,
                "orgName":obj._unit
            }
        },
        timeout:_timeout,
        success:function(res){
            console.log(res);
            if(res.code==0){
                successMsg(res.code,0,res.message);
                clearForm($('.form-group .form-control'));
            }else{
                returnMessage(2,res.message);
            }
        },
        error:function(res){
            console.log(res);
            if(res.readyState==0){
                returnMessage(5,'保存失败，请稍后重试！');
            }

        }

    })
}


//清除表单元素
function clearForm(elem){
    $.each(elem,function(index,item){
        console.log(item.type);
        switch(item.type){
            case 'passsword':
            case 'select-multiple':
            case 'text':
            case 'textarea':
                $(item).val('');
                break;
            case 'select-one':
                $(item).val('');//select元素的第一个option的value必须为空''；
                break;
            case 'checkbox':
            case 'radio':
                item.checked = false;
        }
    });
}



