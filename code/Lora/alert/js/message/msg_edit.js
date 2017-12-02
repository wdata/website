var msg_id=sessionStorage.getItem("msg_id");
$(document).ready(function(){
    date('#sendTime','#validTime');
    var roles=null,groups=null;
    $.ajax({
        type: 'post',
        url: server_url + '/web/notice/getNoticeInfo',
        data: {id: msg_id},
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                var data = data.data;
                $("#content").val(data.content);
                $("#sendTime").val(new Date(data.sendTime).toLocaleString());
                $("#validTime").val(new Date(data.validTime).toDateString());
                $("#title").val(data.title);
                roles=data.roles;
                groups=data.groups;
                var companyId =data.companyId;
                //获取设备组
                facility(function(data){
                    if(data.code==200){
                        var html='',checked="",group_id=[];
                        $.each(groups, function (index,group) {
                            group_id.push(group.id);
                        });
                        $.each(data.data,function(index,item){

                            if(group_id.indexOf(item.id)==-1){
                                checked="";
                            }else{
                                checked="checked";
                            }
                            html+=`<label><input type="checkbox" ${checked} value="${item.id}"><i></i>${item.groupName}</label>`;

                        });
                        $("#check_group").html(html);
                    }else{
                        returnMessage(2,data.message);
                    }
                });
                //所属公司
                company(function(data){
                    if(data.code==200){
                        var options='<option value="">全部</option>';
                        $.each(data.data.company,function(index,item){
                            options+='<option value="'+item.id+'">'+item.companyName+'</option>';
                        });
                        $("#companyName").html(options);
                        $("#companyName").val(companyId);
                    }else{
                        returnMessage(2,data.message);
                    }
                });
                $(".selector").find("option[text='"+data.companyName+"']").attr("selected",true);
                //发送对象
                send_object(function(data){
                        if(data.code==200){
                            var html='',role_id=[],checked="";
                            $.each(roles,function (index, role){
                                role_id.push(role.id);
                            });
                            $.each(data.data,function(index,item){
                                //var checked=item.val==="安全巡检员"?"checked":"";
                                var disable=item.name==="安全巡检员"||item.val==="安全管理员"?"":"disabled";
                                checked=role_id.indexOf(item.id)==-1?"":"checked";
                                html+=`<label><input type="checkbox" ${checked} ${disable} value="${item.id}"><i></i>${item.name}</label>`;
                            });
                            $("#send_name").html(html);
                        }else{
                            returnMessage(2,data.message);
                        }
                    });


            } else {
                returnMessage(2, data.message);
            }
        },
        error: function (data) {
            //报错提醒框
            returnMessage(2, '报错：' + data.status);
        }
    });
});
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
    form.append("id",msg_id);
    form.append("companyId",companyId);
    if($("#main_form").valid()&&$("#validTime").val()!=''){
        if(gorundId.length==0){
            $("#check_group+.cred").text("必填字段").removeClass("hide");
        }else if(roleId.length==0&&gorundId.length!=0){
            $("#send_name+.cred").text("必填字段").removeClass("hide");
        }else {
            $.ajax({
                type: 'post',
                url: server_url + '/web/notice/updateNotice',
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
                        rebackList("修改成功！")
                    } else {
                        returnMessage(2,data.message);
                    }
                },
                error: function (data) {
                    //报错提醒框
                    returnMessage(2, '报错：' + data.status);
                }
            })
        }
    }
}
