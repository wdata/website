/**
 * Created by Administrator on 2017/6/21.
 */

//必填初始化
blurCheck($("#newForm"));
// getComp("#firmId");
path('path');   //模板路径判断
//****************************************************新增上传*****************************************************
function determine(){
    if($("#newForm").valid()){
        //新增，调用新增ajax
        if(!($("#iconFile").val()&&$("#tempFile").val())){
            returnMessage(2,'台账模板和封面图片不能为空！');
            return
        }
        var form = new FormData($("#newForm")[0]);       //需要是JS对象
        $.ajax({
            type:'post',
            url:  DMBServer_url + '/web/api/templates.json',
            data: form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){


                    returnMessage(1,'添加成功');
                    //清空数据
                    $("#newForm").find("input[type=text],input[type=file],textarea").val("");
                    $("#iconImg").attr("src","");
                    $(".tempFileName").text("");

                }else{
                    //data.code === -1
                    returnMessage(2,'data.code为-1');
                }
            },
            beforeSend:function(){
                $('.opering-mask').show().find('.con').text('正在处理中，处理结束后该弹窗消失！');
            },
            complete:function(){
                $('.opering-mask').hide()
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }
}