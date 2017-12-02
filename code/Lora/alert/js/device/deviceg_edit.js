var cur_id=sessionStorage.getItem('deviceg_id');
//获取当前信息
$.ajax({
    type:'post',
    url:server_url+'/web/device/getDeviceGroupInfo',
    dataType:'json',
    data:{'id':cur_id,'userId':userId},
    success:function(data){
        var oData=data.data;
        $('#main_form input[name=groupName]').val(oData.groupName);
        $('#main_form input[name=address]').val(oData.address);
        $('#main_form textarea[name=description]').val(oData.groupDesc);
        $('#main_form input[name=longitude]').val(oData.longitude);
        $('#main_form input[name=latitude]').val(oData.latitude);
        
        //session传值给iframe
        sessionStorage.setItem('map_lng',oData.longitude);
        sessionStorage.setItem('map_lat',oData.latitude);

        getDevicegSel(oData.companyId,oData.parentId);
        getProvinceSel(oData.region);
    },
    error: function (data) {
        returnMessage(2, data.status);
    }
});

function setSel(sel_id,val_id){
    $(sel_id).find('option').each(function(){
        if($(this).attr('value')==val_id){
            $(this).prop('selected','true');
        }
    })
}

//获取省市级
var areaData;
function getProvinceSel(str){
    $.ajax({
        type:'post',
        url:server_url+'/public/getRegion',
        dataType:'json',
        data:{'userId':userId},
        success:function(data){
            if(data.code===200){
                areaData=data.data;
                var prov_code=`<option value="">请选择省份</option>`;
                $.each(areaData,function(index,item){
                    var selected=!str?' ':(str.indexOf(item.name)!=-1)?"selected":'';
                    prov_code+=`<option value=${item.id} ${selected}>${item.name}</option>`;
                })
                $('#province').html(prov_code);
                getCitySel(str);
            }else{
                returnMessage(2, data.message);
            }
        },
        error: function (data) {
            returnMessage(2, data.status);
        }
    })
} 
function getCitySel(str){
    var city_code=`<option value="">请选择城市</option>`;
    $.each(areaData,function(index,item){
        if(item.id==$('#province').val()){
            $.each(areaData[index].citys,function(index,item){
                var selected=!str?' ':(str.indexOf(item.name)!=-1)?"selected":'';
                city_code+=`<option value=${item.id} ${selected}>${item.name}</option>`;
            })
        }
    })
    $('#city').html(city_code);
     getCountrySel(str);
}
function getCountrySel(str){
    var country_code=`<option value="">请选择地区</option>`;
    $.each(areaData,function(index,item){
        if(item.id==$('#province').val()){
            var cur_prov=areaData[index].citys;
            $.each(cur_prov,function(index,item){
                if(item.id===$('#city').val()){
                    $.each(cur_prov[index].countys,function(index,item){
                        var selected=!str?' ':(str.indexOf(item.name)!=-1)?"selected":'';

                        country_code+=`<option value=${item.id} ${selected}>${item.name}</option>`; 
                    })
                }
               
            })
        }
    })
    $('#country').html(country_code);
}     

//获取设备组
function getDevicegSel(id,deviceg_id){
    var id_val=id?id:$('#company_sel').val();
    getSelect({'type':2,'userId':userId,'id':id_val},function(data){
        //console.info(data);
        if(data.code==200){
            var code=`<option value="">请选择</option>`;
            var oData=data.data;
            $.each(oData,function(index,item){
                code+=`
                    <option value=${item.id}>${item.groupName}</option>
                `
            })
            $('#deviceg_sel').html(code);
            if(id){ 
                setSel('#deviceg_sel',deviceg_id); 
            }else if(oData.length>0){
                getAdminSel(oData[0].id);
                getGatewaySel(oData[0].id);
            }
        }
       
    })
}
//修改保存
blurCheck('#main_form');
function save(){
    if($('#main_form').valid()){
        var elem=new FormData($('#main_form')[0]);
        elem.append('id',cur_id);
        $.ajax({
            type:'post',
            url:server_url+'/web/device/updateDeviceGroupInfo',
            dataType:'json',
            data:elem,
            contentType: false,
            processData: false,
            beforeSend:function(){
                $('.opering-mask').show();
            },
            complete:function(){
                $('.opering-mask').hide();
            },
            success:function(data){
                if(data.code===200){
                    rebackList('修改成功')
                }else{
                    returnMessage(2,data.message);
                }
            },
            error:function(data){
                returnMessage(2,data.status);
            }
        })    
    }
}