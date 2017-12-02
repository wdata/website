
var isAdd_=JSON.parse(sessionStorage.getItem('datas'));
if(isAdd_){
    var areaData;
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
                })
                $('#province').html(prov_code);
            }
        },
        error:function(data){
            returnMessage(2,data.status);
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
    var areaData;
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
                    })
                    $('#province').html(prov_code);
                    getCitySel(str);
                }
            },
            error:function(data){
                returnMessage(2,data.status);
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
	var suc = sessionStorage.getItem('suc');
    var inspect = JSON.parse(sessionStorage.getItem('inspect'));
    $('.supervise_people').val(suc);
	var datas = JSON.parse(sessionStorage.getItem('datas'));
	if(datas == true){
		$('#inspect_plus1').click(function(){
			var loginName = $('.security_number1').val();
			var name = $('.security_name1').val();
			var telNumber = $('.security_contact1').val();
			var email = $('.security_mail1').val();
			var provinceId = $('#province').val();
            var cityId = $('#city').val();
            var areaId = $('#country').val();
            var address = $('.security_address1').val();
			var bid = $(".supervise_people").val();
			if($("#main_form").valid()){
			    $.ajax({
				type: "POST",
		        url:'/web/securityCtr/addSecurityOr',
		        dataType: 'json',
		        data:{
		        	"roleType":"security_patrol",
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
		});
	}else{
        var n = inspect.data.region;
        var provincial = n.join();
		var inspect = JSON.parse(sessionStorage.getItem('inspect'));
            var id = inspect.data.id;
		$('#inspect_plus1').addClass("hide");
        $('#inspect_plus').removeClass("hide");
		$('.security_number1').attr('disabled','true');
		$('.security_number1').val(inspect.data.loginName);
		$('.security_contact1').val(inspect.data.telNumber);
		$('.security_mail1').val(inspect.data.email);
		$('.security_name1').val(inspect.data.name);
		$('.security_address1').val(inspect.data.address);
        getProvinceSel(provincial);
		$('#inspect_plus').click(function(){
            var json = {};
            json['uid'] = id;
            json['name'] = $('.security_name1').val();
            json['tel'] = $('.security_contact1').val();
            json['email'] = $('.security_mail1').val();
            json['provinceId'] = $('#province').val();
            json['cityId'] = $('#city').val();
            json['areaId'] = $('#country').val();
            json['address'] = $('.security_address1').val();
            if($("#main_form").valid()){
                $.ajax({
				type: "POST",
		        url:'/web/securityCtr/updateSecurityPatrol',
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
                            rebackList('修改成功')
                        }else{
                            returnMessage(2,e.message)
                        }
                    },
                    error:function(data){
                        returnMessage(2,data.status);
                    }
			    });
		    }
		});
	}
});