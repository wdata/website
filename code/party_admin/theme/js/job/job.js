var hyf_add_or_update = '',hyf_data_jobId = '',hyf_jobId = '',hyf_page = 1,hyf_page1 = 1,hyf_size = 10,hyf_check=false,hyf_jobName='';
//   添加状态               修改状态            职位ID         当前页码   当前非本职位用户页码   每页显示条数   职位是否选中  职位名称

//判断所选组织非空
function judgeNull(element, message) {
    if (element == undefined || element == "") {
        BootstrapDialog.show({
            'title': "返回信息",
            'message': message,
            'buttons': [
                {
                    label: '确定',
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        dialog.close();
                    }
                }
            ]
        });
        return false;
    } else {
        return true
    }
}

$('#jobuser-table').xb_scroll();

//初始化树形结构
function initZtree(){
    var zNodes;//zTree 的数据属性
    var setting = {//zTree 的参数配置
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        data: {
            simpleData: {
                enable:true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: ""
            }
        },
        callback: {
            onClick: zTreeClick
        }
    };

    $.ajax({
        type:"get",
        url:"/crm/sys/auth/BranchCtrl/ReloadTree.json",
        async:false,
        dataType:'json',
        success:function(data){
            zNodes=data;
        }
    });
    $.fn.zTree.init($("#menusTree"), setting, zNodes);
}
initZtree();

//展示组织具体详细信息
function zTreeClick(){
    $('.job-info').addClass('undis');
    hyf_page = 1;
    hyf_page1 = 1;
    var zTree = $.fn.zTree.getZTreeObj("menusTree");
    var nodes = zTree.getSelectedNodes()[0];
    if(judgeNull(nodes,'请选择一个组织')) {
        initJobData();
    }
}

//初始化职位面板
function initJobData(){
    $('#jobTable tbody').html('');
    var zTree = $.fn.zTree.getZTreeObj("menusTree");
    var nodes = zTree.getSelectedNodes()[0];
    var nodeid = nodes.id;
    var html = '';
    $.ajax({
        type: "get",
        url: "/crm/sys/auth/PositionCtrl/QueryPositionList.json",
        dataType: 'json',
        data: {'organId': nodeid,'size':999,'page':1},
        success: function (data) {
            if(data.items.length<1){
                $('#jobTable tfoot').removeClass('undis');
            }else{
                $('#jobTable tfoot').addClass('undis');
                $.each(data.items,function(index,item){
                    html +=`
                    <tr class="tc">
                        <td><input type="checkbox" value="${item[0].id}" data-job-name="${item[0].name}" onclick="jobClick(${item[0].id},this)"></td>
                        <td>${index+1}</td>
                        <td>${item[0].name==null?'':item[0].name}</td>
                        <td>${item[0].status===1?'可用':'停用'}</td>
                        <td><input type="button" value="修改" data-job-id="${item[0].id}" data-job-name="${item[0].name}" class='btn btn-primary' onclick="add_Job(this)" /></td>
                    </tr>
                `;
                });
                $('#jobTable tbody').html(html)
            }

        }
    });
}

//判断是添加或修改
function add_Job(_this){
    if(_this.value=='添加职位'){
        hyf_add_or_update = '添加';
        $('#jobName').val('');
    }else if(_this.value=='修改'){
        hyf_add_or_update = '修改';
        hyf_data_jobId = $(_this).data('job-id');
        $('#jobName').val($(_this).data('job-name'));
    }
    $('#addJob').modal('show');
}

function addOrUpdate(){
    if(hyf_add_or_update==='添加'){
        saveAddJob();
    }else if(hyf_add_or_update==='修改'){
        updateJob();
    }
}

//新增职位
function saveAddJob(){
    var zTree = $.fn.zTree.getZTreeObj("menusTree");
    var nodes = zTree.getSelectedNodes()[0];
    var nodesid = nodes.id;
    var jobName = $('#jobName').val();
    var sta  = $('input[name="sta"]:checked').val();
    //console.log(nodesid,jobName,sta);
    $.ajax({
        type:"post",
        url:"/crm/sys/auth/PositionCtrl/addPosition.json",
        data:{
            'organId':nodesid,
            'name':jobName,
            'status':sta
        },
        dataType:'json',
        success:function(data){
            console.log(data);
            $('#addJob').modal('hide');
            BootstrapDialog.show({
                'type':'type-success',
                'title':'返回信息',
                'message':data.message,
                'buttons':[{
                    label: '确定',
                    cssClass: 'btn-success',
                    action: function(dialog){
                        dialog.close();
                    }
                }]
            });
            initJobData();
        }
    });
}

