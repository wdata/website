// 通知列表
var list = {
    "page":1,
    "size":10,
    "search":{},
    "propertyId":2,
    "userId":1982,
    "flag":false,
    "minPage":1,
    "maxPage":1,
    // 列表
    list:function(search){
        var _this = this;
        var data = {
            "page":_this.page,
            "size":_this.size,
            "userId":_this.userId,
            "propertyId":_this.propertyId,
        };
        Object.assign(data,search);  // 将搜索数据添加给data
        if(_this.flag)return false;
        _this.flag = true;
        $.ajax({
            type: "get",
            url: "/web/api/v1/notify/list.json",
            dataType: "json",
            data: data,
            success: function (data) {
                var html = '',pageCount,vpage;
                var list = $(".tbody").empty();
                if(data.code === 0){
                    $.each(data.data.items,function(index,val){
                        html += `<tr class="text-center">
                            <td data-id="${ val.id }" ><input type="checkbox"></td>
                            <td>${ index + 1 }</td>
                            <td>${ val.title }</td>
                            <td>${ val.type === 1?"普通通知":"缴费通知" }</td>
                            <td>${ val.createTime }</td>
                            <td>${ val.userName }</td>
                            <td>${ val.issueTime }</td>
                            <td>${ val.property }</td>
                            <td>${ val.status === 0?"未发布":"已发布" }</td>
                            <td><button class="btn btn-link btn-xs" onclick="showRecipient(this);">查看</button></td>
                            <td>
                                <button class="btn btn-link btn-xs" onclick="showReading(this,0);">已读 ${ val.readUserCount } 人 未读 ${ val.unreadUserCount } 人</button>
                            </td>
                            <td>
                                <button class="btn btn-link btn-xs" onclick="showReading(this,1);">已读 ${ val.readFirmCount } 企业 未读 ${ val.unreadFirmCount } 企业</button>
                            </td>
                            <td><button class="btn btn-link btn-xs" onclick="goPage('page/inform/inform_details.html');">详细</button></td>
                            <td>
                                <button type="button" class="btn btn-default btn-xs" onclick="list.remind(this)" >催阅</button>
                                <button type="button" class="btn btn-info btn-xs" onclick="goPage('page/inform/inform_edit.html');"><i class="fa fa-edit fa-fw"></i>修改</button>
                                <button type="button" class="btn btn_red btn-xs" onclick="list.oneRemove(this);"><i class="fa fa-trash-o fa-fw"></i>删除</button>
                            </td>
                        </tr>`;
                    });
                    list.append(html);
                }

                //分页动态修改配置：
                $('.page-go .page_num').html('共'+data.data.totalPages+'页');
                _this.maxPage = data.data.totalPages;
                if(data.data.totalCount>0){
                    pagination.jqPaginator('option',{totalPages: data.data.totalPages,currentPage:data.data.pageNum,onPageChange:function(n){
                        $('#page').val(n);
                        _this.page = n;
                        _this.list();
                    }});
                }
                _this.flag = false;
            },
            error: function (res) {
                console.log(JSON.stringify(res));
            }
        });
    },
    // 催阅；
    remind:function (_this){
        var id = $(_this).parent().siblings("td:first").attr("data-id");
        $.ajax({
            type: "get",
            url: "/web/api/v1/notify/urge.json",
            dataType: "json",
            data: {
                "notifyId":id,
                "userId":this.userId
            },
            success: function (data) {
                if(data.code === 0){
                    layer.msg('催阅成功！');
                }
            },
            error: function (res) {
                console.log(JSON.stringify(res));
            }
        });
    },
    // one删除
    oneRemove:function(_this){
        var id = [];
        id.push($(_this).parent().siblings("td:first").attr("data-id"));
         layer.confirm('确定要删除吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            list.removeData(id);

        }, function(){
            layer.close(); //
        });

    },
    // 删除
    removeData:function(id){
        $.ajax({
            type: "DELETE",
            url: "/web/api/v1/notify/deletedNotify.json",
            dataType: "json",
            traditional:true,
            data: {
                "notifyId":id,
                "userId":this.userId
            },
            success: function (data) {
                if(data.code === 0){
                    layer.msg('删除成功！');
                }
            },
            error: function (res) {
                console.log(JSON.stringify(res));
            }
        });
    }
};

list.list();





// 根据物业ID，获取所属物业名和所有上级名
function propertyName(id){
    console.log(id);
    $.ajax({
        type: "get",
        url: "/web/api/v1/property/queryPropertyParents.json",
        dataType: "json",
        data: {
            "propertyId":id
        },
        success: function (data) {
            console.log(data);
        },
        error: function (res) {
            console.log(JSON.stringify(res));
        }
    })
}




