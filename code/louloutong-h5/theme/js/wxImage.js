/**
 * Created by Administrator on 2017/9/9.
 */
/*
*  微信上传图片接口，主要用在：报修模块；
* */


// 微信图片上传；
wxConfig(wx);

var wxImg = new Object({
    "fileData":[],          // 记录返回的图片名；
    "local_url":[],    // 记录上传给微信的数据；
    "imgBur":false,
    "limitData":null
});

wxImg.imgUpload = function(){
    var _this = this;
    var i = 0;
    wx.chooseImage({
        count: wxImg.limitData - _this.fileData.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            syncUpload(localIds);
        }
    });
    var syncUpload = function(localIds){
        var localId = localIds.pop();
        _this.local_url.push({'num':i,'url':localId});

        wx.uploadImage({
            localId: localId,
            isShowProgressTips: 1,
            success: function (res) {
                var serverId = res.serverId; // 返回图片的服务器端ID
                $.ajax({
                    type:'post',
                    url:'/weixin/downloadImage',
                    dataType:'json',
                    data:{
                        mediaIds:serverId
                    },
                    success:function(data){
                        i++;
                        // 显示图片 报修模块；
                        var shoot = $("#shoot");
                        if(shoot.length > 0){
                            var code = '<li><img src="'+ data.data.domain + data.data.urls[0] +'" alt=""><i data-name="'+ data.data.urls[0] +'" class="delete-icon"></i></li>';
                            shoot.parent().prepend(code);
                            // 因为图片顺序有问题，需要用插入数据；
                            _this.fileData.splice(0,0,{'num':i,'url':data.data.urls[0]});
                        }


                        // 出租和求组添加图片有所不同；
                        var listCon = $("#list-con");
                        if(listCon.length > 0){
                            var listHtml =  '<div class="img-list"> <img src="'+ data.data.domain + data.data.urls[0] +'" alt=""> <i data-name="'+ data.data.urls[0] +'" class="icon icon-del delete-icon"></i> </div>';
                            listCon.append(listHtml);
                            // 图片顺序没有问题，用正序，从末尾引入数据
                            _this.fileData.push({'num':i,'url':data.data.urls[0]});

                            $('.issue .photo .img-wrap img').attr("src",data.data.domain + _this.fileData[0].url);
                            // 修改顶部数量
                            $('#pic_num').text(_this.fileData.length);
                        }
                        // 公告添加图片有所不同
                        var box = $("#editor_box");
                        if(box.length > 0){
                          var bxHtml =  '<img src="'+ data.data.domain + data.data.urls[0] +'" onerror="defaultP(this)">';
                          box.append(bxHtml);
                            _this.fileData.push({'num':i,'url':data.data.urls[0]});
                        }

                    },
                    beforeSend:function(){
                        wxImg.imgBur = true;
                    },
                    complete:function(){
                        wxImg.imgBur = false;
                    },
                    error:function(data){
                        ErrorReminder(data);
                    }
                });
                if(localIds.length > 0){
                    syncUpload(localIds);
                }
            }
        });
    };
};
wxImg.limit = function(data){
    var _this = this;
    if(_this.fileData.length >= data){
        showMask('最多只能上传'+ data +'张！');
        return true;
    }
};
wxImg.init = function(){
    var _this = this;
    //  上传图片；
    $('.imgUploadWX').click(function(){
        if(wxImg.limit(4)){ return }
        wxImg.limitData = 4; // 微信图片限制数
        _this.imgUpload();  // 调用微信接口，选择图片，上传图片；
    });
    // 出租和求组中，各个事件
    $('.issue .photo').click(function(){
        if(_this.fileData.length>=1){
            $('.pic-wrap').show();
            $('.sBox-wrapper,.tap-footer').addClass('z0');
        }else{
            _this.imgUpload();
        }
    });

    // 上传限制
    $('.pic-wrap .pic-con .add-list').click(function(){
        if(wxImg.limit(8)){ return }
        wxImg.limitData = 8; // 微信图片限制数
        _this.imgUpload();
    });

    // 确定
    $('.pic-wrap .return').click(function(){
        $('.pic-wrap').hide();
        $('.sBox-wrapper,.tap-footer').removeClass('z0');
    });

    //  删除图片
    $(document).on("click",".delete-icon",function(){
        var self = this;
        var ind = $(this).parent().index();
        var name = $(this).attr("data-name");
        if(wxImg.imgBur){
            showMask("正在处理中！");
            return
        }
        //  删除图片；
        $.ajax({
            type:'post',
            url:  server_core + server_v1 + '/file/delete.json',
            data: {
                "name":name
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0 && data.message === "SUCCESS"){
                    $(self).parent().remove();
                    _this.fileData.splice(ind,1); //删除呗删除图片数据；

                    // 出租和求组发布中，修改顶部图片数量；
                    $('#pic_num').text(_this.fileData.length);
                }
            },
            beforeSend:function(){
                wxImg.imgBur = true;
            },
            complete:function(){
                wxImg.imgBur = false;
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    });
};
wxImg.init();