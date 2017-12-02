/**
 * Created by Administrator on 2017/6/27.
 */


var view_Id = sessionStorage.getItem("view_Id");
console.log(view_Id);

$.ajax({
    type:'get',
    url: DMBServer_url + '/web/api/news/'+ view_Id +'.json',
    data:{},
    dataType:'json',
    success:function(data){
        if(data.code === 0){

            $(".header").text(data.data.title);

            var type = data.data.type === 1?"本局党建动态":"党建每日读";
            $(".type").text(type);

            $(".collects span").text(data.data.collects);

            $(".content").html(data.data.content);

        }else{
            //无数据提醒框
            returnMessage(2,'暂无数据');
        }
    },
    error:function(data){
        //报错提醒框
        returnMessage(2,'报错：' +  data.status);
    }
});