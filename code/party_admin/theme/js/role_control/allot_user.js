var size=10;
var role_id_user=sessionStorage.getItem("role_id_user");
$(document).ready(function(){
    //角色下为分配的用户列表
    $.ajax({
        type: "get",
        url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
        dataType: 'json',
        data:{"count":-1,"page":1,"size":size},
        success:function(data){
            if(data.items.length!=0||data.items!=null){
                //分页
                if(data.pageCount){
                    initPagination("#user_pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
                            data:{"count":-1,"page":num,"size":size},
                            dataType: 'json',
                            success:function(data){
                                var html="";
                                $(data.items).each(function(index){
                                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].shortName+"</td><td>"+$(this)[0].enName+"</td><td>"+$(this)[0].phone+"</td><td>"+$(this)[0].email+"</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
                                });
                                $("#user_tab tbody").html(html);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                returnMessage(2,"数据链接错误！！！！");
                            }
                        });
                    });
                }else{
                    returnMessage(2,"没有查到符合条件的数据！！！！");
                }
                var html="";
                $(data.items).each(function(index){
                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].shortName+"</td><td>"+$(this)[0].enName+"</td><td>"+$(this)[0].phone+"</td><td>"+$(this)[0].email+"</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
                });
                $("#user_tab tbody").append(html);
            }else{
                returnMessage(2,"该角色没有分配用户！！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"返回数据错误！！");
        }
    });

});