//修改职位
function updateJob(){
    var zTree = $.fn.zTree.getZTreeObj("menusTree");
    var nodes = zTree.getSelectedNodes()[0];
    var nodesid = nodes.id;
    var jobName = $('#jobName').val();
    var sta  = $('input[name="sta"]:checked').val();
    $.ajax({
        type:"post",
        url:"/crm/sys/auth/PositionCtrl/updatePosition.json",
        data:{
            'positionId':hyf_data_jobId,
            'name':jobName,
            'status':sta
        },
        dataType:'json',
        success:function(data){
            //console.log(data);
            $('#addJob').modal('hide');
            BootstrapDialog.show({
                'type':'type-success',
                'title':'返回信息',
                'message':data.message,
                'buttons':[{
                    label: '确定',
                    cssClass: 'btn-success',
                    action: function(dialog){
                        dialog.close();
                    }
                }]
            });
            initJobData();
            $('.job-info').addClass('undis');
            $('.pagination_con').addClass('undis');
            $('.userCount').addClass('undis');
        }
    });
}

//确认是否删除职位
function deleteJob(){
        var jobs = [];
        var check = $('#mainPanel tbody').find('[type="checkbox"]');
        $.each(check,function(index,item){
            if($(item).is(':checked')){
                jobs.push($(item).val());
            }
        });
        if(jobs.length>0) {
            BootstrapDialog.show({
                'type': 'type-warning',
                'title': '返回信息',
                'message': '确定要删除所选职位吗？',
                'buttons': [{
                    label: '确定',
                    cssClass: 'btn-warning',
                    action: function (dialog) {
                        dialog.close();
                        isDeleteJob(jobs);
                    }
                }]
            });
        }
    //}
}

//删除选中的职位
function isDeleteJob(jobs){
    var zTree = $.fn.zTree.getZTreeObj("menusTree");
    var nodes = zTree.getSelectedNodes()[0];
    var branchid =nodes.id;

    $.ajax({
        type:"post",
        url:"/crm/sys/auth/PositionCtrl/removePosition.json",
        dataType:"json",
        data:{
            "organId":branchid,
            "ids":jobs.join(',')
        },
        success:function(data){
            $('#userDataPanel thead [type="checkbox"]').prop('checked',false);
            BootstrapDialog.show({
                'type':'type-success',
                'title':'返回信息',
                'message':data.message,
                'buttons':[{
                    label: '确定',
                    cssClass: 'btn-success',
                    action: function(dialog){
                        dialog.close();
                    }
                }]
            });
            initJobData();
        }
    })
}

//职位被点击
function jobClick(jobId,_this){
    if(_this){hyf_check = $(_this).is(':checked');}
    hyf_page = 1;
    hyf_jobName = $(_this).data('job-name');
    initJobUsers(jobId);
}

//查询职位下已添加的用户
function initJobUsers(jobId){
    $('#principal thead [type="checkbox"]').prop('checked',false);
    $('#addJobUserList thead [type="checkbox"]').prop('checked',false);
    if(hyf_check){
        $('.job-info').removeClass('undis');
        $('.job_belongs').text(hyf_jobName);
        hyf_jobId = jobId;
        hyf_page1 = 1;
        var zTree = $.fn.zTree.getZTreeObj("menusTree");
        var nodes = zTree.getSelectedNodes()[0];
        var branchid =nodes.id;
        $('#principal tbody').html('');
        var html='';
        $.ajax({
            type: "get",
            url: "/crm/sys/auth/PositionCtrl/QueryUserList.json",
            dataType: 'json',
            data: {'organId': hyf_jobId,'page':hyf_page,'size':hyf_size},
            success: function (data) {
                if(data.items.length<1){
                    $('#principal .notData').removeClass('undis');
                    $('.userCount').addClass('undis');
                    $('.pagination_con').addClass('undis');
                    $('.userCountBegin').html('0');
                    $('.userCountFinish').html('0');
                    $('.userCountTotal').html('0');
                }else {
                    $('#principal .notData').addClass('undis');
                    $.each(data.items, function (index, item) {
                        html += `
                        <tr class="tc">
                            <td><input type="checkbox" value="${item.id}"></td>
                            <td>${index + 1}</td>
                            <td>${item.name == null ? '' : item.name}</td>
                            <td>${item.phone == null ? '-' : item.phone}</td>
                            <td>${item.status === 1 ? '可用' : '停用'}</td>
                            <td><button type="button" class="btn btn-primary" onclick="editUser(${item.id})">修改</button></td>
                        </tr>
                    `;
                    });
                    $('#principal tbody').html(html);
                    if(data.pageCount>0){
                        $('.userCount').removeClass('undis');
                        $('.pagination_con').removeClass('undis');

                        initPagination("#jobDataPanelCount",data.pageCount,7,hyf_page,function(num,type){
                            //			分页的ID容器 ，总页数 ， 最多显示几个分页 ，当前页 ，回调
                            if(type==='change'){
                                hyf_page = num;
                                initJobUsers(hyf_jobId);
                            }
                        });
                        console.log(data.pageCount)
                        console.log(hyf_page)
                        $('.userCountBegin').html((data.page-1)*10+1);//从第几条记录开始
                        $('.userCountFinish').html((data.page-1)*10+data.items.length);//到第几条记录结束
                        $('.userCountTotal').html(data.count);//总记录数
                        //console.log(data.pageCount);
                    }
                }
            }
        });
    }
}

