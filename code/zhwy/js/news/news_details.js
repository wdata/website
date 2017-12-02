var NewsDetails = function(){
    this.newsId = getSession('newsId');
    this.userId = getSession('userId');
    this.ajax = new Util();
};
NewsDetails.prototype.getNewsDetails = function(){
    var data = {};
    data.newsId = this.newsId;
    this.ajax.get('/web/api/v1/news/detail',data,function(res){
        if(res.code===0){
            var data = res.data;
            $('#title').html(data.title);
            $('#createTime').html(data.createTime);
            $('#content').html(data.content);
            $('#icon img').attr('src',data.icon);
            $('#icon').html('<h2>后台返回icon为null</h2>')
        }
    });
};
var newsDetails = new NewsDetails();
newsDetails.getNewsDetails();