/**
 * Created by Administrator on 2017/7/7.
 */
blurCheck($("#newForm"));
function save(){
    if($("#newForm").valid()){
        if(!($("#confirmPassword").val() === $("#newPassword").val())){
            returnMessage(2,"密码不一致");
            return
        }
        //判断是否上传
        $.ajax({
            type:'post',
            url: server_url + '/web/accountCtr/modifyPassword',
            data:{
                "originalPassword": $("input[name=originalPassword]").val(),
                "newPassword": $("input[name=newPassword]").val(),
                "confirmPassword": $("input[name=confirmPassword]").val()
            },

            dataType:'json',
            success:function(data){
                if(data.code === 200){
                    //  为修改遮罩层不能遮住全部页面的缺陷，将函数添加至index.js中
                    window.parent.modifyDialog();
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
}