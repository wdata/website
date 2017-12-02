var isAdd_=JSON.parse(sessionStorage.getItem('datas'));
if(isAdd_){
    console.log('这是新增');
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
        })
        $('#country').html(country_code);
    }
}else{
    console.log('这是修改');
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
$(function(){
    var a = "building_user";
	var apply = JSON.parse(sessionStorage.getItem('apply'));
	var datas = JSON.parse(sessionStorage.getItem('datas'));
    function getDeiveType(id){
        $.ajax({
            type: "POST",
            url:'/web/managementCtr/getDeviceTypeList',
            dataType: 'json',
            success:function(e){
                var a="";
                for(var i = 0; i<e.data.length; i++){
                    a += '<option id='+e.data[i].id+' value='+e.data[i].id+'>'+e.data[i].name+'</option>';
                }
                $('.type_notice').html(a);
                $('.type_notice').find('#'+id).prop('selected',true);
            },
            error:function(data){
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }
    blurCheck('#main_form');
    
    if(datas == true){
        getDeiveType('dt52360462044257a463c034e4a310a2');
        $('#security_btn4').css('display','none');
        $('#security_btn5').click(function(){
            var loginName = $('.login_name').val();
            var name = $('.name_unit').val();
            var people = $('.people_unit').val();
            var telNumber = $('.number_unit').val();
            var email = $('.mailbox_unit').val();
            var provinceId = $('#province').val();
            var cityId = $('#city').val();
            var areaId = $('#country').val();
            var detailed = $('.address_unit4').val();
            var facility = $('.type_notice').val();
            var range = $('#signErrorScop').val();
            if($('#main_form').valid()){
                $.ajax({
                    type: "POST",
                    url:'/web/managementCtr/saveManagementInfo',
                    dataType: 'json',
                    
                    data:{
                        "loginName":loginName,
                         "company.provinceId":provinceId,
                        "company.cityId":cityId,
                        "company.areaId":areaId,
                        "company.companyName":name,
                        "company.contact":people,
                        "company.telNumber":telNumber,
                        "company.address":detailed,
                        "company.email":email,
                        "company.deviceType":facility,
                        "company.companyType":a,
                        "company.signErrorScop":range
                    },
                    beforeSend:function(){
                    $('.opering-mask').show();
                        $(this).attr("disabled",true);
                    },
                    complete:function(){
                        $('.opering-mask').hide();
                        $(this).attr("disabled",false);
                    },
                    success:function(e){
                        if(e.code===200){
                            rebackList('新增成功')
                        }else{
                            returnMessage(2,e.message);
                        }
                    },
                    error:function(data){
                        returnMessage(2,'报错：' +  data.status);
                    }
                });
            }
        });
    }else{
        var n = apply.data.region;
        var provincial = n.join();
        var id = apply.data.id;
        $('#security_btn5').css('display','none');
            $('.login_name').attr('disabled','true');
            $('.login_name').val(apply.data.loginName);
            $('.name_unit').val(apply.data.companyName);
            $('.people_unit').val(apply.data.contact);
            $('.number_unit').val(apply.data.telNumber);
            $('.mailbox_unit').val(apply.data.email);
            $('.address_unit4').val(apply.data.address);
            $('#signErrorScop').val(apply.data.signErrorScop);
            getProvinceSel(provincial);
            getDeiveType(apply.data.deviceType);
        $('#security_btn4').click(function(){
            var roleType = sessionStorage.getItem('roleType');//判断是否为使用单位
            var json={};
            json['id']=id;
            json['companyName']=$('.name_unit').val();
            json['contact']=$('.people_unit').val();
            json['email']=$('.mailbox_unit').val();
            json['telNumber']=$('.number_unit').val();
            json['deviceType']=$('.type_notice').val();
            json['provinceId']=$('#province').val();
            json['cityId']=$('#city').val();
            json['areaId']=$('#country').val();
            json['address']=$('.address_unit4').val();
            json['signErrorScop']=$('#signErrorScop').val();
            json['companyType']=a;
            if($('#main_form').valid()){
                $.ajax({
                    type: "POST",
                    url:'/web/managementCtr/updateManagementInfo',
                    dataType: 'json',
                    data:{ 'jsonStr':JSON.stringify(json) },
                    beforeSend:function(){
                        $('.opering-mask').show();
                    },
                    complete:function(){
                            $('.opering-mask').hide();
                    },
                    success:function(e){
                        if(e.code===200){
                            alertMsg('type-success','修改成功！','btn-success',function(dialog){//成功
                                if(roleType==='unit_manager'){//使用单位修改个人信息时，则后退一步。
                                    history.go(-1);
                                }else {//从列表中进到改页面时则返回至列表页面。
                                    closeTab('.btn-close-tab1');
                                }

                                dialog.close();
                            })
                        }else{
                            returnMessage(2,e.message);
                        }
                    },
                    error:function(data){
                        returnMessage(2,'报错：' +  data.status);
                    }
                });
            }
        });


        $('#security_btn6').click(function(){
            var roleType = sessionStorage.getItem('roleType');//判断是否为使用单位
            if(roleType==='unit_manager'){//使用单位修改个人信息时，则后退一步。
                history.go(-1);
            }else {//从列表中进到改页面时则返回至列表页面。
                closeTab(this);
            }

        });
    }

});




