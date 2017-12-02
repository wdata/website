var isAdd_=JSON.parse(sessionStorage.getItem('datas'));
var areaData = '';
if(isAdd_){
    areaData='';
    $.ajax({
        type:'post',
        url:'/public/getRegion',
        dataType:'json',
        data:{'userId':userId},
        success:function(data){
            if(data.code===200){
                areaData=data.data;
                var prov_code=`<option value="">请选择省份</option>`;
                $.each(areaData,function(index,item){
                    prov_code+=`<option value=${item.id}>${item.name}</option>`;
                });
                $('#province').html(prov_code);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
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
}else{
    areaData = '';
    function getProvinceSel(str){
        $.ajax({
            type:'post',
            url:'/public/getRegion',
            dataType:'json',
            data:{'userId':userId},
            success:function(data){
                if(data.code===200){
                    areaData=data.data;
                    var prov_code=`<option value="">请选择省份</option>`;
                    $.each(areaData,function(index,item){
                        var selected=!str?' ':(str.indexOf(item.name)!=-1)?"selected":'';
                        prov_code+=`<option value=${item.id} ${selected}>${item.name}</option>`;
                    });
                    $('#province').html(prov_code);
                    getCitySel(str);
                }
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' + data.status);
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
                });
            }
        });
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
    var a = "facilitator";
	var create = JSON.parse(sessionStorage.getItem('create'));
	var datas = JSON.parse(sessionStorage.getItem('datas'));
    function getDeiveType(id){
        $.ajax({
            type: "POST",
            url:'/web/managementCtr/getDeviceTypeList',
            dataType: 'json',
            success:function(e){
                var a="";
                for(var i = 0; i<e.data.length; i++){
                    a +='<option id='+e.data[i].id+' value='+e.data[i].id+'>'+e.data[i].name+'</option>';
                }
                $('.supervise_people').html(a);
                $('.supervise_people').find('#'+id).prop('selected',true);
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' + data.status);
            }
        });    
    }
    blurCheck('#main_form');
    if(datas == true){
        getDeiveType("dt52360462044257a463c034e4a310a2");
        $('#create_plus2').click(function(){
            var testing  = true;
            var loginName = $('.create_account').val();
            var name = $('.create_unit').val();
            var people = $('.create_people').val();
            var telNumber = $('.create_number').val();
            var email = $('.create_email').val();
            var detailed = $('.make_address6').val();
            var type = $('.supervise_people').val();
            var facility = $('.create_describe').val();
            var provinceId = $('#province').val();
            var cityId = $('#city').val();
            var areaId = $('#country').val();
            var address = $('.make_address6').val();
            if($("#main_form").valid()){
                $.ajax({
                type: "POST",
                url:'/web/managementCtr/saveManagementInfo',
                dataType: 'json',
                data:{
                    "loginName":loginName,
                    "company.companyName":name,
                    // "company.parentId":name,
                    "company.contact":people,
                    "company.telNumber":telNumber,
                    "company.provinceId":provinceId,
                    "company.cityId":cityId,
                    "company.areaId":areaId,
                    "company.email":email,
                    "company.deviceType":type,
                    "company.area":detailed,
                    "company.deviceDesc":facility,
                    "company.address":address,
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
                            //rebackList('添加成功');
                            alertMsg('type-success','添加成功','btn-success',function(dialog){//成功
                                dialog.close();
                                parent.layer.closeAll();
                                closeTab('.btn-close-tab');
                            });
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
        var n = create.data.region;
        var provincial = n.join();
            $('#create_plus2').addClass('hide');
            $('#create_plus1').removeClass('hide');
            $('.create_account').attr('disabled','true');
            $('.create_account').val(create.data.loginName);
            $('.create_unit').val(create.data.companyName);
            $('.create_people').val(create.data.contact);
            $('.create_number').val(create.data.telNumber);
            $('.create_email').val(create.data.email);
            $('.create_describe').val(create.data.deviceDesc);
            $('.make_address6').val(create.data.address);
            getProvinceSel(provincial);
            getDeiveType(create.data.deviceType);
        $('#create_plus1').click(function(){
            var testing  = true;
            var id = create.data.id;
            var loginName = $('.create_account').val();
            var name = $('.create_unit').val();
            var people = $('.create_people').val();
            var telNumber = $('.create_number').val();
            var email = $('.create_email').val();
            var detailed = $('.make_address6').val();
            var type = $('.supervise_people').val();
            var facility = $('.create_describe').val();
            var provinceId = $('#province').val();
            var cityId = $('#city').val();
            var areaId = $('#country').val();
            var address = $('.make_address6').val();

            var json={};
                json['id']=id;
                json['companyName']=name;
                json['contact']=people;
                json['email']=email;
                json['telNumber']=telNumber;
                json['deviceType']=type;
                json['deviceDesc']=facility;
                json['provinceId']=provinceId;
                json['cityId']= cityId;
                json['areaId']= areaId;
                json['address']=address;
                json['companyType']=a;
            if($("#main_form").valid()){
                $.ajax({
                    type: "POST",
                    url:'/web/managementCtr/updateManagementInfo',
                    dataType: 'json',
                    data:{
                        'jsonStr':JSON.stringify(json)
                    },
                    beforeSend:function(){
                    $('.opering-mask').show();
                    },
                    complete:function(){
                            $('.opering-mask').hide();
                    },
                    success:function(e){
                        if(e.code===200){
                            //rebackList('修改成功');
                            alertMsg('type-success','添加成功','btn-success',function(dialog){//成功
                                dialog.close();
                                parent.layer.closeAll();
                                closeTab('.btn-close-tab');
                            });
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
//省市级+设备组
});



