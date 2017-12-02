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

$(function(){
    /*下拉框获取 company*/
    (function(){
        getSelect({'type':1},function(data){
            //console.info(data);
            if(data.code==200){
                var code="";
                var oData=data.data.company;
                $.each(oData,function(index,item){
                    code+=`
                        <option value=${item.id}>${item.companyName}</option>
                    `
                })
                if(oData.length>0){
                    getDevicegSel(oData[0].id);
                }
                $('#company_sel').append(code);
                getGatewaySel();
            }
        })
    })();
})
//获取设备组
function getDevicegSel(id){
    var id_val=id?id:$('#company_sel').val();
    getGatewaySel(id_val);
    getSelect({'type':2,'id':id_val},function(data){
        //console.info(data);
        if(data.code==200){
            var code=``;
            var oData=data.data;
            $.each(oData,function(index,item){
                code+=`
                    <option value=${item.id}>${item.groupName}</option>
                `
            })
            if(oData.length>0){
                getAdminSel(oData[0].id);
            }
            $('#deviceg_sel').html(code);
        }
    })
}
//获取所属管理员
function getAdminSel(id){
    var id_val=id?id:$('#deviceg_sel').val();
    getSelect({'type':3,'id':id_val},function(data){
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
        }
       
    })
}
//获取网关
function getGatewaySel(id){
    var id_val=id?id:$('#company_sel').val();
    getSelect({'type':9,'id':id_val},function(data){
        //console.info(data);
        if(data.code==200&&data.data.length!=0){
            var code=``;
            var oData=data.data;
            $.each(oData,function(index,item){
                code+=`
                    <option value=${item.id}>${item.gatewayName}</option>
                `
            });
            $('#gateway_sel').html(code);
        }
    })
}
//获取安全巡检员
function getSaftySel(id){
    var id_val=id?id:$('#admin_sel').val();
    getSelect({'type':7,'id':id_val},function(data){
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
        }
    })
}



blurCheck('#main_form');
function save(){
    //表单验证
    if($('#main_form').valid()){
        if(! /^ffffff100000[a-z0-9]{4}$/.test($(".serialNumber").val())){
            $(".serialNumber").next().text("你输入的格式有误请重新输入！！").show();
            return false;
        }
        if(($('#curX').val()==''&&$('#curY').val()=='')){
            returnMessage(2,"请在户型图中选择设备坐标！！");
            return false;
        }

        //上传图片
        var filesForm = new FormData();
        filesForm.append('file',$('#file')[0].files[0]);
        filesForm.append('sideUrl',$('#sideUrl')[0].files[0]);
        $.ajax({
            type:'post',
            url:server_url+"/file/uploadFile",
            contentType:false,
            processData:false,
            data:filesForm,
            success:function(res) {
                if(res.code==200){
                    var file_id, file_url,sideUrl;
                    file_id = res.data[0].id;
                    file_url = res.data[0].url;
                    sideUrl = res.data[1].url;
                    upSave(file_id,file_url,sideUrl);
                }
            },
            error:function(res){
                returnMessage(2,'报错：' +  res.status);
            }
        });
    }
}


function upSave(file_id,file_url,sideUrl){
    var save_elem = new FormData();
    save_elem.append('deviceName',$('#deviceName').val());
    save_elem.append('serialNumber',$('#serialNumber').val());
    save_elem.append('provinceId',$('#province').val());
    save_elem.append('cityId',$('#city').val());
    save_elem.append('areaId',$('#country').val());
    save_elem.append('address',$('#address').val());
    save_elem.append('owner',$('#owner').val());
    save_elem.append('phone',$('#phone').val());
    save_elem.append('companyId',$('#company_sel').val());
    save_elem.append('groupId',$('#deviceg_sel').val());
    save_elem.append('gatewayId',$('#gateway_sel').val());
    save_elem.append('managerId',$('#admin_sel').val());
    save_elem.append('patrolId',$('#safty_sel').val());
    save_elem.append('longitude',$('#lng').val());
    save_elem.append('latitude',$('#lat').val());
    save_elem.append('floorMax',$('#floorSum').val());
    save_elem.append('floor',$('#floorCur').val());
    save_elem.append('planX',$('#curX').val());
    save_elem.append('planY',$('#curY').val());
    save_elem.append('planId', file_id);
    save_elem.append('url', file_url);
    save_elem.append('sideUrl', sideUrl);
    $.ajax({
        type: 'post',
        url: server_url + '/web/device/addDevice',
        dataType: 'json',
        data: save_elem,
        contentType: false,
        processData: false,
        beforeSend: function () {
            $('.opering-mask').show();
            $(this).attr("disabled",true);
        },
        complete: function () {
            $('.opering-mask').hide();
            $(this).attr("disabled",false);
        },
        success: function (data) {
            if (data.code === 200) {
                rebackList("添加成功！")
            } else{
                returnMessage(2, data.message)
            }
        },
        error: function (data) {
            returnMessage(2,data.status);
        }
    })
}




