/**
 * Created by Administrator on 2017/6/21.
 */


//必填初始化
blurCheck($("#newForm"));
// getComp("#firmId");
path('path');   //模板路径判断

console.log(sessionStorage.getItem("modify_Id"));
var modify_Id = sessionStorage.getItem("modify_Id");


//修改 -- 函数 ******************************************数据详情*****************************************************
$.ajax({
    type:'get',
    url:  DMBServer_url +  '/web/api/templates/'+ modify_Id +'.json',
    data: {},
    dataType:'json',
    success:function(data){
        if(data.code === 0){

            //添加数据
            $("#modity_id").val(data.data.id);  //台账模板ID
            $("#path").val(data.data.path);  //台账路径
            $("#name").val(data.data.name);  //台账模板名
            $("#remark").val(data.data.remark);  //台账模板描述
            $("#iconImg").attr("src", unite_img_url + data.data.icon);  //模板封面图片显示
            // $("#icon").val(data.data.icon);  //台账模板元图片名
            $(".tempFileName").text(data.data.templateFile);   //台账模板文件名
            // $("#templateFile").val(data.data.templateFile);  //台账模板文件
            // $("#firmId").val(data.data.firmId);  //台账模板公司名
            $("#type").val(data.data.type);  //台账模板所属栏目



        }else{
            //data.code === -1
            returnMessage(2,'暂无数据');
        }
    },
    error:function(data){
        //报错提醒框
        returnMessage(2,'报错：' +  data.status);
    }
});

//****************************************************修改上传*****************************************************
function determine(){
    //修改,调用修改ajax
    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    $.ajax({
        type:'POST',
        url: DMBServer_url + '/web/api/templates/update.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0){

                returnMessage(1,'修改成功');

            }else{
                //data.code === -1
                returnMessage(2,'修改失败data.code为：' + data.code);
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

