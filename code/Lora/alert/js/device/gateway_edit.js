var cur_id=sessionStorage.getItem('gateway_id');
//获取当前信息
$.ajax({
    type:'post',
    url:server_url+'/web/gateway/getGatewayInfo',
    dataType:'json',
    data:{'id':cur_id,'userId':userId},
    success:function(data){
        if(data.code==200){
            var oData=data.data;
            $('#main_form input[name=gatewayName]').val(oData.gatewayName);
            $('#main_form input[name=gatewayEui]').val(oData.gatewayEui);
            $('#main_form input[name=address]').val(oData.address);
            getProvinceSel(oData.mergerName);
            getCompSel(oData.companyId);
            getDevicegSel(oData.companyId,oData.groupId);
            getAdminSel(oData.groupId,oData.adminId);
            getSaftySel(oData.adminId,oData.patrolId)
        }else{
            returnMessage(2, data.message);
        }
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
    });
    $('#country').html(country_code);
}   
/*下拉框获取 company*/
function getCompSel(id){
    getSelect({'type':1,'userId':userId},function(data){
        //console.info(data);
        if(data.code==200){
            var code=``;
            var oData=data.data.company;
            $.each(oData,function(index,item){
                code+=`
                    <option value=${item.id}>${item.companyName}</option>
                `
            })
            $('#company_sel').append(code);
            if(id){
                setSel('#company_sel',id);
            }else if(oData.length>0){
                getDevicegSel(oData[0].id);
            }

            
        }
    })
}
//获取设备组
function getDevicegSel(id,deviceg_id){
    var id_val=id?id:$('#company_sel').val();
    getSelect({'type':2,'userId':userId,'id':id_val},function(data){
        //console.info(data);
        if(data.code==200){
            var code=``;
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
            if(oData.length<=0){
                $('#admin_sel').html(' ');
                $('#safty_sel').html(' ');
            }
        }
       
    })
}
//获取所属管理员
function getAdminSel(id,admin_id){
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
            $('#admin_sel').html(code);
            if(id){
                setSel('#admin_sel',admin_id);
            }else if(oData.length>0){
                getSaftySel(oData[0].id)
            }
            if(oData.length<=0){
                $('#safty_sel').html(' ');
            }
        }
       
    })
}

//获取安全巡检员
function getSaftySel(id,safty_id){
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
            setSel('#safty_sel',safty_id)
        } else{
            returnMessage(2, data.message)
        }
    })
}

//修改保存
blurCheck('#main_form');
function save(){
    if($('#main_form').valid()){
        var elem=new FormData($('#main_form')[0])
        elem.append('userId',userId);
        elem.append('id',cur_id);
        $.ajax({
            type:'post',
            url:server_url+"/web/gateway/updateGatewayInfo",
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
                    rebackList('修改成功')
                }else{
                    returnMessage(2, data.message)
                }
            },
            error:function(data){
                returnMessage(2,data.status);
            }
        })    
    }
}