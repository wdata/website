var isAdd_=JSON.parse(sessionStorage.getItem('datas'));
if(isAdd_){
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
                });
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
        })
        $('#country').html(country_code);
    }
}
$(document).ready(function(){
    var row = JSON.parse(sessionStorage.getItem('row'));
    var datas = JSON.parse(sessionStorage.getItem('datas'));
    if(datas == true){
        //添加
        //获取设备组下拉框
        facility(function(data){
            if(data.code==200){
                var html='';
                $.each(data.data,function(index,item){
                    html+=`<label><input type="checkbox" value="${item.id}"><i></i>${item.groupName}</label>`;
                });
                $("#check_group").append(html);
            }else{
                returnMessage(2,data.message);
            }
        });
        $('#security-btn1').click(function(){
            var testing  = true;
            var array=[];
            $.each($("#check_group input:checked"),function(index,item){
                array.push($(item).val());
            });
            var deviceGroupId = JSON.stringify(array);
            var loginName = $('.security_number').val();
            var name = $('.security_name').val();
            var telNumber = $('.security_contact').val();
            var email = $('.security_mail').val();
            var provinceId = $('#province').val();
            var cityId = $('#city').val();
            var areaId = $('#country').val();
            var address = $('.security_address').val();
            if($("#main_form").valid()){
                if(array.length==0){
                    $("#check_group+.cred").text("必填字段").removeClass("hide");
                }else{
                    $.ajax({
                    type: "POST",
                    url:'/web/securityCtr/addSecurityOr',
                    dataType: 'json',
                    data:{
                        "deviceGroupId":deviceGroupId,
                        "roleType":"security_manager",
                        "user.loginName":loginName,
                        "user.name":name,
                        "user.telNumber":telNumber,
                        "user.email":email,
                        "user.provinceId":provinceId,
                        "user.cityId":cityId,
                        "user.areaId":areaId,
                        "user.address":address
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
            }
        });
    }else{
        //修改
        //获取设备组
        facility(function(data){
            if(data.code==200){
                var html='',checked="",group_id=[];
                $.each(row.data.deviceGroups, function (index,group) {
                    group_id.push(group.id);
                });
                $.each(data.data,function(index,item){

                    if(group_id.indexOf(item.id)==-1){
                        checked="";
                    }else{
                        checked="checked";
                    }
                    html+=`<label><input type="checkbox" ${checked} value="${item.id}"><i></i>${item.groupName}</label>`;

                });
                $("#check_group").append(html);
            }else{
                returnMessage(2,data.message);
            }
        });
        var n = row.data.region;
        var provincial = n.join();
        var id = row.data.id;
        $('#security-btn1').css('display','none');
        $('#security-btn').removeClass("hide");
        $('.security_number').attr('disabled','true');
        var id = row.data.id;
        $('.security_number').val(row.data.loginName);
        $('.security_name').val(row.data.name);
        $('.security_contact').val(row.data.telNumber);
        $('.security_mail').val(row.data.email);
        $('.security_address').val(row.data.address);
        getProvinceSel(provincial);
        $('#security-btn').click(function(){
            var json = {};
            json['uid'] = id;
            json['name'] = $('.security_name').val();
            json['tel'] = $('.security_contact').val();
            json['email'] = $('.security_mail').val();
            json['provinceId'] = $('#province').val();
            json['cityId'] = $('#city').val();
            json['areaId'] = $('#country').val();
            json['address'] = $('.security_address').val();
            var array=[];
            $.each($("#check_group input:checked"),function(index,item){
                array.push($(item).val());
            });
            json['deviceGroupIdList'] = array;
            if($("#main_form").valid()){
                if(array.length==0){
                    $("#check_group+.cred").text("必填字段").removeClass("hide");
                }else{
                    $.ajax({
                    type: "POST",
                    url:'/web/securityCtr/updateSecurityManager',
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
            }
        });
    }
});
//获取设备组下拉框
function facility(callback){
    $.ajax({
        type:'post',
        url: server_url + '/web/common/select',
        data:{type:2},
        dataType:'json',
        success:callback,
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}