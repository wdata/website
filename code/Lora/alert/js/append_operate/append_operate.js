function getDeiveType(id){
    $.ajax({
        type: "POST",
        url:'/web/managementCtr/getDeviceTypeList',
        dataType: 'json',
        success:function(e){
            var a="";
            for(var i = 0; i<e.data.length; i++){
                a +='<option id='+e.data[i].id+'  value='+e.data[i].id+'>'+e.data[i].name+'</option>';
            }
            $('.type_notice7').html(a);
            $('.type_notice7').find('#'+id).prop('selected',true);
        },
        error:function(data){
            returnMessage(2, '报错：' + data.status);
        }
    });
}

$(function(){
    var a = "operating_company";
	var circulate = JSON.parse(sessionStorage.getItem('circulate'));
	var datas = JSON.parse(sessionStorage.getItem('datas'));
    blurCheck('#main_form');
    if(datas == true){
        getDeiveType('dt52360462044257a463c034e4a310a2');
        $('#security_btn5').css('display','none');
        $('.security_number').val();
        $('.security_name').val();
        $('.security_contact').val();
        $('.security_mail').val();
        $('#security_btn4').click(function(){
            var loginName = $('.login_name').val();
            var name = $('.name_unit').val();
            var people = $('.people_unit').val();
            var telNumber = $('.number_unit').val();
            var email = $('.mailbox_unit').val();
            var provinceId = $('#province').val();
            var cityId = $('#city').val();
            var areaId = $('#country').val();
            var detailed = $('.address_unit4').val();
            var facility = $('.type_notice7').val();
            if($("#main_form").valid()){
                $.ajax({
                type: "POST",
                url:'/web/managementCtr/saveManagementInfo',
                dataType: 'json',
                data:{
                    "loginName":loginName,
                    "company.companyName":name,
                    "company.contact":people,
                    "company.telNumber":telNumber,
                    "company.address":detailed,
                    "company.email":email,
                    "company.deviceType":facility,
                    "company.provinceId":provinceId,
                    "company.cityId":cityId,
                    "company.areaId":areaId,
                    "company.companyType":a
                },
                 beforeSend:function(){
                    $('.opering-mask').show();
                    },
                    complete:function(){
                            $('.opering-mask').hide();
                    },
                    success:function(e){
                        if(e.code===200){
                            rebackList('添加成功')
                        }else{
                            returnMessage(2,e.message);
                        }
                    },
                error:function(data){
                    returnMessage(2, '报错：' + data.status);
                }
            });
            }
        });
    }else{
        var n = circulate.data.region;
        var provincial = n.join(',');
        var id = circulate.data.id;
        $('#security_btn4').css('display','none');
        $('.login_name').attr('disabled','true');
        $('.login_name').val(circulate.data.loginName);
        $('.name_unit').val(circulate.data.companyName);
        $('.people_unit').val(circulate.data.contact);
        $('.number_unit').val(circulate.data.telNumber);
        $('.mailbox_unit').val(circulate.data.email);
        $('.address_unit4').val(circulate.data.address);
        getProvinceSel(provincial);
        getDeiveType(circulate.data.deviceType);
        $('#security_btn5').click(function(){
            var json={};
            json['id']=id;
            json['companyName']=$('.name_unit').val();
            json['contact']=$('.people_unit').val();
            json['email']=$('.mailbox_unit').val();
            json['telNumber']=$('.number_unit').val();
            json['deviceType']=$('.type_notice7').val();
            json['provinceId']=$('#province').val();
            json['cityId']=$('#city').val();
            json['areaId']=$('#country').val();
            json['address']=$('.address_unit4').val();
            json['companyType']=a;
            if($("#main_form").valid()){
                $.ajax({
                type: "POST",
                url:'/web/managementCtr/updateManagementInfo',
                dataType: 'json',
                data:{'jsonStr':JSON.stringify(json)},
                beforeSend:function(){
                    $('.opering-mask').show();
                    },
                    complete:function(){
                            $('.opering-mask').hide();
                    },
                    success:function(e){
                        if(e.code===200){
                            rebackList('修改成功');
                        }else{
                            returnMessage(2,e.message);
                        }
                    },
                error:function(data){
                    returnMessage(2, '报错：' + data.status);
                }
            });
            }
        });
    }
});


var area_flag = JSON.parse(sessionStorage.getItem('datas'));
if(area_flag){
    var areaData;
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
            }
        },
        error:function(data){
            returnMessage(2, '报错：' + data.status);
        }
    });
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
        });
        $('#country').html(country_code);
    }   
}else{
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
                }
            },
            error:function(data){
                returnMessage(2, '报错：' + data.status);
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
}




