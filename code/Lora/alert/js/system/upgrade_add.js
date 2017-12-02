/**
 * Created by Administrator on 2017/7/7.
 */

var id = null;
// blurCheck($("#addFform"));

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
    if(size > 1000000) {
        returnMessage(2,'附件不能大于1000M！');
    }else{
        if(postfix!='apk'){
            returnMessage(2,'请选择.apk的格式文件上传！');
            _this.value==' ';
        }else{

            var form = new FormData($("#newForm")[0]);
            $.ajax({
                type:'POST',
                url:  server_url + '/file/uploadFile.json',
                data: form,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('.opering-mask').show();
                    $(this).attr("disabled",true);
                    $("#addButton").attr("disabled",true);
                },
                complete: function () {
                    $('.opering-mask').hide();
                    $(this).attr("disabled",false);
                    $("#addButton").attr("disabled",false);
                },
                success:function(data){
                    if(data.code === 200){
                        returnMessage(1,'上传成功');
                        id = data.data[0].id;

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
    }
}
function save(){
    //判断是否上传
    if(!id){
        returnMessage(2,"请上传apk格式文件");
        return
    }
    $.ajax({
        type:'post',
        url: server_url + '/web/appManager/addAppManager',
        data:{
            "name":$("#name").val(),
            "version":$("#message").val(),
            "upgradeType":$("input[name=upgradeType]:checked").val(),
            "androidFileId":id
        },
        
        dataType:'json',
        // contentType:'application/json',
        success:function(data){
            if(data.code === 200){
                rebackList("添加成功！");
            }else{
                //无数据提醒框
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
}