/**
 * Created by Administrator on 2017/8/9.
 */
var itemIndex = 0;
var tapSwitchA = true;     //  是否有数据；
var tapSwitchB = true;     //  是否有数据；
var dropload = null;

var sum = obtain("tapNot");
if(sum){
    itemIndex = sum;
    $(".tap a").eq(sum).addClass("active")
        .siblings().removeClass("active");
    $(".notice-list").eq(sum).removeClass("hide")
        .siblings(".notice-list").addClass("hide");
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

        deposited("tapNot",0);  // 将键值对输入本地存储dataSession中；
    }else if(itemIndex === 1){
        //  判断是不是已读
        $(".have-read-list").removeClass("hide")
            .siblings(".unread-list").addClass("hide");

        htmlAjax.judgment(tapSwitchB);

        deposited("tapNot",1);  // 将键值对输入本地存储dataSession中；
    }
});
//  未读和已读跳转
$(document).on("click",".notice-list footer a",function(){
    deposited("DataUnread",parseInt($(this).parent().attr("data-unread")));
    deposited("DataHaveRead",parseInt($(this).parent().attr("data-haveRead")));
    if($(this).is(".unread")){
        deposited("judgment",true);
    }else if($(this).is(".have-read")){
        deposited("judgment",false);
    }
});

//获取列表 状态 0->未读 1->已读
// function getList(status,page,size){
//     $.ajax({
//         type:'get',
//         url:'/api/v1/notify/list.json',
//         dataType:'json',
//         data:{'userId':'','propertyId':'','status':status,'page':1,'size':10;},
//         success:function(data){
//
//         }
//     })
// }


//  是否有公告发布按钮；/llt/notice/list/button/add
if(authMethod("/llt/notice/list/button/add")){
    $("#release").removeClass("hide");
}
//  是否显示未接收和已接收：/llt/notify/list/readorunread
var read = authMethod("/llt/notice/list/button/add");



$(document).ready(function(){
    htmlAjax.main();
});

var commentA = 1;var commentB = 1;
var htmlAjax = new HtmlAjax();
function HtmlAjax(){
    this.main = function(){
        var _this = this;
        dropload = $(".notice").dropload({
            scrollArea : $(".notice"),
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
            url:  server_url_notice + server_v1 + '/notify/list.json',
            data: {
                "userId":userId,
                "propertyId":propertyId,
                "status":status,
                "page":comment,
                "size":10
            },
            dataType:'json',
            success:function(data){
                var html = '';
                if(data.code === 0 && data.data){
                    $.each(data.data.items,function(index,val){
                        var status = '';
                        //  0:普通通知；1：缴费通知
                        switch (val.type){
                            case 1:
                                break;
                            case 2:status = '<div class="types">缴费通知</div>';
                                break;
                        }
                        // 如果未读或已读人数为0，则字体变灰；
                        var acA = val.unreadCount <=0 ?"active":"";
                        var acB = val.readCount <=0 ?"active":"";
                        var footer = "";
                        if(read){
                            footer = '<footer data-unread="'+ val.unreadCount +'" data-haveRead="'+ val.readCount +'"><a href="receive_list.html?id='+ val.id +'" class="unread '+ acA +'"><span>'+ val.unreadCount +'</span>人未读</a> ' +
                                '<a href="receive_list.html?id='+ val.id +'" class="have-read'+ acB +'"><span>'+ val.readCount +'</span>人已读</a> </footer> ';
                        }
                        html += '' +
                            '<li> <a href="notice_details.html?id='+ val.id +'" class="">' +
                            ' <header> <div class="title">'+ val.title +'</div> ' +
                            '<time>'+ val.createTime +'</time> </header> <div class="release">' +
                            '<p>发布者：'+ val.author.name +'</p>' +
                            ''+ status +'</div> <i class="icon"></i> </a> '+ footer + '</li>'
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


























