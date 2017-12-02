function showReportDetails(){
    parent.mylayer = parent.layer.open({
        type:1,
        resize:false,
        title:'<h4 class="text-center" style="line-height: 42px;">新闻动态举报详情</h4>',
        content:`
            <div class="row clearfix" style="font-size: 16px;padding: 0 30px;">
            <p style="background-color: #fafafa;line-height: 50px;margin: 0;" class="pull-left">举报人:<span>张三</span></p>
            <p style="background-color: #fafafa;line-height: 50px;margin: 0;" class="pull-right">举报类型:<span>其他原因</span></p>
            </div>
            <div class="row" style="font-size: 16px;color: #4d5d6e;padding: 0 30px;">
                <div>举报原因描述: <span>发布违法信息</span></div>
                <div>
                    <img style="width: 50px;height: 50px;" src="" alt="">
                </div>
            </div>
            `,
        area: ['560px', '390px']
    });
}

function showReport(){
    parent.mylayer = parent.layer.open({
        type:1,
        resize:false,
        title:'<h4 class="text-center" style="line-height: 42px;">新闻动态查封原因</h4>',
        content:`
            <div class="news_unPass" style="">
                <textarea style="display: block;margin: 20px auto;padding: 12px 20px;width: 480px;height: 200px;" placeholder="请填写查封原因" class="" cols="50" rows="6"></textarea>
            </div>
            <div style="text-align: center;margin: 26px auto;">
                <button style="margin: 0 10px;" class="btn btn_green" type="button">确定</button>
                <button style="margin: 0 10px;" class="btn btn-default" type="button" onclick="closeLayer(mylayer);">取消</button>
            </div>
            `,
        area: ['560px', '350px']
    });
}