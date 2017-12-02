
$(document).ready(function(){
    date('#sendTime','#validTime');
    //获取设备组
    facility(function(data){
        if(data.code==200){
            var html='';
            $.each(data.data,function(index,item){
                html+=`<label><input type="checkbox" value="${item.id}"><i></i>${item.groupName}</label>`;
            });
            $("#check_group").html(html);
        }else{
            returnMessage(2,data.message);
        }
    });
    //所属公司
    company(function(data){
        if(data.code==200){
            var options='';
            $.each(data.data.company,function(index,item){
                options+='<option value="'+item.id+'">'+item.companyName+'</option>';
            });
            $("#company_sel").html(options);
            $("#company_sel").val(sessionStorage.getItem("companyID"));
        }else{
            returnMessage(2,data.message);
        }
    });
    //发送对象
    send_object(function(data){
        if(data.code==200){
            var html='';
            $.each(data.data,function(index,item){
                var checked=item.name==="安全巡检员"?"checked":"";
                var disable=item.name==="安全巡检员"||item.name==="安全管理员"?"":"disabled";
                html+=`<label><input type="checkbox" ${checked} ${disable} value="${item.id}"><i></i>${item.name}</label>`;
            });
            $("#send_name").html(html);
        }else{
            returnMessage(2,data.message);
        }
    });
});//日期
function save(){
    var roleId=[];
    $.each($("#send_name input:checked"),function(index,item){
        roleId.push($(item).val());
    });
    var gorundId=[];
    $.each($("#check_group input:checked"),function(index,item){
        gorundId.push($(item).val());
    });
    var form = new FormData($("#main_form")[0]);
    var companyId=sessionStorage.getItem("companyID");
    form.append("groupIds",gorundId);
    form.append("roleIds",roleId);
    form.append("companyId",companyId);
    if($("#main_form").valid()&&$("#validTime").val()!='') {
        if(gorundId.length==0){
            $("#check_group+.cred").text("必填字段").removeClass("hide");
        }else if(roleId.length==0&&gorundId.length!=0){
            $("#send_name+.cred").text("必填字段").removeClass("hide");
        }else{
            $.ajax({
                type: 'post',
                url: server_url + '/web/notice/addNotice	',
                data: form,
                contentType: false,
                processData: false,
                beforeSend:function(){
                    $('.opering-mask').show();
                },
                complete:function(){
                    $('.opering-mask').hide();
                },
                success: function (data) {
                    if (data.code == 200) {
                        rebackList("添加成功！")
                    } else {
                        returnMessage(2,data.message);
                    }
                },
                error: function (data) {
                    //报错提醒框
                    returnMessage(2, '报错：' + data.status);
                }
            });
        }
    }
}



















































