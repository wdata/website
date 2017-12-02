var logos = '';
var backgrounds = '';
var logo_bg = "";
var login_bg = "";
/*获取平台设置*/
function getSet() {
	$.ajax({
		type:'post',
		url:server_url+'/web/systemSetting/getSystemSetting',
	    dataType:'json',
	    success:function(data){
	    	console.log(data)
	        if(data.code===200){
	            $('#main-title').val(data.data.maintitle);
	            $('#subhead').val(data.data.subtitle);
                logo_bg = data.data.logoDomain;
                login_bg = data.data.backgroundDomain;
	            $('#project-logo').attr('src',logo_bg);
	            $('#project-bg').attr('src',login_bg);
                logos = data.data.logo;
                backgrounds = data.data.background;
	        }else{
				returnMessage(2, data.message)
			}
	    },
		error: function (data) {
			returnMessage(2,data.status);
		}
	});
};
getSet();

/*效果图上传图片预览*/
function logo_image(_this,ids){
        if(_this.value==='')return false;
        var $file = $(_this);
        var fileObj = $file[0];
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        if(fileObj && fileObj.files && fileObj.files[0]) {
            dataURL = windowURL.createObjectURL(fileObj.files[0]);
            $(ids).attr('src',dataURL);
            // $('#project-logo').show();
        } else {
            dataURL = $file.val();
            var imgObj =$(ids).get(0);
            imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
        }
        return true;
}
/*效果图上传图片大小格式验证*/
function imgSizeCheck(_this,id,sizes,reminder){ // 当前元素,当前id,限制大小,提示内容
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
    if(size > sizes) {
        returnMessage(2,reminder);
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
            logo_image(_this,id);
        }
    }
}
blurCheck('#main_form');
function save() {
	var $file = $('#file').val();
    var $sideUrl = $('#sideUrl').val();
    if($file || $sideUrl) { //如果有图片
        //上传图片
        var filesForm = new FormData();
        filesForm.append('file',$('#file')[0].files[0]);
        filesForm.append('sideUrl',$('#sideUrl')[0].files[0]);
        $.ajax({
            type:'post',
            url:server_url+"/file/uploadFile",
            contentType:false,
            processData:false,
            beforeSend: function () {
                $('.opering-mask').show();
                $(this).attr("disabled",true);
            },
            complete: function () {
                $('.opering-mask').hide();
                $(this).attr("disabled",false);
            },
            data:filesForm,
            success:function(res) {
                if(res.code==200){
                    // var file_id, file_url,sideUrl;
                    if(res.data.length==2) { //如果返回两个图片
                        logos = res.data[0].url;
                        backgrounds = res.data[1].url;
                        sessionStorage.setItem('logo',res.data[0].accessUrl);
                    } else { //如果返回一个图片
                        if($file) {
                           logos = res.data[0].url; 
                           sessionStorage.setItem('logo',res.data[0].accessUrl);
                       } else {
                           backgrounds = res.data[0].url; 
                       }
                    }
                    upSave();
                }

            },
            error:function(res){
                returnMessage(2,'报错：' +  res.status);
            }
        });
    } else {
    	upSave();
    }
}
function upSave(){
    var maintitle = $('#main-title').val();
    var subhead = $('#subhead').val();
    var $sys = parent.$('#system');
    $.ajax({
        type: 'post',
        url: server_url + '/web/systemSetting/updSystemSetting',
        dataType: 'json',
        contentType:"application/json; charset=utf-8",
        data: JSON.stringify({
        	"maintitle": maintitle,
        	"subtitle": subhead,
        	"logo": logos,
        	"background": backgrounds
        }),
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
                $sys.find('.logo_img').attr('src',sessionStorage.getItem('logo'));
                $sys.find('.title').text(maintitle);
                $sys.find('.text').text(subhead);
                alertMsg('type-success',"保存成功！",'btn-success',function(dialog){
                    dialog.close();
                    parent.layer.closeAll();
                })
            } else{
                returnMessage(2, data.message)
            }
        },
        error: function (data) {
            returnMessage(2,data.status);
        }
    })
}

function noChange(con,_this){
    if(_this.value==''){
        if(con=='logo'){
            $('#project-logo').attr('src',logo_bg);
        }else {
            $('#project-bg').attr('src',login_bg);
        }
    }
}