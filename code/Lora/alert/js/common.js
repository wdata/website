var server_url="";
//var server_url="http://192.168.1.131:8441";
//用户ID
var userId = null;
var companyId = 1100;

//日期格式
Date.prototype.toLocaleString = function() {
    var YYYY = this.getFullYear();
    var MM = (this.getMonth() + 1)<10?'0'+(this.getMonth() + 1):(this.getMonth() + 1);
    var DD = this.getDate()<10?'0'+this.getDate():this.getDate();
    var hh = this.getHours()<10?'0'+this.getHours():this.getHours();
    var mm = this.getMinutes()<10?'0'+this.getMinutes():this.getMinutes();
    var ss = this.getSeconds()<10?'0'+this.getSeconds():this.getSeconds();
    return  YYYY+ "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss ;
};
Date.prototype.toDateString=function(){
    var YYYY = this.getFullYear();
    var MM = (this.getMonth() + 1)<10?'0'+(this.getMonth() + 1):(this.getMonth() + 1);
    var DD = this.getDate()<10?'0'+this.getDate():this.getDate();
    return  YYYY+ "-" + MM + "-" + DD ;
}
//分页初始化
function initPagination(id,total,vpage,curpage,callback) {
    $.jqPaginator(id, {
        totalPages: total,
        visiblePages: vpage,
        currentPage: curpage,
        onPageChange: callback,
        first: '<li class="prev"><a href="javascript:;"><i class="fa-chevron-first"></i></a></li>',
        prev: '<li class="prev"><a href="javascript:;"><i class="fa-chevron-left"></i></a></li>',
        next: '<li class="next"><a href="javascript:;"><i class="fa-chevron-right"></i></a></li>',
        page: '<li class="page"><a href="javascript:;">第{{page}}页</a></li>',
        last: '<li class="page"><a href="javascript:;"><i class="fa-chevron-last"></i></a></li>'
    });
}


//全选函数
function checkAll(id,_this){
    if(_this.checked){
        $("#"+id+" tbody :checkbox").prop("checked", true);
    }else{
        $("#"+id+" tbody :checkbox").prop("checked", false);
    }
}

//生成弹框的函数
//提示弹框
function alertMsg(type,message,btn_type,callback){
    BootstrapDialog.show({
        'type':type,
        'title':"返回信息",
        'message':message,
        'buttons':[
            {
                label: '确定',
                cssClass: btn_type,
                action: callback
            }
        ]
    });
}
function returnMessage(type,message){
    if(type===0){
        alertMsg('type-primary',message,'btn-primary',function(dialog){
            dialog.close();
        })
    }else if(type===1){
        alertMsg('type-success',message,'btn-success',function(dialog){//成功
            dialog.close();
        })
    }else if(type===2){
        alertMsg('type-danger',message,'btn-danger',function(dialog){//失败
            dialog.close();
        })
    }else if(type===3){
        alertMsg('type-info',message,'btn-info',function(dialog){
            dialog.close();
        })
    }else if(type===4){
        alertMsg('type-default',message,'btn-default',function(dialog){
            dialog.close();
        })
    }else{
        alertMsg('type-warning',message,'btn-warning',function(dialog){
            dialog.close();
        })
    }
}
function confirmMsg(message,callback){
    BootstrapDialog.show({
        'type':'type-primary',
        'title':"返回信息",
        'message':message,
        'buttons':[
            {
                label: '确定',
                cssClass:'btn-primary',
                action: callback
            },{
                label:'取消',
                cssClass:'btn-warning',
                action:function(dialog){
                    dialog.close();
                }
            }
        ]
    });
}
function msgShow(type,message,trueBtn,falseBtn,trueCallback){
    BootstrapDialog.show({
        'type':type,//'type-primary',
        'title':"返回信息",
        'message':message,
        'buttons':[
            {
                label: '确定',
                cssClass:trueBtn,//'btn-primary',
                action: trueCallback
            },{
                label:'取消',
                cssClass:falseBtn,//'btn-warning',
                action:function(dialog){
                    dialog.close();
                }
            }
        ]
    });
}



