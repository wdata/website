/**
 * Created by Administrator on 2017/9/5.
 */
$.ajax({
    type:'get',
    url:  server_url_notice + server_v1 + '/notify/'+ urlParams("id") +'/'+ userId +'.json',
    data: null,
    dataType:'json',
    success:function(data){
        if(data.code === 0 && data.data){
            $(".title p").text(data.data.title);  // 标题；
            $(".name span").text(data.data.author.name);  // 发布人；
            $(".personal time").text(data.data.createTime);  //时间；
            $("article").text(data.data.content);     //内容；

            if(data.data.type === 2){
                $(".types").removeClass("hide");
            }

            //  附件
            var html = '';
            if(data.data.file){
                $.each(data.data.file,function(index,val){
                    var da = val.fileName.split(".");
                    var i = "";
                    switch(da[1]){
                        case "pdf":i = '<i class="suffix-icon pdf-icon"></i>';
                            break;
                        case "excel":i = '<i class="suffix-icon excel-icon"></i>';
                            break;
                        case "word":i = '<i class="suffix-icon word-icon"></i>';
                            break;
                        default:i = '<i class="suffix-icon pdf-icon"></i>';
                            break;
                    }
                    // <i class="suffix-icon pdf-icon"></i>
                    // <i class="suffix-icon excel-icon"></i>
                    // <i class="suffix-icon word-icon"></i>
                    html += '<li>'+ i +'<p class=""><span>'+ da[0] +'</span>.'+ da[1] +'</p> <a onclick="downloaded()" download href="'+ val.url +'" class="icon-wrap"><i class="download-icon"></i></a> </li>'
                });
                $(".annex").empty().append(html);
            }

            $(".content").removeClass("hide");
        }
    },
    error:function(data){ErrorReminder(data);}
});

function downloaded(){
    if( typeof WeixinJSBridge !== "undefined" ){
        showMask("请点击右上角选择浏览器，跳转到浏览器下载！");
    }
}