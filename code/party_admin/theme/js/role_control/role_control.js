var size=10;
var page="";
var role_id="";
var role_id_user="";
var role_id_org="";
$(document).ready(function(){
    //角色列表
    $.ajax({
        type: "get",
        url: server_url+'/crm/general/roles.json?filters[type].type=int&filters[type].eq=1',
        data:{"count":-1,"page":1,"size":size},
        dataType: 'json',
        success:function(data){
            $("#tab tbody").html("");
            if(data.items!=null||data.items.length!=0){
                //分页
                if(data.pageCount){
                    initPagination("#pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/general/roles.json?filters[type].type=int&filters[type].eq=1',
                            data:{"count":-1,"page":num,"size":size},
                            dataType: 'json',
                            success:function(data){
                                $("#tab tbody").html("");
                                if(data.items!=null||data.items.length!=0){
                                    var html="";
                                    $(data.items).each(function(index){
                                        var status=$(this)[0].status;
                                        status=status=="0"?"disabled":"enabled";
                                        html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].id+"</td><td>"+$(this)[0].name+"</td><td class='yes-onoff'><a  class='"+status+"' title='正常'></a></td><td><button class='btn btn-primary' onclick='revise_role(this)'>修改</button></td></tr>";
                                    });
                                    $("#tab tbody").append(html);
                                }else{
                                    returnMessage(2,"返回数据为空！！！！");
                                }
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
                    var status=$(this)[0].status;
                    status=status=="0"?"disabled":"enabled";
                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].id+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].id+"</td><td>"+$(this)[0].name+"</td><td class='yes-onoff'><a  class='"+status+"' title='正常'></a></td><td><button class='btn btn-primary' onclick='revise_role(this)'>修改</button></td></tr>";
                });
                $("#tab tbody").append(html);
            }else{
                returnMessage(2,"返回的数据为空！！！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"返回数据错误！！！");
        }
  });
    //角色列表查询
    $("#ncsubmit").click(function(){
        var id=$("#formSearch input[name='id']").val();
        var name=$("#formSearch input[name='name']").val();
        $.ajax({
            type: "get",
            url: server_url + '/crm/general/roles.json?filters[type].type=int&filters[type].eq=0',
            data: {"count": -1, "page": 1, "size": 10,"filters[name].like": name, "filters[id].like": id},
            dataType: 'json',
            success: function (data) {
                $("#tab tbody").html("");
                if (data.items != null||data.items.length!=0) {
                    var role_html = "";
                    $(data.items).each(function (index) {
                        var status = $(this)[0].status;
                        status = status == "0" ? "disabled" : "enabled";
                        role_html += "<tr><td><input type='checkbox'  name='roleId'></td><td>" + (index + 1) + "</td><td>" + $(this)[0].id + "</td><td>" + $(this)[0].name + "</td><td class='yes-onoff'><a  class='" + status + "' title='正常'></a></td><td><button class='btn btn-primary' onclick='revise_role(this)'>修改</button></td></tr>";
                    });
                    //分页
                    if(data.pageCount){
                        initPagination("#pagination",data.pageCount,data.pageCount,data.page,function(num){
                            page=num;
                            $.ajax({
                                type: "get",
                                url: server_url+'/crm/general/roles.json?filters[type].type=int&filters[type].eq=0',
                                data:{"count":-1,"page":num,"size":size,"filters[name].like": name, "filters[id].like": id},
                                dataType: 'json',
                                success:function(data){
                                    $("#tab tbody").html("");
                                    if(data.items!=null||data.items.length!=0){
                                        var html="";
                                        $(data.items).each(function(index){
                                            var status=$(this)[0].status;
                                            status=status=="0"?"disabled":"enabled";
                                            html+="<tr><td><input type='checkbox'  name='roleId'></td><td>"+(index+1)+"</td><td>"+$(this)[0].id+"</td><td>"+$(this)[0].name+"</td><td class='yes-onoff'><a  class='"+status+"' title='正常'></a></td><td><button class='btn btn-primary' onclick='revise_role(this)'>修改</button></td></tr>";
                                        });
                                        $("#tab tbody").append(html);
                                    }else{
                                        returnMessage(2,"返回数据为空！！！！");
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    returnMessage(2,"数据链接错误！！！！");
                                }
                            });
                        });
                    }else{
                        returnMessage(2,"没有查到符合条件的数据！！！！");
                    }
                    $("#tab tbody").append(role_html);
                } else {
                    returnMessage(2,"返回的数据为空！！！");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                returnMessage(2,"返回数据错误！！！");
            }
        });
    });
    //添加角色保存按钮
    $("#add_save").click(function(){
        var id=$("#role_id").val();
        var name=$("#role_name").val();
        var status=$("#role_status").val();
        var type=$("#role_type").val();
        $("#add").modal("hide");
        $.ajax({
            type: "post",
            url: server_url+'/crm/sys/auth/RoleCtrl/Create.json',
            data:{"id":id,"name":name,"status":status,"type":type},
            dataType: 'json',
            success:function(data){
                console.log(data);
                if(data.statusCode=="0"){
                    returnMessage(1,data.message);
                    setTimeout(function(){location.reload(true);},2000);
                }else{
                    returnMessage(2,data.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                returnMessage(2,"数据链接错误！！！！");
            }
        });
    });
    //修改角色的保存按钮
    $("#role_edit").click(function(){
        var id=$("#amend_id").text();
        var name=$("#amend_name").val();
        var statue=$("#amend_status").val();
        $("#amend").modal("hide");
        $.ajax({
            type: "POST",
            url: server_url+'/crm/sys/auth/RoleCtrl/update.json',
            data:{"id":id,"name":name,"status":statue},
            dataType: 'json',
            success:function(data){
                if(data.statusCode=="0"){
                    returnMessage(1,data.message);
                    setTimeout(function(){location.reload(true);},2000);
                }else{
                    returnMessage(2,data.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                returnMessage(2,"数据链接错误！！！！");
            }
        });
    });
    //删除角色
    $("#deleted_role").click(function(){
        var roleId=[];
        var input_checked=$("#tab tbody input[type='checkbox']").is(":checked");
        if(input_checked){
            var inputs=$("#tab tbody input:checked");
            inputs.each(function(){
                var id=$($(this)[0]).val();
                roleId.push(id);
            });
            $.ajax({
                type: "post",
                url: server_url+'/crm/sys/auth/RoleCtrl/Delete.json',
                dataType: 'json',
                data:{"ids":roleId.join(',')},
                success:function(data){
                    if(data.statusCode==200){
                       returnMessage(1,data.message);
                        setTimeout(function(){location.reload(true);},2000);
                        }else{
                            returnMessage(2,data.message);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        returnMessage(2,"返回数据错误！！");
                    }
                });
            }else{
                returnMessage(2,"请选择要删除的角色！！");
            }
    });
    //分配资源
    $("#allot_res").click(function(){
        var input_checked=$("#tab tbody input[type='checkbox']").is(":checked");
        if(input_checked){
            var roleId=$("#tab tbody input:checked").val();
            role_id=roleId;
            $.ajax({
                type: "post",
                url: server_url+'/crm/sys/auth/RoleCtrl/EditResoutce/'+roleId+'.json',
                dataType: 'json',
                data:{"ids":roleId},
                success:function(data){
                    //var zTree;
                    var setting = {
                        check : {
                            enable : true,
                        },
                        data : {
                            simpleData : {
                                enable : true,
                                idKey : "id",
                                pIdKey : "pId",
                                rootPId : ""
                            }
                        },
                        callback : {
                            onClick : checktrue
                        }
                    };
                    var zNodes =data;
                    $(document).ready(function(){
                        var t = $.fn.zTree.init($("#menusTree"), setting, zNodes);
                    });
                    $("#resources").modal();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    returnMessage(2,"返回数据错误！！");
                }
            });
        }else{
            returnMessage(0,"请选择一个角色！！");
        }
    });

});

//修改数据
function revise_role(obj){
    var id=$($(obj).parents("tr").children("td")[2]).text();
    var name=$($(obj).parents("tr").children("td")[3]).text();
    var status=$($(obj).parents("tr").children("td").children("a")).attr("class");
    status=status=="enabled"?1:0;
    $("#amend_title").text("修改角色");
    $("#amend_title").text("修改角色");
    $("#amend_id").text(id);
    $("#amend_name").val(name);
    $("#amend_status").val(status);
    $("#amend").modal();
}
function checktrue() {
    //查找所有  选中的checkbox
    //遍历这棵树
    var zTree = $.fn.zTree.getZTreeObj("menusTree");
    var $r = zTree.getCheckedNodes();
    var $urls ='';
    for (var i = 0; i < $r.length; i++) {
        $urls += ($urls == '') ? $r[i].seqid : ',' + $r[i].seqid;
    }
    //ajax保存
    $.ajax({
        type: "post",
        url: server_url + '/crm/sys/auth/RoleCtrl/SaveResoutce.json',
        data: {"roleid": role_id, "urls": $urls},
        dataType: 'json',
        success: function (data) {
           if(data.statusCode==200){
               returnMessage(1,"角色分配资源成功");
           }else{
               returnMessage(2,"角色分配资源失败");
           }
            $("#resources").modal("hide");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
           returnMessage(2,"返回数据错误！！");
        }
    });
}
//分配用户
function allot_role(_this){
    var input_checked=$("#tab tbody input[type='checkbox']").is(":checked");
    if(input_checked){
        $('.con-oper .btn-dialog').addClass('btn-dialog-tab');
        var roleId=$("#tab tbody input:checked").val();
        sessionStorage.setItem("role_id_user",roleId);
        //$(_this).attr("href","allot_user.html");
    }else{
        $('.con-oper .btn-dialog').removeClass('btn-dialog-tab');
        returnMessage(0,"请选择一个角色！！");
    }
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
                        data:{"count":-1,"page":1,"size":size,"login_no":null,"name":null},
                        success:function(data){
                                //分页
                            initPagination("#user_pagination",data.pageCount,data.pageCount,data.page,function(num){
                                    page=num;
                                    $.ajax({
                                        type: "get",
                                        url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
                                        data:{"count":-1,"page":num,"size":size,"login_no":null,"name":null},
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
                        data:{"count":-1,"page":1,"size":size,"login_no":null,"name":null},
                        success:function(data){
                            if(data.items.length!=0||data.items!=null){
                                //分页
                                if(data.pageCount){
                                    initPagination("#user_pagination",data.pageCount,data.pageCount,data.page,function(num){
                                        page=num;
                                        $.ajax({
                                            type: "get",
                                            url: server_url+'/crm/sys/auth/RoleCtrl/QueryUserList/'+role_id_user+".json",
                                            data:{"count":-1,"page":num,"size":size,"login_no":null,"name":null},
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
//分配组织
function allot_org(_this){
    var input_checked=$("#tab tbody input[type='checkbox']").is(":checked");
    if(input_checked){
        $('.con-oper .btn-dialog').addClass('btn-dialog-tab');
        var roleId=$("#tab tbody input:checked").val();
        sessionStorage.setItem("role_id_org",roleId);
        //$(_this).attr("href","allot_org.html");
    }else{
        $('.con-oper .btn-dialog').removeClass('btn-dialog-tab');
    returnMessage(0,"请选择一个角色！！");
    }
}
