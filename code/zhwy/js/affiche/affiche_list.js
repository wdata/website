
//查看接收对象列表
function showRecipient(){
    //$('#recipient').modal();
    parent.myLayer = parent.layer.open({
        type:1,
        resize:false,
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
                    <tr class="text-center">
                        <td>小道科技</td>
                        <td>东方科技大厦505</td>
                    </tr>
                    <tr class="text-center">
                        <td>小道科技</td>
                        <td>东方科技大厦505</td>
                    </tr>
                    <tr class="text-center">
                        <td>小道科技</td>
                        <td>东方科技大厦505</td>
                    </tr>

                    </tbody>
                </table>
            </div>
            `,
        area: ['800px', '500px']
    });
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
                    <div class="col-lg-6 dialog_false" onclick="removelayer(myLayer);">取消</div>
                </div>
            </div>
            `,
        area: ['340px', '200px']
    });
}
parent.removelayer = function(myLayer){
    parent.layer.close(myLayer);
};