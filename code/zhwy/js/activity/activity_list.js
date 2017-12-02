//报名统计
function show_activity_statistics_list(){
    parent.mylayer = parent.layer.open({
        type: 2,
        title:'<h4 class="text-center" style="line-height: 42px">报名统计</h4>',
        shade: false,
        area: ['956px', '444px'],
        maxmin: true,
        content: 'page/activity/activity_statistics_list.html',
        zIndex: parent.layer.zIndex, //重点1
        success: function(layero){
            parent.layer.setTop(layero); //重点2
        }
    });
}

//活动取消原因
function cancel(){
    parent.mylayer = parent.layer.open({
        type:1,
        resize:false,
        title:'<h4 class="text-center" style="line-height: 42px;">活动撤销原因</h4>',
        content:`
            <div class="news_unPass" style="">
                <textarea style="display: block;margin: 20px auto;padding: 12px 20px;width: 480px;height: 200px;" placeholder="请填写活动撤销原因" class="" cols="50" rows="6"></textarea>
            </div>
            <div style="text-align: center;margin: 26px auto;">
                <button style="margin: 0 10px;" class="btn btn_green" type="button">确定</button>
                <button style="margin: 0 10px;" class="btn btn-default" type="button" onclick="closeLayer(mylayer);">取消</button>
            </div>
            `,
        area: ['560px', '350px']
    });
}