/**
 * Created by Administrator on 2017/6/21.
 */

blurCheck($("#newForm"));
path("path");   //URL验证

console.log(sessionStorage.getItem("modify_Id"));
var modify_Id = sessionStorage.getItem("modify_Id");


//修改 -- 函数 ******************************************数据详情*****************************************************
$.ajax({
    type:'get',
    url:  DMBServer_url +  '/web/api/menus/'+ modify_Id +'.json',
    data: {},
    dataType:'json',
    success:function(data){
        if(data.code === 0){

            //添加数据
            $("#position").val(data.data.position);   //频道位置
            $("#name").val(data.data.name);  //频道名
            $("#sort").val(data.data.sort);  //排序值
            $(".abs").attr("src",unite_img_url + data.data.icon);  //图片
            // $("#icon").val(data.data.icon);
            $("#urlDiZhi").val(data.data.url);  //url
            $("#remark").val(data.data.remark); //描述
            data.data.status === 0 ? $("#close").attr("checked",true):$("#open").attr("checked",true);   //禁用、启用

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
    $("#edit_id").val(modify_Id);
    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    $.ajax({
        type:'POST',
        url: DMBServer_url + '/web/api/menus/update.json',
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