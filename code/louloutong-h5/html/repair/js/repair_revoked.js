/**
 * Created by Administrator on 2017/8/28.
 */
function revoked(){
    var reason = $(".the-reason").text();
    if(!(reg.test(reason)||reason === "")){
        $.ajax({
            type:'post',
            url:  server_url_repair + server_v1 + '/repair/revoked.json',
            data: {
                "id":urlParams("id"),
                "userId":userId,
                "reason":reason
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    window.location.href = "repair_revoked_has.html?id="+ urlParams("id") +"";
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    }else{
        showMask("撤销详情不能为空！");
    }
}