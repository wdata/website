//session传值给iframe
sessionStorage.setItem('map_lng',null);
sessionStorage.setItem('map_lat',null);
//获取省市级
var areaData;
$(document).ready(function(){
    $.ajax({
        type:'post',
        url:server_url+'/public/getRegion',
        dataType:'json',
        data:{'userId':userId},
        success:function(data){
            if(data.code===200){
                areaData=data.data;
                var prov_code=`<option value="">请选择省市</option>`;
                $.each(areaData,function(index,item){
                    prov_code+=`<option value=${item.id}>${item.name}</option>`;
                })
                $('#province').html(prov_code);
            }
        }
    })       
})
function getCitySel(){
    var city_code=`<option value="">请选择城市</option>`;
    $.each(areaData,function(index,item){
        if(item.id==$('#province').val()){
            $.each(areaData[index].citys,function(index,item){
                city_code+=`<option value=${item.id}>${item.name}</option>`;
            })
        }
    })
    $('#city').html(city_code);
}
function getCountrySel(){
    var country_code=`<option value="">请选择地区</option>`;
    $.each(areaData,function(index,item){
        if(item.id==$('#province').val()){
            var cur_prov=areaData[index].citys;
            $.each(cur_prov,function(index,item){
                if(item.id===$('#city').val()){
                    $.each(cur_prov[index].countys,function(index,item){
                        country_code+=`<option value=${item.id}>${item.name}</option>`; 
                    })
                }
               
            })
        }
    })
    $('#country').html(country_code);
}    

//获取所属组下拉框
(function getDevicegSel(){
    getSelect({'type':2,'userId':userId},function(data){
        if(data.code==200){
            var code=`<option value="">请选择</option>`;
            $.each(data.data,function(index,item){
                code+=`
                    <option value=${item.id}>${item.groupName}</option>
                `
            })
        }
        $('#deviceg_sel').html(code);
    })
})()
//保存
blurCheck('#main_form');
function save(){
    if($('#main_form').valid()){
        var elem=new FormData($('#main_form')[0]);
        elem.append('userId',userId);
        $.ajax({
            type:'post',
            url:server_url+'/web/device/addDeviceGroup',
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
                    rebackList('添加成功')
                }else{
                    returnMessage(2, data.message);
                }
            },
            error:function(data){
                returnMessage(2, data.status);
            }
        })   
    }
    
}