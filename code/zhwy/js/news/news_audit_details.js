
function unPass(){
    parent.mylayer = parent.layer.open({
        type:1,
        resize:false,
        title:'<h4 class="text-center" style="line-height: 42px;">审核不通过原因</h4>',
        content:`
            <div class="news_unPass" style="">
                <textarea style="display: block;margin: 20px auto;padding: 12px 20px;width: 480px;height: 200px;" placeholder="请填写审核不通过原因" class="" cols="50" rows="6"></textarea>
            </div>
            <div style="text-align: center;">
                <button style="margin: 0 10px;" class="btn btn_green" type="button">确定</button>
                <button style="margin: 0 10px;" class="btn btn-default" type="button" onclick="closeLayer(mylayer);">取消</button>
            </div>
            `,
        area: ['560px', '390px']
    });
}