//用户管理查询
function search_user(){
    var username=$("#user_search input[name='login_no']").val();
    var name=$("#user_search input[name='name']").val();
    $.ajax({
        type: "get",
        url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
        dataType: 'json',
        data:{"count":-1,"page":1,"size":size,"username":username,"name":name},
        success:function(data){
            if(data.items.length!=0||data.items!=null){
                //分页
                if(data.pageCount){
                    initPagination("#user_pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
                            data:{"count":-1,"page":num,"size":size,"username":username,"name":name},
                            dataType: 'json',
                            success:function(data){
                                $("#user_tab tbody").html("");
                                var html="";
                                $(data.items).each(function(index){
                                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].shortName+"</td><td>"+$(this)[0].enName+"</td><td>"+$(this)[0].phone+"</td><td>"+$(this)[0].email+"</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
                                });
                                $("#user_tab tbody").append(html);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                returnMessage(2,"数据链接错误！！！！");
                            }
                        });
                    });
                }else{
                    returnMessage(2,"没有查到符合条件的数据！！！！");
                }
                var html="";
                $(data.items).each(function(index){
                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].shortName+"</td><td>"+$(this)[0].enName+"</td><td>"+$(this)[0].phone+"</td><td>"+$(this)[0].email+"</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
                });
                $("#user_tab tbody").append(html);
            }else{
                returnMessage(2,"该角色没有分配用户！！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"返回数据错误！！");
        }
    });
}
//添加用户
function add_user(){
    $.ajax({
        type: "get",
        url: server_url+'/crm/sys/auth/RoleCtrl/addRoleUserList.json',
        data:{"roleid":role_id_user,"count":-1,"page":1,"size":size},
        dataType: 'json',
        success:function(data){
            if(data.items.length!=0||data.items!=null){
                $("#add_user_tab tbody").html("");
                //分页
                if(data.pageCount){
                    initPagination("#user_add_pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/sys/auth/RoleCtrl/addRoleUserList.json',
                            data:{"roleid":role_id_user,"count":-1,"page":num,"size":size,},
                            dataType: 'json',
                            success:function(data){
                                $("#add_user_tab tbody").html("");
                                var html="";
                                $(data.items).each(function(index){
                                    var status =$(this)[0].status==1?"正常":"关闭";
                                    html+="<tr><td><input type='checkbox'value='"+$(this)[0].id+"'></td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>-</td><td>"+status+"</td><td><select name='scope'><option value='0'>本部门</option><option value='1'>本单位</option><option value='2'>本集团</option><option value='9'>全局</option></select></td></tr>";
                                });
                                $("#add_user_tab tbody").append(html);
                                $("#add_user").modal();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                returnMessage(2,"数据链接错误！！！！");
                            }
                        });
                    });
                    var html="";
                    $(data.items).each(function(index){
                        var status =$(this)[0].status==1?"正常":"关闭";
                        html+="<tr><td><input type='checkbox'value='"+$(this)[0].id+"'></td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>-</td><td>"+status+"</td><td><select name='scope'><option value='0'>本部门</option><option value='1'>本单位</option><option value='2'>本集团</option><option value='9'>全局</option></select></td></tr>";
                    });
                    $("#add_user_tab tbody").append(html);
                    $("#add_user").modal();
                }else{
                    returnMessage(2,"没有查到符合条件的数据！！！！");
                }
            }else{
                returnMessage(2,"该角色没有未添加的用户！！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"数据链接错误！！！！");
        }
    });
}
//添加用户界面的搜索
function user_search(){
    var username=$("#add_user form input[name='login_no']").val();
    var name=$("#add_user form input[name='name']").val();
    $.ajax({
        type: "get",
        url: server_url+'/crm/sys/auth/RoleCtrl/addRoleUserList.json',
        data:{"roleid":role_id_user,"username":username,"name":name,"count":-1,"page":1,"size":size},
        dataType: 'json',
        success:function(data){
            if(data.items.length!=0||data.items!=null){
                $("#add_user_tab tbody").html("");
                //分页
                if(data.pageCount){
                    initPagination("#user_add_pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/sys/auth/RoleCtrl/addRoleUserList.json',
                            data:{"roleid":role_id_user,"username":username,"name":name,"count":-1,"page":num,"size":size,},
                            dataType: 'json',
                            success:function(data){
                                $("#add_user_tab tbody").html("");
                                var html="";
                                $(data.items).each(function(index){
                                    var status =$(this)[0].status==1?"正常":"关闭";
                                    html+="<tr><td><input type='checkbox'value='"+$(this)[0].id+"'></td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>-</td><td>"+status+"</td><td><select name='scope'><option value='0'>本部门</option><option value='1'>本单位</option><option value='2'>本集团</option><option value='9'>全局</option></select></td></tr>";
                                });
                                $("#add_user_tab tbody").append(html);
                                $("#add_user").modal();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                returnMessage(2,"数据链接错误！！！！");
                            }
                        });
                    });
                    var html="";
                    $(data.items).each(function(index){
                        var status =$(this)[0].status==1?"正常":"关闭";
                        html+="<tr><td><input type='checkbox'value='"+$(this)[0].id+"'></td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>-</td><td>"+status+"</td><td><select name='scope'><option value='0'>本部门</option><option value='1'>本单位</option><option value='2'>本集团</option><option value='9'>全局</option></select></td></tr>";
                    });
                    $("#add_user_tab tbody").append(html);
                    $("#add_user").modal();
                }else{
                    returnMessage(2,"没有查到符合条件的数据！！！！");
                }
            }else{
                returnMessage(2,"该角色没有未添加的用户！！");
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"数据链接错误！！！！");
        }
    });
}
//添加用户到角色
function save_user(){
    var ids=[],scopes=[];
    var input_checked=$("#add_user_tab tbody input[type='checkbox']").is(":checked");
    if(input_checked){
        var inputs = $("#add_user_tab tbody input:checked");
        inputs.each(function(){
            var id=$($(this)[0]).val();
            var scope=$($(this).parents("tr").children("td")[5]).children("select").val();
            ids.push(id);
            scopes.push(scope);
        });
        $.ajax({
            type: "post",
            url: server_url+'/crm/sys/auth/RoleCtrl/addRoleUser.json',
            dataType: 'json',
            data:{"principals":ids.join(','),"scope":scopes.join(','),"roleid":role_id_user},
            success:function(data){
                if(data.statusCode==200){
                    returnMessage(1,data.message);
                    $("#add_user").modal("hide");
                    $.ajax({
                        type: "get",
                        url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
                        dataType: 'json',
                        data:{"count":-1,"page":1,"size":size,"username":null,"name":null},
                        success:function(data){
                            //分页
                            initPagination("#user_pagination",data.pageCount,data.pageCount,data.page,function(num){
                                page=num;
                                $.ajax({
                                    type: "get",
                                    url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
                                    data:{"count":-1,"page":num,"size":size,"username":null,"name":null},
                                    dataType: 'json',
                                    success:function(data){
                                        $("#user_tab tbody").html("");
                                        var html="";
                                        $(data.items).each(function(index){
                                            html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].shortName+"</td><td>"+$(this)[0].enName+"</td><td>"+$(this)[0].phone+"</td><td>"+$(this)[0].email+"</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
                                        });
                                        $("#user_tab tbody").append(html);
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        returnMessage(2,"数据链接错误！！！！");
                                    }
                                });
                            });
                            var html="";
                            $(data.items).each(function(index){
                                html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].shortName+"</td><td>"+$(this)[0].enName+"</td><td>"+$(this)[0].phone+"</td><td>"+$(this)[0].email+"</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
                            });
                            $("#user_tab tbody").append(html);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            returnMessage(2,"返回数据错误！！");
                        }
                    });

                }else{
                    returnMessage(2,data.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                returnMessage(2,"返回数据错误！！");
            }
        });

    }else{
        returnMessage(0,"请选择要添加的用户！！");
    }
}
//删除用户
function deleted_user(){
    var userIds=[];
    var input_checked=$("#user_tab tbody input[type='checkbox']").is(":checked");
    if(input_checked){
        var inputs=$("#user_tab tbody input:checked");
        inputs.each(function(){
            var userId=$($(this)[0]).val();
            userIds.push(userId);
        });
        $.ajax({
            type: "post",
            url: server_url+'/crm/sys/auth/RoleCtrl/rmRoleUser.json',
            dataType: 'json',
            data:{"ids":userIds.join(','),"roleid":role_id_user},
            success:function(data){
                if(data.statusCode==200){
                    returnMessage(1,data.message);
                    $.ajax({
                        type: "get",
                        url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
                        dataType: 'json',
                        data:{"count":-1,"page":1,"size":size,"username":null,"name":null},
                        success:function(data){
                            if(data.items.length!=0||data.items!=null){
                                //分页
                                if(data.pageCount){
                                    initPagination("#user_pagination",data.pageCount,data.pageCount,data.page,function(num){
                                        page=num;
                                        $.ajax({
                                            type: "get",
                                            url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
                                            data:{"count":-1,"page":num,"size":size,"username":null,"name":null},
                                            dataType: 'json',
                                            success:function(data){
                                                $("#user_tab tbody").html("");
                                                var html="";
                                                $(data.items).each(function(index){
                                                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].shortName+"</td><td>"+$(this)[0].enName+"</td><td>"+$(this)[0].phone+"</td><td>"+$(this)[0].email+"</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
                                                });
                                                $("#user_tab tbody").append(html);
                                            },
                                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                                returnMessage(2,"数据链接错误！！！！");
                                            }
                                        });
                                    });
                                }else{
                                    returnMessage(2,"没有查到符合条件的数据！！！！");
                                }
                                var html="";
                                $(data.items).each(function(index){
                                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].username+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].shortName+"</td><td>"+$(this)[0].enName+"</td><td>"+$(this)[0].phone+"</td><td>"+$(this)[0].email+"</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>";
                                });
                                $("#user_tab tbody").append(html);
                            }else{
                                returnMessage(2,"该角色没有分配用户！！");
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            returnMessage(2,"返回数据错误！！");
                        }
                    });
                }else{
                    returnMessage(2,data.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                returnMessage(2,"返回数据错误！！");
            }
        });
    }else{
        returnMessage(0,"请选择要删除的用户！！");
    }
}