//获取报警类型下拉框信息
function getWarningType(id){
    $.ajax({
        type:'post',
        url: server_url + '/public/getTypeWarningForJson',
        data:{},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                var options='<option value="">全部</option>';
                $.each(data.data,function(index,item){
                    options+='<option value="'+item.key+'">'+item.val+'</option>';
                });
                $("#"+id).html(options);
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//获取设备组下拉框信息
function facilityGroup(id){
    $.ajax({
        type:'post',
        url: server_url + '/web/common/select',
        data:{type:2},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                var options='<option value="">全部</option>';
                $.each(data.data,function(index,item){
                    options+='<option value="'+item.id+'">'+item.groupName+'</option>';
                });
                $("#"+id).html(options);
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });

}


/*上传图片大小格式验证*/
function imgSizeCheck(_this){
    console.log(_this);
    if(_this.value==''){return false;}
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
        $(_this).attr('src','');
        return false;
    }else{
        if(postfix!='jpg' && postfix!='jpeg'&& postfix!='png'&& postfix!='bmp'){
            returnMessage(2,'请选择jpg，jpeg，png，bmp的格式文件上传！');
            $(_this).val('');
            $(_this).attr('src',' ');
            return false;
        }else{
            imgPreview(_this);
        }
    } 
}

/*上传图片预览*/
function imgPreview(_this){
    if(_this.value==='')return false;
    var $file = $(_this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    var dataURL;
    var $img = $(_this).parent().siblings().find('img');
    if(fileObj && fileObj.files && fileObj.files[0]) {
        dataURL = windowURL.createObjectURL(fileObj.files[0]);
        $img.attr('src', dataURL);
    } else {
        dataURL = $file.val();
        var imgObj =$img.get(0);
        imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
        imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
    }
    return true;
}


/*导入excel表格验证*/
function excelCheck(_this){
    var name=_this.value;
    var postfix=name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if(postfix!='xls' && postfix!='xlsx'){
        returnMessage(2,'请选择xlsx，xls的格式文件上传！');
        _this.value==' ';
        $(_this).attr('src',' ');
        return false;
    }else{
        return true
    }
}

//必填判断，引用
// <script src="../../js/plugin/jquery-validate/js/jquery.validate.js"></script>
// <script src="../../js/plugin/jquery-validate/js/messages_cn.js"></script>
function blurCheck(id){
    $(id).validate({
        onfocusout: function(element) { $(element).valid(); }
    })
}
//改变iframe的src
function cancel(url){
    $("#workspace", window.parent.document).attr("src",url);
}
function session(elem,_this){
    sessionStorage.setItem(elem,_this)
}

//添加、修改、取消
//<button class="btn btn-primary" href="html/device/device_add.html" onclick="openTab(this)" data-tit="设备添加">添加设备</button>
//<button class="btn btn-default btn-close-tab"  href="html/device/deviceg_list.html" onclick="closeTab(this)">取消</button>
/*beforeSend:function(){
    $('.opering-mask').show();
},
complete:function(){
    $('.opering-mask').hide();
},
success:function(data){
    if(data.code===200){
        rebackList('修改成功')
    }else{
        returnMsg(2,'修改失败！');
    }
},*/
//打开页面
function openTab(_this){
    $('#bread-nav .three span',window.parent.document).text($(_this).attr('data-tit'));
    $('#bread-nav .three',window.parent.document).show();
    $('#workspace',window.parent.document).attr('src',$(_this).attr('href'));
}

//关闭页面
function closeTab(_this){
    $('#bread-nav .three',window.parent.document).hide();
    $('#workspace',window.parent.document).attr('src',$(_this).attr('href')); 
    // console.log($('#workspace',window.parent.document).attr('src'));
}
//成功后跳转
function rebackList(msg){
    alertMsg('type-success',msg,'btn-success',function(dialog){//成功
        dialog.close();
        closeTab('.btn-close-tab');
    });
}

//处理中弹窗关闭
function closeMask(){
   $('.opering-mask').hide();
}

//获取企业下拉框
function company(callback){
    $.ajax({
        type:'post',
        url: server_url + '/web/common/select',
        data:{type:1},
        dataType:'json',
        success:callback,
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//手机号码验证
function isPhone(_this){
    var phone = $(_this).val();
    if(!(/^1[34578]\d{9}$/.test(phone))){
        returnMessage(2,"手机号码有误，请重新输入");
        return false;
    }
}
function isEmail(_this){
    var email = $(_this).val();
    if(!(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email))){
        returnMessage(2,"邮箱格式有误，请重新输入");
        return false;
    }
}
//权限是否展示内容
function isShow(add_code,edit_code,export_code,alarm_code,koriyasu_code,Details_code,GTPassword_code,detele_code){
    //第一个参数是添加的状态码  第二个是修改的状态码
    //先全局生成一个isEdit,isAdd变量用这个变量管控列表中的修改按钮  msg_list.js有完整的实例
    //用法 var isEdit=null,isAdd=null;   isShow("1001200010001","1001200010002");
    var src=$("#workspace", window.parent.document).attr("src");
    var data_ids=$("#accordion a", window.parent.document);
    var status_code=null;
    $.each(data_ids,function(index,item){
        var data_id=$(item).attr("data-id");
        if(data_id.indexOf(src)!=-1){
            if(data_id.indexOf("status_code=")!=-1){
                status_code=data_id.substring(data_id.indexOf("status_code=")+12).split(",");
            }else{
                status_code=null;
            }
        }
    });
    //console.log(status_code);
    if(status_code!=null){
        //添加
        if(add_code!=""){
            isAdd=status_code.indexOf(add_code)==-1?false:true;
        }
        //修改
        if(edit_code!=""){
            isEdit=status_code.indexOf(edit_code)==-1?false:true;
        }
        //导出
        if(export_code!=""){
            isExport=status_code.indexOf(export_code)==-1?false:true;
        }
        //报警推送
        if(alarm_code!=""){
            isAlarm=status_code.indexOf(alarm_code)==-1?false:true;
        }
        //维保
        if(koriyasu_code!=""){
            isKoriyasu=status_code.indexOf(koriyasu_code)==-1?false:true;
        }
        //详情
        if(Details_code!=""){
            Details=status_code.indexOf(Details_code)==-1?false:true;
        }
        //安全巡检员获取密码
        if(GTPassword_code!=""){
            GTPassword=status_code.indexOf(GTPassword_code)==-1?false:true;
        }
        //角色权限管理的删除
        if(detele_code!=""){
            isDetele=status_code.indexOf(detele_code)==-1?false:true;
        }
    }else{
        return false;
    }
}

/*表格数据非空判断*/
function tdCheck(elem){
    if(elem==null){
        return "-"
    }else{
        return elem
    }
}

//判断键盘输入是否为数字
function checkint() {
    var v = window.event.keyCode;
    if (!(v >= 48 && v <= 57)) {
        window.event.keyCode = 0;
        window.event.returnValue = false;
    }
}
function inputNum(evt){
    //火狐使用evt.which获取键盘按键值，IE使用window.event.keyCode获取键盘按键值
    var ev = evt.which?evt.which:window.event.keyCode;
    console.log(ev)
    if(ev>=48&&ev<=57 || ev==8){
        return true;
    }else{
        return false;
    }
}