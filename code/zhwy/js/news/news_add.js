KindEditor.ready(function(K) {
    window.editor = K.create('#content',{});
});









var NewsAdd = function(){
    this.ajax = new Util();
    this.userId = getSession('userId');
};
NewsAdd.prototype.getArgument = function(){//获取新增新闻动态的请求参数
    var content = editor.html();
    var img = canvasToBlob($('.imgCanvas_con').find('canvas')[0]);
    if(!img){parent.layer.msg('请选择图片！',{time: 2000});return false;}

    //创建 FormData 对象
    this.formData = new FormData();
    this.formData.append("userId", this.userId);
    this.formData.append("propertyId", getSession('propertyId'));
    this.formData.append("type", $('#type').val());
    if($('#type').val()==1){
        this.formData.append("firmId", $('#company').val());
    }
    this.formData.append("title", $('#title').val());
    this.formData.append("content", content);
    this.formData.append("file", img, "新闻封面.png");
};
NewsAdd.prototype.savaNews = function(){//保存新增新闻动态
    this.getArgument();
    this.ajax.post2('/web/api/v1/news/save',this.formData,function(res){
        console.log(res);
        if(res.code===0){
            if(res.message==='SUCCESS'){
                alertMsg('保存成功！');
                //var timer = window.setTimeout(function(){history.back();},3000);
            }
        }
    });
};
NewsAdd.prototype.getCompany = function(){//获取企业列表
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


var newsAdd = new NewsAdd();
newsAdd.getCompany();

function saveAdd(){//页面点击确定按钮时
    var img = canvasToBlob($('.imgCanvas_con').find('canvas')[0]);
    if(!img){parent.layer.msg('请选择图片！',{time: 2000});return false;}
    newsAdd.savaNews();
}

function typeChange(val){
    if(val==1){
        $('#org_list').removeClass('hidden');
    }else {
        $('#org_list').addClass('hidden');
    }
}