//查询职位下未添加的用户
function notJobUsers(){
    $('#addJobUserList tbody').html('');
    var html='';
    $.ajax({
        type: "get",
        url: "/crm/sys/auth/PositionCtrl/QueryAddUserList.json",
        dataType: 'json',
        data: {'organId': hyf_jobId,'size':hyf_size,'page':hyf_page1},
        success: function (data) {
            //console.log(data.items);
            if(data.items.length<1){
                $('#addJobUserList .notData').removeClass('undis');
                $('.userCount1').addClass('undis');
                $('.pagination_box').addClass('undis');
                $('#addJobUser .modal-footer').addClass('undis');
                $('.NotUserCountBegin').html('0');
                $('.NotUserCountFinish').html('0');
                $('.NotUserCountTotal').html('0');
            }else {
                $('#addJobUserList .notData').addClass('undis');
                $('#addJobUser .modal-footer').removeClass('undis');
                $.each(data.items, function (index, item) {
                    html += `
                        <tr class="tc">
                            <td><input type="checkbox" value="${item.id}"></td>
                            <td>${index + 1}</td>
                            <td>${item.name == null ? '' : item.name}</td>
                            <td>${item.phone == null ? '-' : item.phone}</td>
                            <td>${item.status === 1 ? '可用' : '停用'}</td>
                        </tr>
                    `;
                });
                $('#addJobUserList tbody').html(html);
                if(data.pageCount>0){
                    $('.userCount1').removeClass('undis');
                    $('.pagination_box').removeClass('undis');
                    initPagination("#jobNotDataPanelCount",data.pageCount,7,hyf_page1,function(num,type){
                        //			分页的ID容器 ，总页数 ， 最多显示几个分页 ，当前页 ，回调
                        if(type==='change'){
                            hyf_page1 = num;
                            $('#addJobUserList thead [type="checkbox"]').prop('checked',false);
                            notJobUsers();
                        }
                    });
                    $('.NotUserCountBegin').html((data.page-1)*10+1);//从第几条记录开始
                    $('.NotUserCountFinish').html((data.page-1)*10+data.items.length);//到第几条记录结束
                    $('.NotUserCountTotal').html(data.count);//总记录数
                }else {

                }
            }
        }
    });
}

//保存添加用户
function saveAddUser(){
    var users = [];
    var check = $('#addJobUserList tbody').find('[type="checkbox"]');
    $.each(check,function(index,item){
        if($(item).is(':checked')){
            users.push($(item).val());
        }
    });
    $.ajax({
        type:"post",
        url:"/crm/sys/auth/PositionCtrl/Save.json",
        dataType:"json",
        data:{
            "positionId":hyf_jobId,
            "userIds":users.join(',')
        },
        success:function(data){
            $('#addJobUserList thead [type="checkbox"]').prop('checked',false);
            BootstrapDialog.show({
                'type':'type-success',
                'title':'返回信息',
                'message':data.message,
                'buttons':[{
                    label: '确定',
                    cssClass: 'btn-success',
                    action: function(dialog){
                        dialog.close();
                    }
                }]
            });
            notJobUsers();
            initJobUsers(hyf_jobId);
            $('#addJobUser').modal('hide');
        }
    })

}

//确认是否删除职位下的用户
function deleteJobUser(){
    var users = [];
    var check = $('#principal tbody').find('[type="checkbox"]');
    $.each(check,function(index,item){
        if($(item).is(':checked')){
            users.push($(item).val());
        }
    });
    if(users.length>0) {
        BootstrapDialog.show({
            'type': 'type-warning',
            'title': '返回信息',
            'message': '确定要删除所选用户吗？',
            'buttons': [{
                label: '确定',
                cssClass: 'btn-warning',
                action: function (dialog) {
                    dialog.close();
                    isDeleteJobUser(users);
                }
            }]
        });
    }
}

//删除职位下的用户
function isDeleteJobUser(users){
    console.log(hyf_page)
    console.log(hyf_page1)
    $.ajax({
        type:"post",
        url:"/crm/sys/auth/PositionCtrl/removeUserFromPosition.json",
        dataType:"json",
        data:{
            "positionId":hyf_jobId,
            "userIds":users.join(',')
        },
        success:function(data){
            $('#principal thead [type="checkbox"]').prop('checked',false);
            BootstrapDialog.show({
                'type':'type-success',
                'title':'返回信息',
                'message':data.message,
                'buttons':[{
                    label: '确定',
                    cssClass: 'btn-success',
                    action: function(dialog){
                        dialog.close();
                    }
                }]
            });
            hyf_page = 1;
            initJobUsers(hyf_jobId);
        }
    })
}

//修改职位下的用户信息
function editUser(userId){

}

