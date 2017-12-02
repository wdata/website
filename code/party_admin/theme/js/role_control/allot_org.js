var size=10;
var role_id_org=sessionStorage.getItem("role_id_org");
$(document).ready(function(){
    $.ajax({
        type: "get",
        url: server_url+'/crm/sys/auth/RoleCtrl/QueryOrgList/'+role_id_org+".json",
        dataType: 'json',
        data:{"count":-1,"page":1,"size":size,"orgName":null},
        success:function(data){
            if(data.items.length!=0||data.items!=null){
                $("#internet_tab tbody").html("");
                //分页
                if(data.pageCount){
                    initPagination("#org_pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/sys/auth/RoleCtrl/QueryOrgList/'+role_id_org+".json",
                            data:{"count":-1,"page":num,"size":size,"orgName":null},
                            dataType: 'json',
                            success:function(data){
                                $("#internet_tab tbody").html("");
                                var html="";
                                $(data.items).each(function(index){
                                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].orgId+"'></td><th>"+(index+1)+"</th><th>"+$(this)[0].name+"</th><th>"+$(this)[0].parentName+"</th><th>"+$(this)[0].parentName+"</th></tr>";
                                });
                                $("#internet_tab tbody").append(html);
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
                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].orgId+"'></td><th>"+(index+1)+"</th><th>"+$(this)[0].name+"</th><th>"+$(this)[0].parentname+"</th><th>"+$(this)[0].parentname+"</th></tr>";
                });
                $("#internet_tab tbody").append(html);
                $(".content").hide();
                $("#formSearch").hide();
                $("#internet").removeClass("hide");
            }else{
                returnMessage(2,"该角色没有分配组织！！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"返回数据错误！！");
        }
    });
});
//组织名称查询
function org_user(){
    var orgName=$("#org_search input[name='orgName']").val();
    $.ajax({
        type: "get",
        url: server_url+'/crm/sys/auth/RoleCtrl/QueryOrgList/'+role_id_org+".json",
        dataType: 'json',
        data:{"count":-1,"page":1,"size":size,"orgName":orgName},
        success:function(data){
            if(data.items.length!=0||data.items!=null){
                $("#internet_tab tbody").html("");
                //分页
                if(data.pageCount){
                    initPagination("#org_pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/sys/auth/RoleCtrl/QueryOrgList/'+role_id_org+".json",
                            data:{"count":-1,"page":num,"size":size,"orgName":orgName},
                            dataType: 'json',
                            success:function(data){
                                $("#internet_tab tbody").html("");
                                var html="";
                                $(data.items).each(function(index){
                                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].orgId+"'></td><th>"+(index+1)+"</th><th>"+$(this)[0].name+"</th><th>"+$(this)[0].parentName+"</th><th>"+$(this)[0].parentName+"</th></tr>";
                                });
                                $("#internet_tab tbody").append(html);
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
                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].orgId+"'></td><th>"+(index+1)+"</th><th>"+$(this)[0].name+"</th><th>"+$(this)[0].parentname+"</th><th>"+$(this)[0].parentname+"</th></tr>";
                });
                $("#internet_tab tbody").append(html);
                $(".content").hide();
                $("#formSearch").hide();
                $("#internet").removeClass("hide");
            }else{
                returnMessage(2,"该角色没有分配组织！！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"返回数据错误！！");
        }
    });
}
//添加组织
function add_org(){
    $.ajax({
        type: "get",
        url: server_url+'/crm/sys/auth/RoleCtrl/addRole2Org.json',
        data:{"count":-1,"page":1,"size":size,"orgName":null,"roleid":role_id_org},
        dataType: 'json',
        success:function(data){
            if(data.items.length!=0||data.items!=null){
                $("#add_internet_tab tbody").html("");
                //分页
                if(data.pageCount){
                    initPagination("#un_org_pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/sys/auth/RoleCtrl/addRole2Org.json',
                            data:{"count":-1,"page":num,"size":size,"orgName":null,"roleid":role_id_org},
                            dataType: 'json',
                            success:function(data){
                                $("#add_internet_tab tbody").html("");
                                var html="";
                                $(data.items).each(function(index){
                                    html+="<tr><td><input type='checkbox'value='"+$(this)[0].orgId+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].parentName+"</td><td>"+$(this)[0].parentName+"</td></tr>";
                                });
                                $("#add_internet_tab tbody").append(html);
                                $("#add_internet").modal();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                returnMessage(2,"数据链接错误！！！！");
                            }
                        });
                    });
                    var html="";
                    $(data.items).each(function(index){
                        html+="<tr><td><input type='checkbox'value='"+$(this).orgId+"'></td><td>"+(index+1)+"</td><td>"+$(this).name+"</td><td>"+$(this).parentName+"</td><td>"+$(this).parentName+"</td></tr>";
                    });
                    $("#add_internet_tab tbody").append(html);
                    $("#add_internet").modal();
                }else{
                    returnMessage(2,"没有查到符合条件的数据！！！！");
                }
            }else{
                returnMessage(2,"该角色没有未分配的组织！！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"数据链接错误！！！！");
        }
    });
}
//添加组织界面的搜索
function org_search(){
    var orgName=$("#add_internet form input[name='orgName']").val();
    $.ajax({
        type: "get",
        url: server_url+'/crm/sys/auth/RoleCtrl/addRole2Org.json',
        data:{"count":-1,"page":1,"size":size,"orgName":orgName,"roleid":role_id_org},
        dataType: 'json',
        success:function(data){
            if(data.items.length!=0||data.items!=null){
                $("#add_internet_tab tbody").html("");
                //分页
                if(data.pageCount){
                    initPagination("#un_org_pagination",data.pageCount,data.pageCount,data.page,function(num){
                        page=num;
                        $.ajax({
                            type: "get",
                            url: server_url+'/crm/sys/auth/RoleCtrl/addRole2Org.json',
                            data:{"count":-1,"page":num,"size":size,"orgName":orgName,"roleid":role_id_org},
                            dataType: 'json',
                            success:function(data){
                                $("#add_internet_tab tbody").html("");
                                var html="";
                                $(data.items).each(function(index){
                                    html+="<tr><td><input type='checkbox'value='"+$(this)[0].orgId+"'></td><td>"+(index+1)+"</td><td>"+$(this)[0].name+"</td><td>"+$(this)[0].parentName+"</td><td>"+$(this)[0].parentName+"</td></tr>";
                                });
                                $("#add_internet_tab tbody").append(html);
                                $("#add_internet").modal();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                returnMessage(2,"数据链接错误！！！！");
                            }
                        });
                    });
                    var html="";
                    $(data.items).each(function(index){
                        html+="<tr><td><input type='checkbox'value='"+$(this).orgId+"'></td><td>"+(index+1)+"</td><td>"+$(this).name+"</td><td>"+$(this).parentName+"</td><td>"+$(this).parentName+"</td></tr>";
                    });
                    $("#add_internet_tab tbody").append(html);
                    $("#add_internet").modal();
                }else{
                    returnMessage(2,"没有查到符合条件的数据！！！！");
                }
            }else{
                returnMessage(2,"该角色没有未分配的组织！！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnMessage(2,"数据链接错误！！！！");
        }
    });
}
//添加组织到角色
function org_save(){
    var orgIds=[];
    var input_checked=$("#add_internet_tab tbody input[type='checkbox']").is(":checked");
    if(input_checked){
        var inputs = $("#add_internet_tab tbody input:checked");
        inputs.each(function(){
            var id=$($(this)[0]).val();
            orgIds.push(id);
        });
        $.ajax({
            type: "post",
            url: server_url+'/crm/sys/auth/RoleCtrl/addRoleOrg.json',
            dataType: 'json',
            data:{"orgId":orgIds.join(','),"roleid":role_id_org},
            success:function(data){
                if(data.statusCode==200){
                    returnMessage(1,data.message);
                    $("#add_internet").modal("hide");
                    $.ajax({
                        type: "get",
                        url: server_url+'/crm/sys/auth/RoleCtrl/QueryOrgList/'+role_id_org+".json",
                        dataType: 'json',
                        data:{"count":-1,"page":1,"size":size,"orgName":null},
                        success:function(data){
                            //分页
                            initPagination("#org_pagination",data.pageCount,data.pageCount,data.page,function(num){
                                page=num;
                                $.ajax({
                                    type: "get",
                                    url: server_url+'/crm/sys/auth/RoleCtrl/QueryOrgList/'+role_id_org+".json",
                                    data:{"count":-1,"page":num,"size":size,"orgName":null},
                                    dataType: 'json',
                                    success:function(data){
                                        $("#internet_tab tbody").html("");
                                        var html="";
                                        $(data.items).each(function(index){
                                            html+="<tr><td><input type='checkbox' value='"+$(this)[0].orgId+"'></td><th>"+(index+1)+"</th><th>"+$(this)[0].name+"</th><th>"+$(this)[0].parentName+"</th><th>"+$(this)[0].parentName+"</th></tr>";
                                        });
                                        $("#internet_tab tbody").append(html);
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        returnMessage(2,"数据链接错误！！！！");
                                    }
                                });
                            });
                            var html="";
                            $(data.items).each(function(index){
                                html+="<tr><td><input type='checkbox' value='"+$(this)[0].orgId+"'></td><th>"+(index+1)+"</th><th>"+$(this)[0].name+"</th><th>"+$(this)[0].parentName+"</th><th>"+$(this)[0].parentName+"</th></tr>";
                            });
                            $("#internet_tab tbody").append(html);
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
        returnMessage(1,"请选择要添加的组织！！");
    }
}
//移除角色中的组织
function remove_org(){
    var orgIds=[];
    var input_checked=$("#internet_tab tbody input[type='checkbox']").is(":checked");
    if(input_checked){
        var inputs = $("#internet_tab tbody input:checked");
        inputs.each(function(){
            var id=$($(this)[0]).val();
            orgIds.push(id);
        });
        $.ajax({
            type: "post",
            url: server_url+'/crm/sys/auth/RoleCtrl/rmRoleOrg.json',
            dataType: 'json',
            data:{"ids":orgIds.join(','),"roleid":role_id_org},
            success:function(data){
                if(data.statusCode==200){
                    returnMessage(1,data.message);
                    $.ajax({
                        type: "get",
                        url: server_url+'/crm/sys/auth/RoleCtrl/QueryOrgList/'+role_id_org+".json",
                        dataType: 'json',
                        data:{"count":-1,"page":1,"size":size,"orgName":null},
                        success:function(data){
                            if(data.items.length!=0||data.items!=null){
                                $("#internet_tab tbody").html("");
                                //分页
                                if(data.pageCount){
                                    initPagination("#org_pagination",data.pageCount,data.pageCount,data.page,function(num){
                                        page=num;
                                        $.ajax({
                                            type: "get",
                                            url: server_url+'/crm/sys/auth/RoleCtrl/QueryOrgList/'+role_id_org+".json",
                                            data:{"count":-1,"page":num,"size":size,"orgName":null},
                                            dataType: 'json',
                                            success:function(data){
                                                $("#internet_tab tbody").html("");
                                                var html="";
                                                $(data.items).each(function(index){
                                                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].orgId+"'></td><th>"+(index+1)+"</th><th>"+$(this)[0].name+"</th><th>"+$(this)[0].parentName+"</th><th>"+$(this)[0].parentName+"</th></tr>";
                                                });
                                                $("#internet_tab tbody").append(html);
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
                                    html+="<tr><td><input type='checkbox' value='"+$(this)[0].orgId+"'></td><th>"+(index+1)+"</th><th>"+$(this)[0].name+"</th><th>"+$(this)[0].parentname+"</th><th>"+$(this)[0].parentname+"</th></tr>";
                                });
                                $("#internet_tab tbody").append(html);
                                $(".content").hide();
                                $("#formSearch").hide();
                                $("#internet").removeClass("hide");
                            }else{
                                returnMessage(2,"该角色没有分配组织！！");
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
        returnMessage(1,"请选择要移除的组织！！");
    }
}
