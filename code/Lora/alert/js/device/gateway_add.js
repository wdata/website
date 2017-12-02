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
                var prov_code=`<option value="">请选择省份</option>`;
                $.each(areaData,function(index,item){
                    prov_code+=`<option value=${item.id}>${item.name}</option>`;
                })
                $('#province').html(prov_code);
            }else{
                returnMessage(2, data.message);
            }
        },
        error: function (data) {
            returnMessage(2,data.status);
        }
    })
});
function getCitySel(){
    var city_code=`<option value="">请选择城市</option>`;
    $.each(areaData,function(index,item){
        if(item.id==$('#province').val()){
            $.each(areaData[index].citys,function(index,item){
                city_code+=`<option value=${item.id}>${item.name}</option>`;
            })
        }
    });
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
    });
    $('#country').html(country_code);
} 


$(function(){
    /*下拉框获取 company*/
    (function(){
        getSelect({'type':1,'userId':userId},function(data){
            //console.info(data);
            if(data.code==200){
                var code="";
                var oData=data.data.company;
                $.each(oData,function(index,item){
                    code+=`
                        <option value=${item.id}>${item.companyName}</option>
                    `
                });
                if(oData.length>0){
                    getDevicegSel(oData[0].id);
                }
                $('#company_sel').append(code);
            }else{
                returnMessage(2, data.message);
            }
        })
    })();
});
//获取设备组
function getDevicegSel(id){
    var id_val=id?id:$('#company_sel').val();
    getSelect({'type':2,'userId':userId,'id':id_val},function(data){
        if(data.code==200){
            var code=``;
            var oData=data.data;
            $.each(oData,function(index,item){
                code+=`
                    <option value=${item.id}>${item.groupName}</option>
                `
            });
            if(oData.length>0){
                getAdminSel(oData[0].id);
            }else{
                $('#admin_sel').html(' ');
                $('#safty_sel').html(' ');
            }
            $('#deviceg_sel').html(code);
        }else{
            returnMessage(2, data.message);
        }
    });
}
//获取所属管理员
function getAdminSel(id){
    var id_val=id?id:$('#deviceg_sel').val();
    getSelect({'type':3,'userId':userId,'id':id_val},function(data){
        //console.info(data);
        if(data.code==200){
            var code=``;
            var oData=data.data.securityManager;
            $.each(oData,function(index,item){
                code+=`
                    <option value=${item.id}>${item.name}</option>
                `
            })
            if(oData.length>0){
                getSaftySel(oData[0].id)
            }else{
                $('#safty_sel').val('')
            }
            $('#admin_sel').html(code);
        }else{
            returnMessage(2, data.message);
        }
    });
}
//获取安全巡检员
function getSaftySel(id){
    var id_val=id?id:$('#admin_sel').val();
    getSelect({'type':7,'userId':userId,'id':id_val},function(data){
        //console.info(data);
        if(data.code==200){
            var code=``;
            var oData=data.data;
            $.each(oData,function(index,item){
                code+=`
                    <option value=${item.id}>${item.name}</option>
                `
            });
            $('#safty_sel').html(code);
        }else{
            returnMessage(2, data.message);
        }
    })
}
//保存
blurCheck('#main_form');
function save(){
    if($('#main_form').valid()){
        var elem=new FormData($('#main_form')[0])
        elem.append('userId',userId);
        $.ajax({
            type:'post',
            url:server_url+"/web/gateway/addGateway",
            dataType:'json',
            contentType:false,
            processData:false,
            data:elem,
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
                    returnMessage(2,data.message);
                }
            },
            error:function(data){
                returnMessage(2, data.status);
            }
        })    
    }
}