//查看接收对象列表
function showRecipient(_this){
    var id = $(_this).parent().siblings("td:first").attr("data-id");
    $.ajax({
        type: "get",
        url: "/web/api/v1/notify/getFirmInfo.json",
        dataType: "json",
        data: {
            "notifyId":id
        },
        success: function (data) {
            if(data.code === 0){
                var html = '';
                $.each(data.data,function(index,val){
                    html += `<tr class="text-center">
                                <td>${ val.firmName }</td>
                                <td>${ val.position }</td>
                             </tr>`
                });

                parent.myLayer = parent.layer.open({
                    type:1,
                    resize:false,
                    shadeClose : true,
                    title:'<h4 class="text-center" style="line-height: 42px;">接收对象</h4>',
                    content:`
                            <div class="table-responsive">
                                <table class="table table-striped table-condensed table-hover">
                                    <thead>
                                    <tr>
                                        <th class="text-center">企业名称</th>
                                        <th class="text-center">位置</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                     ${ html }
                                    </tbody>
                                </table>
                            </div>
                            `,
                    area: ['800px', '500px']
                });
            }
        },
        error: function (res) {
            console.log(JSON.stringify(res));
        }
    });


    //$('#recipient').modal();

}
//查看接收对象列表
function showReading(_this,notify){
    var id = $(_this).parent().siblings("td:first").attr("data-id");
    var url = '/web/api/v1/notify/userReadStatus.json';


    // web/api/v1/notify/userReadStatus  个人   0
    // web/api/v1/notify/firmReadStatus  公司   1
    if(notify === 1){
        url = '/web/api/v1/notify/firmReadStatus.json';
        htmlData = `<div class="row">
                <div class="col-md-6">
                    <div class="table-responsive">
                        <p>未读<span>${ dataA }</span>人</p>
                        <table class="table table-striped table-condensed table-hover">
                            <thead>
                            <tr>
                                <th class="text-center">姓名</th>
                                <th class="text-center">企业</th>
                                <th class="text-center">职位</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${ htmlA }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="table-responsive">
                        <p>已读<span>${ dataB }</span>人</p>
                        <table class="table table-striped table-condensed table-hover">
                            <thead>
                            <tr>
                                <th class="text-center">姓名</th>
                                <th class="text-center">企业</th>
                                <th class="text-center">职位</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${ htmlB }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`
    }

    var htmlA = '',dataA;
    var htmlB = '',dataB;

    $.ajax({
        type: "get",
        url: url,
        dataType: "json",
        async:false,
        data: {
            "notifyId":id,
            "status":0
        },
        success: function (data) {
            if(data.code === 0 && data.data){
                $.each(data.data,function(index,val){
                    if(notify === 1){
                        htmlA += `<tr class="text-center">
                                <td>${ val.name }</td>
                                <td>${ val.regisaddress }</td>
                            </tr>`;
                    }else{
                        htmlA += `<tr class="text-center">
                                <td>${ val.name }</td>
                                <td>${ val.orgName }</td>
                                <td>${ val.duty[0] }</td>
                            </tr>`;
                    }
                });
            }
            if(data.data){
                dataA = data.data.length;
            }else{
                dataA = 0;
            }
        },
        error: function (res) {
            console.log(JSON.stringify(res));
        }
    });

    $.ajax({
        type: "get",
        url: url,
        dataType: "json",
        async:false,
        data: {
            "notifyId":id,
            "status":1
        },
        success: function (data) {
            if(data.code === 0 && data.data){
                $.each(data.data,function(index,val){
                    if(notify === 1){
                        htmlB += `<tr class="text-center">
                                <td>${ val.name }</td>
                                <td>${ val.regisaddress }</td>
                            </tr>`;
                    }else{
                        htmlB += `<tr class="text-center">
                                <td>${ val.name }</td>
                                <td>${ val.orgName }</td>
                                <td>${ val.duty[0] }</td>
                            </tr>`;
                    }
                });

            }
            if(data.data){
                dataB = data.data.length;
            }else{
                dataB = 0;
            }
        },
        error: function (res) {
            console.log(JSON.stringify(res));
        }
    });

    var htmlData = `<div class="row">
                <div class="col-md-6">
                    <div class="table-responsive">
                        <p>未读<span>${ dataA }</span>人</p>
                        <table class="table table-striped table-condensed table-hover">
                            <thead>
                            <tr>
                                <th class="text-center">姓名</th>
                                <th class="text-center">企业</th>
                                <th class="text-center">职位</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${ htmlA }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="table-responsive">
                        <p>已读<span>${ dataB }</span>人</p>
                        <table class="table table-striped table-condensed table-hover">
                            <thead>
                            <tr>
                                <th class="text-center">姓名</th>
                                <th class="text-center">企业</th>
                                <th class="text-center">职位</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${ htmlB }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;

    var title = '<h4 class="text-center" style="line-height: 42px;">已读/未读详情</h4>';
    if(notify === 1){
        htmlData = `<div class="row">
                <div class="col-md-6">
                    <div class="table-responsive">
                        <p>未读<span>${ dataA }</span>企业</p>
                        <table class="table table-striped table-condensed table-hover">
                            <thead>
                            <tr>
                                <th class="text-center">企业名称</th>
                                <th class="text-center">位置</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${ htmlA }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="table-responsive">
                        <p>已读<span>${ dataB }</span>企业</p>
                        <table class="table table-striped table-condensed table-hover">
                            <thead>
                            <tr>
                                <th class="text-center">企业名称</th>
                                <th class="text-center">位置</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${ htmlB }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
        title = '<h4 class="text-center" style="line-height: 42px;">企业阅读状态</h4>';
    }

    parent.myLayer = parent.layer.open({
        type:1,
        resize:false,
        shadeClose : true,
        title:title,
        content:htmlData,
        area: ['800px', '500px']
    });

}


//页面跳转
function pageTo(sel){
    var val = sel.val();
    if(!val || (val==list.page))return false;
    val = val>list.maxPage?list.maxPage:(val<list.minPage)?(list.minPage):parseInt(val);
    sel.val(val);
    list.page = val;
    list.list();
}




//删除模态框：topWin 层级。
function removeDialog(n){
    parent.myLayer = parent.layer.open({
        type:1,
        resize:false,
        content:`
            <div class="dialog">
                <div class="dialog_body">
                    <p>确定要删除吗?</p>
                </div>
                <div class="dialog_footer clearfix">
                    <div class="col-lg-6 dialog_ok" onclick="">确定</div>
                    <div class="col-lg-6 dialog_false" onclick="closeLayer(parent.myLayer);">取消</div>
                </div>
            </div>
            `,
        area: ['340px', '200px']
    });
}
