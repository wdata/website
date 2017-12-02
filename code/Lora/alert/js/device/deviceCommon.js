
function tdCheck(elem){
	if(elem==null){
		return "-"
	}else{
		return elem
	}
}
/*详情数据非空判断*/
function detailCheck(elem){
	if(elem==null){
		return " "
	}else{
		return elem
	}
}
/*时间处理*/
function dateDeal(elem){
	if(elem){
		return (new Date(elem)).toLocaleString();
	}else{
		return "-"
	}
}
/*下拉列表内容获取*/
function getSelect(elem,callback){
    $.ajax({
        type:'post',
        url:server_url+"/web/common/select.json",
        dataType:'json',
        data:elem,
        headers:{'userId':userId},
        success:callback
    })         
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

function blurCheck(id){
    $(id).validate({
        onfocusout: function(element) { $(element).valid(); }
    })
}
function session(elem,_this){
    sessionStorage.setItem(elem,_this)
}
function successMsg(cur_code,success_code,msg01,msg02){
    if(cur_code===success_code){
        returnMessage(1,msg01);
    }else{
        returnMessage(2,msg02);
    }
}
function dateChoose(start_time,end_time){
    $(start_time).datetimepicker({
        format: "yyyy-mm-dd",
        minView:'month',
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
    }).on("click",function(){
        $(start_time).datetimepicker("setEndDate",$(end_time).val())
    });
    $(end_time).datetimepicker({
        format: "yyyy-mm-dd",
        minView:'month',
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
        //pickerPosition: "bottom-left"
    }).on("click",function(){
        $(end_time).datetimepicker("setStartDate",$(start_time).val())
    });
}
function datePick(time){
     $(time).datetimepicker({
        format: "yyyy-mm-dd",
        minView:'month',
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
    })
}

















