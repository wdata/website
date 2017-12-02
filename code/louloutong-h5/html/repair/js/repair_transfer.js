/**
 * Created by Administrator on 2017/8/28.
 */
//  移交；
$(".carry").on("click",function(){
    var remark = $("#remark").text();
    var reason = $("#reason").text();
    if(!(reg.test(remark)|| remark === "") || !(reg.test(reason)|| reason === "")){
        if(wxImg.imgBur){
            showMask("正在处理图片，请稍等！");
            return
        }
        var urls = [];
        $.each(wxImg.fileData,function(index,val){
            urls.push(val.url);
        });
        $.ajax({
            type:'post',
            url:  server_url_repair + server_v1 + '/repair/transferred.json',
            data: {
                "urls":urls,
                "id":urlParams("id"),
                "userId":userId,
                "remark":remark,
                "reason":$("#reason").text()
            },
            dataType:'json',
            traditional:true,
            success:function(data){
                if(data.code === 0){
                    window.location.href = "repair_details.html?id="+ urlParams("id") +"";
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    }else{
        showMask("移交原因,移交说明不能为空！");
    }
});