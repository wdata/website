
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
                    <div class="col-lg-6 dialog_false" onclick="closeLayer(myLayer);">取消</div>
                </div>
            </div>
            `,
        area: ['340px', '200px']
    });
}



var News = function(){
    this.ajax = new Util();
    this.userId = getSession('userId');
};
News.prototype.getArgument = function(){
    var data = {};
    data.userId = this.userId;
    return data;
};
News.prototype.getNewsList = function(){
    var obj = this.getArgument();
    this.ajax.get('/web/api/v1/news/list',obj,function(res){
        if(res.code===0){
            console.log(res.data);
            if(res.message === 'SUCCESS'){
                var data = res.data;
                var html = '';
                $.each(data.items,function(i,item){
                    var doSomething = '';
                    if(item.status===1){
                        doSomething = `
                        <button type="button" class="btn btn-info btn-xs" onclick="news.goEdit(${item.id});"><i class="fa fa-edit fa-fw"></i>修改</button>
                        <button type="button" class="btn btn_red btn-xs" onclick="removeDialog();"><i class="fa fa-trash-o fa-fw"></i>删除</button>
                    `;
                    }
                    html += `
                        <tr class="text-center" data-newsId="${item.id}">
                            <td><input type="checkbox"></td>
                            <td>${i+1}</td>
                            <td>${val(item.title)}</td>
                            <td>${val(item.type==1?'企业动态':'园区动态')}</td>
                            <td>${val(item.createTime)}</td>
                            <td>${val(item.property)}</td>
                            <td>${val(item.firmName)}</td>
                            <td><button class="btn btn-link btn-xs" onclick="news.goDetails(${item.id})">查看</button></td>
                            <td>${doSomething}</td>
                        </tr>
                    `;
                });
                $('#list tbody').html(html);
            }

        }
    });
};
News.prototype.goDetails = function(newsId){//查看新闻动态详情
    setSession('newsId',newsId);
    goPage('page/news/news_details.html');
};
News.prototype.goEdit = function(newsId){//修改新闻动态
    setSession('newsId',newsId);
    goPage('page/news/news_edit.html');
};

var news = new News();
news.getNewsList();
