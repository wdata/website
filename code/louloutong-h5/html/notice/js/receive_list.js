/**
 * Created by Administrator on 2017/8/9.
 */
var itemIndex = 0;
var tapSwitchA = true;     //  是否有数据；
var tapSwitchB = true;     //  是否有数据；
var dropload = null;

var judgment = JSON.parse(sessionStorage.getItem("dataSession"));

$(".tap-unread .number").text("(" + judgment["DataUnread"] + ")");
$(".tap-have-read .number").text("(" + judgment["DataHaveRead"] + ")");

switch(judgment["judgment"]){
    case true:
        //  tap添加active样式
        $(".tap-unread").addClass("active")
            .siblings().removeClass("active");
        //  显示未读，隐藏已读
        $(".unread-list").removeClass("hide")
            .siblings(".receive-list").addClass('hide');
        itemIndex = 0;
        break;
    case false:
        $(".tap-have-read").addClass("active")
            .siblings().removeClass("active");
        $(".have-read-list").removeClass("hide")
            .siblings(".receive-list").addClass('hide');
        itemIndex = 1;
        break;
}



//  tap导航切换
$(".tap a").click(function(){
    $(this).addClass("active")
        .siblings().removeClass("active");
    itemIndex = $(this).index();
    //  判断是不是未读
    if(itemIndex === 0){

        $(".unread-list").removeClass("hide")
            .siblings(".have-read-list").addClass("hide");

        htmlAjax.judgment(tapSwitchA);

    }else if(itemIndex === 1){
        //  判断是不是已读
        $(".have-read-list").removeClass("hide")
            .siblings(".unread-list").addClass("hide");

        htmlAjax.judgment(tapSwitchB);

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
        dropload = $(".notice").dropload({
            scrollArea : window,
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
            url:  server_url_notice + server_v1 + '/notify/receiver/list.json',
            data: {
                "id":urlParams("id"),
                "status":status,
                "page":comment,
                "size":10
            },
            dataType:'json',
            success:function(data){
                var html = '';
                if(data.code === 0 && data.data){
                    $.each(data.data.items,function(index,val){
                        html += '' +
                            '<li> <a href="javascript:"> <img class="avatar" src="'+ val.images +'" alt="avatar"> </a> ' +
                            '<div class="ifat"> <p>'+ val.name +'</p> <p class="company">'+ val.firmName +'<span>'+ noTd(val.duty) +'</span></p> </div> </li>'
                    });

                    list.append(html);

                    if(status === 0){
                        commentA ++;
                    }else if(status === 1){
                        commentB ++;
                    }
                    me.noData();      //无数据
                    me.resetload();    //数据加载玩重置
                    if(data.data.pageCount === 0){
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