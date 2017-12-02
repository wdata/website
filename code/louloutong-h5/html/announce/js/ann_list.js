/**
 * Created by Administrator on 2017/8/9.
 */
var itemIndex = 0;
var tapSwitchA = true;     //  是否有数据；
var tapSwitchB = true;     //  是否有数据；
var dropload = null;


//  是否有公告发布按钮；/llt/notice/list/button/add
if(authMethod("/llt/notice/list/button/add")){
    $("#release").removeClass("hide");
}

var sum = obtain("tapAnn");
if(sum){
    itemIndex = sum;
    $(".tap a").eq(sum).addClass("active")
        .siblings().removeClass("active");
    $(".anounce-list").eq(sum).removeClass("hide")
        .siblings(".anounce-list").addClass("hide");
}



$(".tap a").click(function(){
    $(this).addClass("active")
        .siblings().removeClass("active");
    itemIndex = $(this).index();
    //  判断是不是未读
    if(itemIndex === 0){

        $(".unread-list").removeClass("hide")
            .siblings(".have-read-list").addClass("hide");

        deposited("tapAnn",0);  // 将键值对输入本地存储dataSession中；

        htmlAjax.judgment(tapSwitchA);

    }else if(itemIndex === 1){
        //  判断是不是已读
        $(".have-read-list").removeClass("hide")
            .siblings(".unread-list").addClass("hide");

        htmlAjax.judgment(tapSwitchB);

        deposited("tapAnn",1);  // 将键值对输入本地存储dataSession中；

    }
});

$(document).ready(function(){
    htmlAjax.main();
});

var commentA = 1;var commentB = 1;
var htmlAjax = new HtmlAjax();
function HtmlAjax(){
    this.main = function(){
        var _this = this;
        dropload = $(".anounce").dropload({
            scrollArea : $(".anounce"),
            autoLoad:true,
            loadDownFn : function(me){
                //  获取报修列表
                if(itemIndex === 0){
                    _this.listAjax(me,commentA,itemIndex,tapSwitchA,$(".unread-list"));
                }else if(itemIndex === 1){
                    _this.listAjax(me,commentB,itemIndex,tapSwitchB,$(".have-read-list"));
                }
            }
        });
    };
    this.listAjax = function(me,comment,status,tapSwitch,list){
        $.ajax({
            type:'get',
            url:  server_url_notice + server_v1 + '/notice/list.json',
            data: {
                "userId":userId,
                "propertyId":propertyId,
                "status":status,
                "page":comment,
                "size":5
            },
            dataType:'json',
            success:function(data){
                var html = '';
                if(data.code === 0 && data.data){
                    $.each(data.data.items,function(index,val){
                        //  有封面和没有封面代码不同；
                        console.log();
                        if(val.image){
                            html += '<li> <a href="ann_details.html?id='+ val.id +'"> <time>'+ val.createTime +'</time> <header>'+ val.title +'</header> <article>'+ val.content +'</article> <img src="'+ val.image[0] +'" onerror="defaultP(this)"> <div class="details">查看全文</div> </a> </li>'
                        }else{
                            html += '<li> <a href="ann_details.html?id='+ val.id +'" class="no-price"> <time>'+ val.createTime +'</time> <header>'+ val.title +'</header> <article>'+ val.content +'</article> <div class="details">查看全文</div> </a> </li>';
                        }
                    });
                    list.append(html);

                    if(status === 0){
                        commentA ++;
                    }else if(status === 1){
                        commentB ++;
                    }
                    if(data.data.pageNum*data.data.pageSize >= data.data.totalCount){
                        me.lock();  //智能锁定，锁定上一次加载的方向
                        me.noData();      //无数据
                        if(status === 0){
                            tapSwitchA = false;
                        }else if(status === 1){
                            tapSwitchB = false;
                        }
                    }
                }else{
                    me.lock();  //智能锁定，锁定上一次加载的方向
                    me.noData();      //无数据
                    if(status === 0){
                        tapSwitchA = false;
                    }else if(status === 1){
                        tapSwitchB = false;
                    }
                }
                me.resetload();    //数据加载玩重置
            },
            error:function(data){
                ErrorReminder(data);
                me.noData();      //无数据
                me.resetload();    //数据加载玩重置
            }
        })
    };
    this.judgment = function(data){
        if(data){
            // 解锁
            dropload.unlock();
            dropload.noData(false);
        }else{
            // 锁定
            dropload.lock('down');
            dropload.noData();
        }
        dropload.resetload();    //数据加载玩重置
    }
}