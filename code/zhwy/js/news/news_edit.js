KindEditor.ready(function(K) {
    window.editor = K.create('#content',{});
});
var NewsEdit = function(){
    this.newsId = getSession('newsId');
    this.userId = getSession('userId');
    this.ajax = new Util();
};
NewsEdit.prototype.getArgument = function(){//获取新增新闻动态的请求参数
    var content = editor.html();
    var img = canvasToBlob($('.imgCanvas_con').find('canvas')[0]);
    //if(!img){parent.layer.msg('请选择图片！',{time: 2000});return false;}

    //创建 FormData 对象
    this.formData = new FormData();
    this.formData.append("newsId", this.newsId);
    this.formData.append("userId", this.userId);
    this.formData.append("propertyId", 4);
    this.formData.append("type", $('#type').val());
    if($('#type').val()==1){
        this.formData.append("firmId", $('#company').val());
    }
    this.formData.append("title", $('#title').val());
    this.formData.append("content", content);
    if(imgInput!==''){
        this.formData.append("file", img, "新闻封面.png");
    }
};
NewsEdit.prototype.getNewsDetails = function(){
    var data = {};
    data.newsId = this.newsId;
    this.ajax.get('/web/api/v1/news/detail',data,function(res){
        if(res.code===0){
            var data = res.data;
            $('#type').val(data.type);
            if(data.type==1){
                $('#org_list').removeClass('hidden');
                $('#company').val(data.firmId);
            }
            $('#title').val(data.title);
            window.editor.html(data.content);
            //drawImageInCanvas(data.icon);
            drawImageInCanvas('http://image1.chinanews.com.cn/cnsupload/big/2017/06-02/4-426/3f3ba8152cc4453f9147f87de046e476.jpg');
        }
    });
};
NewsEdit.prototype.getCompany = function(){//获取企业列表
    var obj = {};
    obj.userId = this.userId;
    obj.page = 1;
    obj.pageSize = 999;
    this.ajax.get('/web/api/v1/property/firm/firmList',obj,function(res){
        if(res.code===0){
            var option = '';
            $.each(res.data,function(i,item){
                option +=`
                        <option value="${item.firmId}">${val(item.firmName)}</option>
                    `;
            });
            $('#company').html(option);
            console.log($('#company').val())
        }
    })
};
NewsEdit.prototype.savaNews = function(){//保存新增新闻动态
    this.getArgument();
    this.ajax.post2('/web/api/v1/news/update',this.formData,function(res){
        console.log(res);
        if(res.code===0){
            if(res.message==='SUCCESS'){
                alertMsg('保存成功！');
                //var timer = window.setTimeout(function(){history.back();},3000);
            }
        }
    });
};
var newsEdit = new NewsEdit();
newsEdit.getCompany();
newsEdit.getNewsDetails();


function saveAdd(){//页面点击确定按钮时
    /*var img = canvasToBlob($('.imgCanvas_con').find('canvas')[0]);
    if(!img){parent.layer.msg('请选择图片！',{time: 2000});return false;}*/
    newsEdit.savaNews();
}