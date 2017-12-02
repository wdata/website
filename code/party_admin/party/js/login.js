/**
 * Created by Administrator on 2017/7/20.
 */
$(function(){
    $('.sign_on').click(function(){
        var userName = $("#userName").val();
        var userPassword = $("#userPassword").val();
        if(userName && userPassword){
            $.ajax({
                url:ServerId　+ '/web/login.json',
                type:'POST',
                data:{
                    loginName:userName,
                    password:userPassword
                },
                dataType: 'json',
                success:function(data){
                    if(data.code === 0){
                        returnMessage(1,"登录成功！");
                        setTimeout(function(){
                            window.location.replace("index.html");
                        },300);
                    }else{
                        returnMessage(2,"用户名和密码输入错误！");
                    }
                },
                beforeSend:function(){
                    $('.opering-mask').show().find('.con').text('正在登录请稍等！');
                },
                complete:function(){
                    $('.opering-mask').hide()
                },
                error: function(msg) {
                    returnMessage(2,"报错："+ msg.status);
                }
            });
        }else{
            returnMessage(2,"请输入用户名和密码！");
        }
    });
});
