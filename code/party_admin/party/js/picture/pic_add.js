/**
 * Created by Administrator on 2017/6/14.
 */
// getComp("#regist_select");
//确定
blurCheck("#newForm");
function editAjax(){
    var form = new FormData($("#newForm")[0]);
    if($("#newForm").valid()){
        $.ajax({
            type:'post',
            url:  DMBserver_image_url + '/web/api/images.json',
            data:form,
            contentType: false,
            processData: false,
            success:function(data){
                console.log(data);
                if(data.code === 0){
                    returnMessage(1,'添加成功！');
                    //修改成功，清空表单
                    $("#newForm")[0].reset();
                    $(".abs").attr("src","");
                }else{
                    returnMessage(2,'添加失败data.code为：' + data.code);
                }
            },
            beforeSend:function(xhr){
                $('.opering-mask').show().find('.con').text('正在处理中，处理结束后该弹窗消失！');
            },
            complete:function(){
                $('.opering-mask').hide();
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
        }
}