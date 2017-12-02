var branch_id=sessionStorage.getItem('branch_id');
$(document).ready(function(){
    // $("#reviewTime").datetimepicker({
    //     format: "yyyy-mm-dd hh:mm:ss",
    //     //minView:'month',
    //     autoclose: true,
    //     todayBtn: true,
    //     changeMonth: true,
    //     changeYear: true,
    //     language: 'zh-CN',
    //     clearBtn: true
    //     //pickerPosition: "bottom-left"
    // }).on("click",function(){
    //     $("#datetimeEnd").datetimepicker("setStartDate",$("#datetimeStart").val())
    // });
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/article/'+branch_id+'.json',
        data:{},
        dataType:'json',
        success:function(data){
            var type=data.data.user.type==0?"群众":data.data.user.type==10?"积极分子":data.data.user.type==20?"重点对象":data.data.user.type==30?"预备党员":"党员";
            if(data.code === 0){
                $("#userName").val(data.data.user.userName);
                $("#organName").text(data.data.user.organName);
                $("#stage").text(type);
                $("#joinPartyDate").text(data.data.user.joinPartyDate);
                $("#reviewer").val(data.data.reviewer);
                $("#reviewTime").val(data.data.reviewTime);
                $("#content").text(data.data.content);
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
//点击提交或发布
function editAjax(){
    var data={
        id:branch_id,
        reviewer:$("#reviewer").val(),
        content:$("#content").val(),
        reviewTime:$("#reviewTime").val()
    };
    if($("#newForm").valid()){
        $.ajax({
            type:'POST',
            url: DMBServer_url + '/web/api/article/update.json',
            data:data,
            dataType:'json',
            success:function(data){
                console.log(data);
                if(data.code === 0){
                    returnMessage(1,'修改成功！');
                }else{
                    returnMessage(2,'修改失败data.code为：' + data.code);
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