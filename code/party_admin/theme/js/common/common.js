var server_url="";
//var server_url="http://192.168.1.131:8441";
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
//日期格式
Date.prototype.toDateString = function() {
    var YYYY = this.getFullYear();
    var MM = (this.getMonth() + 1)<10?'0'+(this.getMonth() + 1):(this.getMonth() + 1);
    var DD = this.getDate()<10?'0'+this.getDate():this.getDate();
    return  YYYY+ "-" + MM + "-" + DD  ;
};
//去掉字符串首空格
String.prototype.ltrim=function(){
　   return this.replace(/(^\s*)/g,"");
};
//去掉字符串首尾空格
String.prototype.trim=function(){
　   return this.replace(/(^\s*)|(\s*$)/g,"");
};
//分页初始化
function initPagination(id,total,vpage,curpage,callback) {
    $.jqPaginator(id, {
        totalPages: total,
        visiblePages: vpage,
        currentPage: curpage,
        onPageChange: callback,
        prev: '<li class="prev"><a href="javascript:;"><i class="fa fa-chevron-left"></i></a></li>',
        next: '<li class="next"><a href="javascript:;"><i class="fa fa-chevron-right"></i></a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>'
    });
}
//切换页面
function target_page(id){
    $(".content").hide();
    $("."+id).removeClass("hide");
}
//全选函数
function checkAll(id,_this){
    if(_this.checked){
        $("#"+id+" .list :checkbox").prop("checked", true);
    }else{
        $("#"+id+" .list :checkbox").prop("checked", false);
    }
}

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
    if(type==0){
        alertMsg('type-primary',message,'btn-primary',function(dialog){
            dialog.close();
        })  
    }else if(type==1){
        alertMsg('type-success',message,'btn-success',function(dialog){
            dialog.close();
        })  
    }else if(type==2){
        alertMsg('type-danger',message,'btn-danger',function(dialog){
            dialog.close();
        })
    }else if(type==3){
        alertMsg('type-info',message,'btn-info',function(dialog){
            dialog.close();
        })
    }else if(type==4){
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

/*上传图片大小格式验证*/
function imgSizeCheck(_this){
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
         _this.value==' ';
        $(_this).attr('src','');
        console.info($(_this).attr('src') )
        return false;
    }else{
        if(postfix!='jpg' && postfix!='jpeg'&& postfix!='png'&& postfix!='bmp'){
            returnMessage(2,'请选择jpg，jpeg，png，bmp的格式文件上传！');
            _this.value==' ';
            $(_this).attr('src',' ');
            return false;
        }else{
            imgPreview(_this);
        }
    } 
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


/*成功时返回数据*/
function successMsg(cur_status,success_status,message){
    if(cur_status==success_status){
        returnMessage(1,message);
    }else{
        returnMessage(2,message);
    }
}

/*成功时返回数据*/
function okMsg(cur_status,success_status,msg01,msg02){
    if(cur_status==success_status){
        returnMessage(1,msg01);
    }else{
        returnMessage(2,msg02);
    }
}

/*点击跳转页面传递id*/
function sessionId(value){
    sessionStorage.setItem('cur_id',value);
}
function sessionGetId(_this){
    var cur_id=sessionStorage.getItem('cur_id');
    var id=cur_id=="undefined"?"":cur_id;
   return id;
}
/*function sessionIdName(id,name){
    sessionStorage.setItem('cur_id',id);
    sessionStorage.setItem('cur_name',name);
}*/

function session(key,value){
    sessionStorage.setItem(key,value)
}


/*日期非空判断*/
function dateCheck(date){
    if(date){
        return (new Date(date)).toLocaleString();
    }else{
        return '-'
    }
}

/*跳转页面判断*/
function checkLink(elem){
    if(elem){
        $('.btn-dialog').addClass('btn-dialog-tab');
        return true;
    }else{
        $('.btn-dialog').removeClass('btn-dialog-tab');
        return false;
    }   
}
   

/*获取选中checkbox字符串*/
function idx(arr){
    var ids=[];
    arr.each(function(){
        ids.push($(this).attr('data-id'));
    })
    return ids.join(',');
}

/*数组去重*/
Array.prototype.unique = function(){
 this.sort(); //先排序
 var res = [this[0]];
 for(var i = 1; i < this.length; i++){
  if(this[i] !== res[res.length - 1]){
   res.push(this[i]);
  }
 }
 return res;
}

/*清空表单*/
function clearForm(id){
    $(id).find('input[type=text]').each(function(){
        if(!$(this).attr('readonly')){
            $(this).val(' ');
        }
    })
    $(id).find('input[type=password]').val(' ');
    $(id).find('textarea').val(' ');
    $(id).find('select').each(function(){
        if(!$(this).hasClass('immort')){
            $(this).find('option').first().prop('selected',true);
        }
    })
    
}

/*表单数据为空显示*/
function noData(id){
    $(id).find('.list').html('');
    if(!$(id).next().hasClass('no-data')){
        $('<p class="no-data tc">当前条件下无数据展示！</p>').insertAfter(id);
    }   
}

/*表格内容非空判断*/
function noTd(elem){
    return elem?elem:'-'
}
/*表单内容非空判断*/
function noVal(elem){
    if(elem=="-"){return " "}
    return elem?elem:' '
}
function blurCheck(id){
    $(id).validate({
        onfocusout: function(element) { $(element).valid(); }
    })
}

/*日期初始化*/
function dateInit(start,end){
    $(start).datetimepicker({
        format: "yyyy-mm-dd",
        startDate:(new Date()),
        autoclose: true,
        todayBtn: true,
        minView:'month',
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
    }).on("click",function(){
        $(start).datetimepicker("setEndDate",$(end).val())
    }).on('changeDate',function(){
        if($(this).val()){
            $(this).siblings('.error').hide();
            $(this).removeClass('error').addClass('valid')
        }
    });
    $(end).datetimepicker({
        format: "yyyy-mm-dd",
        startDate:(new Date()),
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        minView:'month',
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
        //pickerPosition: "bottom-left"
    }).on("click",function(){
        $(end).datetimepicker("setStartDate",$(start).val())
    }).on('changeDate',function(){
        if($(this).val()){
            $(this).siblings('.error').hide();
            $(this).removeClass('error').addClass('valid')
        }
    });
}