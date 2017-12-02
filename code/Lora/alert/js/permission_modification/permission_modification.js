var id = null;
var isAdd = null,isEdit = null,isDetele = null;
$(document).ready(function(){
    // 角色管理	html/system/role_administration/role_administration.html	100140002
    // 添加角色		1001400020001
    // 修改角色		1001400020002
    // 删除角色		1001400020003
    isShow("1001400020001","1001400020002","","","","","","1001400020003");
    if(isAdd){
        $(".add").removeClass('hide');
    }else{
        $(".add").hide();
    }
    if(isEdit){
        $(".yes").removeClass('hide');
    }else{
        $(".yes").hide();
    }
    if(isDetele){
        $(".delete").removeClass('hide');
    }else{
        $(".delete").hide();
    }



    character();  //刷新角色列表
});
//角色点击事件
$(document).on("click",".permission i",function(){
    $(this).addClass("active").siblings("i").removeClass("active");
    id = $(this).attr("data-id");
    roleId(id);
});



var zTreeObj;
//在tree配置
var setting = {
    data: {
        key:{
            checked: "checked"
        },
        simpleData: {
            enable: false,
            idKey: "id"
        }
    },
    treeNode:{
        open: false, //折叠
    },
    view: {
        selectedMulti: true
    },
    check: {
        enable: true        //开启复选框
    }


};
//右侧侧菜单
function roleId(id){
    $.ajax({
        type: "POST",
        url:'/web/roleCtr/getRoleResources',
        data:{
        	"roleId":id
		},
        dataType: 'json',
        success:function(data){
            if(data.code === 200){
                //  如果数据不为空，则显示获取的数据；如果数据为空，则获取当前登录人员的权限数据；
                if(data.data){
                    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, data.data);
                }else{
                    $.ajax({
                        type: "POST",
                        url:'/web/accountCtr/getResourcesByUser',
                        dataType: 'json',
                        data:{},
                        success:function(e){
                            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, e.data);
                        },
                        error:function(){
                            returnMessage(2,'报错：' + data.status);
                        }
                    });
                }
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            returnMessage(2,'报错：' + data.status);
        }
    });
}
//左侧用户角色
function character(){
    $.ajax({
        type: "POST",
        url:'/web/roleCtr/getRoleAndResources',
        dataType: 'json',
        data:{},
        success:function(data){
            var permission = $(".permission");
            if(data.code === 200){
                var html = '';
                var sum = true;
                $.each(data.data.Roles,function(index,val){
                    //状态为true时显示，false时表示删除，不显示
                    if(val.status){
                        if(sum){
                            html += "<i class='active' data-id='"+ val.id +"'>"+  val.roleName +"</i>";
                            sum = false;  //将第一个显示状态；并显示权限

                            //  获取角色列表是，显示第一个角色的权限，并将val.id赋值给id，以保证立即点击确定不会报错
                            id = val.id;
                            roleId(val.id);
                        }else{
                            html += "<i data-id='"+ val.id +"'>"+  val.roleName +"</i>";
                        }
                    }
                });
                permission.html(html);
            }else{
                returnMessage(2,'报错：' + data.status);
            }
        },
        error:function(data){
            returnMessage(2,'报错：' + data.status);
        }
    });
}

//添加新角色
function added(){
    BootstrapDialog.show({
        title: '请输入角色名',
        message: $('<input maxlength="25" id="characterName" class="form-control" placeholder="请输入角色名"/>'),
        buttons: [{
            label: '确定',
            cssClass: 'btn-primary',
            hotkey: 13, // Enter.
            action: function(dialog) {
                var name = $("#characterName").val();
                if(name.length > 0 && name !== "" && $.trim(name) !== ""){
                    $.ajax({
                        type: "POST",
                        url:'/web/roleCtr/saveRole',
                        data:{
                            "r.roleName":name
                        },
                        dataType: 'json',
                        success:function(data){
                            if(data.code === 200){
                                returnMessage(1,data.message);
                                character();  //刷新角色列表
                            }else{
                                returnMessage(2,data.message);
                            }
                            dialog.close();  //关闭添加角色的输入框
                        },
                        error:function(data){
                            returnMessage(2,'报错：' + data.status);
                        }
                    });
                }else{
                    returnMessage(2,"用户名不能为空！");
                }
            }
        }]
    });
}
//删除角色
function deleteTheRole(){
    confirmMsg("是否删除所选角色？",function(dialog){
        dialog.close();  //关闭确定提示框
        var id = $(".permission").find(".active").attr("data-id");
        console.log(id);
        $.ajax({
            type: "POST",
            url:'/web/roleCtr/removeRole',
            dataType: 'json',
            data:{
                roleId:id
            },
            success:function(data){
                if(data.code === 200){
                    returnMessage(1,"删除成功！");
                    character();  //刷新角色列表
                }else{
                    returnMessage(2,data.message);
                }
            },
            error:function(data){
                returnMessage(2,'报错：' + data.status);
            }
        });
    });
}
//角色分配资源  ,角色没有资源，个角色添加资源
function authority(){
    if(id){
        var idName = zTreeObj.getCheckedNodes(true);  //获取ztree上呗选中参数
        var resourceId = [];   //id数组
        $.each(idName,function(index,val){
            resourceId.push(val.id);
        });
        if(resourceId.length <= 0){
            returnMessage(2,"请先勾选对应权限！");
            return false;
        }
        var data = {
            "roleId": id,
            "resourceId": resourceId
        };
        $.ajax({
            type: "POST",
            url: '/web/roleCtr/roleDistributionResource',
            data: {
                "jsonStr":JSON.stringify(data)
            },
            dataType: 'json',
            success: function (data) {
                if (data.code === 200) {
                    returnMessage(1,"权限修改成功！");
                    roleId(id);
                } else {
                    returnMessage(2, data.message);
                }
            },
            beforeSend: function () {
                $('.opering-mask').show();
            },
            complete: function () {
                $('.opering-mask').hide();
            },
            error: function (data) {
                returnMessage(2, '报错：' + data.status);
            }
        })
    }else{
        returnMessage(2, "请选择角色！");
    }
}