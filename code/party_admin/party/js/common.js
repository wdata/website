/**
 * Created by Administrator on 2017/6/14.
 */
var ServerId = "";        //登录和首页接口需要用到

var DMBServer_url= ServerId + "/party-server-core";        //主测试IP  /party-app-server
var DMBserver_image_url = ServerId + "/party-server-image";  //展示图片接口 party-server-image
var DMBserver_notice_url = ServerId + "/party-server-notice";  //公告接口 party-server-notice

var unite_img_url = "http://192.168.1.42:8888/file-server/api/images/"; //图片前缀IP


//保存登录后的信息：姓名、ID、公司ID
// var userId =  sessionStorage.getItem('userId');
// var userName =  sessionStorage.getItem('userName');
// var userFirmId =  sessionStorage.getItem('userFirmId');





/*上传压缩包大小格式验证*/
function zipSizeCheck(_this){
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
    if(size > 1000) {
        returnMessage(2,'附件不能大于1M！');
        return false;
    }else{
        if(postfix!='zip'){
            returnMessage(2,'请选择zip的格式文件上传！');
            _this.value==' ';
            return false;
        }else{
            $(".tempFileName").text($(_this)[0].value);
        }
    }
}

//获取公司列表
function getComp(id){
    $.ajax({
        type:'get',
        url:DMBServer_url+'/web/api/companys.json',
        dataType:'json',
        success:function(data){
            console.info(data)
            if(data.code===0){
                if(data.data.length>0){
                    var code="";
                    $.each(data.data,function(index,item){
                         code+=`
                                <option value=${item.orgId}>${item.name}</option>
                            `;

                    }) 
                    $(id).append(code);  
                }
            }
        }
    })
}

//模板路径判断 class
function path(_class){
    jQuery.validator.addMethod(""+ _class +"", function(value, element) {
        var chrnum = /^[A-Za-z0-9_./]+$/;
        return this.optional(element) || (chrnum.test(value));
    }, "请输入数字、字母、下划线和.");
}

//  列表全选，则全选显示；列表不全选，则全选不显示；
function checkDown(_this){
    var all = $(_this).parents("tbody").siblings("thead").find("input[type=checkbox]");  //将全选的按钮赋值给all
    if(_this.checked){
        var bur = true;
        $.each($(_this).parents("tr").siblings().find("input[type=checkbox]"),function(index,val){
            //  看列表是否全选
            if(!val.checked){
                bur = false;
            }
        });
        if(bur){
            all.prop("checked", true);
        }
    }else{
        all.prop("checked", false);
    }
}