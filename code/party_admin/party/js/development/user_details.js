var userId=sessionStorage.getItem('development_id');//用户ID
var firmId=null;
$(document).ready(function(){
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/user/'+userId+'.json',
        data:{},
        dataType:'json',
        success:function(data){
            firmId=data.data.firmId;
            var stage=data.data.type==0?"群众":data.data.type==10?"积极分子":data.data.type==20?"重点对象":data.data.type==30?"预备党员":"党员";
            var sex=data.data.sex==0?"女":data.data.sex==1?"男":"未知";
            if(data.code === 0){
                $("#userName").text(data.data.userName);
                $("#name").text(data.data.name);
                $("#sex").text(sex);
                $("#age").text(data.data.age);
                $("#organName").text(data.data.organName);
                if(data.data.jobs===undefined){
                    $("#position").text("");
                }else{
                    $("#position").text(data.data.jobs[0].name);

                }
                $("#score").text(data.data.score);
                $("#thoughtReports").text(data.data.thoughtReports);
                $("#ledgers").text(data.data.ledgers);
                $("#type").text(stage);
            }else{
                //无数据提醒框
                returnMessage(2,'暂无数据！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
});
function application(){
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/article/application.json',
        data:{userId:userId,firmId:firmId},
        dataType:'json',
        success:function(data){
            if(data.code === 0){
                $("#myModalLabel").text(data.data.title);
                $("#myModal .modal-body").html(data.data.content);
                $('#myModal').modal();
            }else{
                //无数据提醒框
                returnMessage(2,'暂无数据！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}