//$(window.frames['iframe'].document).find('#where').val('ffu')

/*上传图片预览*/
function imgPreview(_this){
    if(_this.value==='')return false;
    var $file = $(_this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    var dataURL;
    if(fileObj && fileObj.files && fileObj.files[0]) {
        dataURL = windowURL.createObjectURL(fileObj.files[0]);
        $('#house_img').attr('src', dataURL);
        $('#house_img').show();
        $('#house_pointer').show();
    } else {
        dataURL = $file.val();
        var imgObj =$('#house_img').get(0);
        imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
        imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
    }
    return true;
}

/*效果图上传图片预览*/
function floor_image(_this){
        if(_this.value==='')return false;
        var $file = $(_this);
        var fileObj = $file[0];
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        if(fileObj && fileObj.files && fileObj.files[0]) {
            dataURL = windowURL.createObjectURL(fileObj.files[0]);
            $('#floor_img').attr('src', dataURL);
            $('#floor_img').show();
        } else {
            dataURL = $file.val();
            var imgObj =$('#floor_img').get(0);
            imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
        }
        return true;
}
/*效果图上传图片大小格式验证*/
function _imgSizeCheck(_this){
    var fileSize = 0;
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var name=_this.value;
    var postfix=name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if(isIE && !_this.files) {
        var filePath = _this.value;
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        var file = fileSystem.GetFile(filePath);
        fileSize = file.Size;
    } else {
        fileSize = _this.files[0].size;
    }
    var size = fileSize / 1024;
    if(size > 2000) {
        returnMessage(2,'附件不能大于2M！');
        $(_this).val('');
        //_this.value=='';
        $(_this).attr('src','');
        return false;
    }else{
        if(postfix!='jpg' && postfix!='jpeg'&& postfix!='png'&& postfix!='bmp'){
            returnMessage(2,'请选择jpg，jpeg，png，bmp的格式文件上传！');
            $(_this).val('');
            $(_this).attr('src',' ');
            return false;
        }else{
            floor_image(_this);
        }
    }
}

//获取鼠标点击区域中的相对位置坐标
function getXAndY(event){
    //鼠标点击的绝对位置
    var Ev= event || window.event;
    var mousePos = getMousePos(event);
    var x = mousePos.x;
    var y = mousePos.y;
    var x1 = $("#house_img").offset().left;
    var y1 = $("#house_img").offset().top;
    var x2 = x - x1;
    var y2 = y - y1;
    var _width=$('#house_img').width();
    var _height=$('#house_img').height();
    $("#curX").val(parseInt((x2/_width)*100));
    $("#curY").val(parseInt((y2/_height)*100));
    $('#house_pointer').css({'left':(x2/_width)*100+'%','top':(y2/_height)*100+'%'});
}
//获取鼠标点击区域在Html绝对位置坐标
function getMousePos(event) {
    var e = event || window.event;
    //var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    //var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX ;
    var y = e.pageY || e.clientY ;
    //alert('x: ' + x + '\ny: ' + y);
    return { 'x': x, 'y': y };
}
function verifier(_this){
    if(! /^ffffff100000[a-z0-9]{4}$/.test($(_this).val())){
        $(_this).next().text("你输入的格式有误请重新输入！！").show();
        return false;
    }else{
        $(_this).next().text("").hide();
    }
}

/*//楼层判断
function floorVerdict(){
    var floorSum = parseInt($('#floorSum').val());
    var floorCur = parseInt($('#floorCur').val());
    //console.log(floorSum,floorCur);
    var difference = ((floorSum-floorCur)<=(floorSum*2));
    //console.log('difference '+difference);
    if(floorSum&&floorCur){
        if(difference){
            //console.log((floorSum-floorCur));
            if((floorSum-floorCur)<0){
                returnMessage(2,'所在楼层不能超过总楼层数！')
            }
        }else {
            returnMessage(2,'所在楼层不能超过总楼层数！');
        }
    }
}*/
