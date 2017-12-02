/**
 * Created by Administrator on 2017/8/10.
 */

//  头部广告轮播
var advertising = new Swiper('.advertising', {
    autoplay: 1000,//可选选项，自动滑动
    loop:true,
    autoplayDisableOnInteraction:false
});
//  通知轮播
var noticeWord = new Swiper('.notice-word', {
    autoplay: 1000,//可选选项，自动滑动
    loop:true,
    direction:'vertical',
    autoplayDisableOnInteraction:false
});


function dongSwitch(){
    this.louDong = null;       //   保存数据；
    this.addressList = $("#addressList");   //  楼栋列表父级元素
}

dongSwitch.prototype = {
    constructor:dongSwitch,
    main:function(){
        this.animation();    //  确定功能；和动画切换效果；（这个是可以随意编辑的，）
        this.dongAjax();     //  ajax事件获取数据，并将数据保存；（这个是获取数据）
        this.dongSelect();   //  选择下一级
        this.superior();     //  顶部导航重新选择同级楼栋；
    },
    animation:function(){
        var _this = this;
        // 平移动画效果
        $('#address').tap(function(){
            $(".index").addClass("active");
            $(".switch").addClass("active");
        });
        $(".switch .header-return,#determine").tap(function(){
            $(".index").removeClass("active");
            $(".switch").removeClass("active");

            //  判断是确定还是返回；
            var selected = $("#addressList li.active");
            if($(this).is("#determine")){
                var text = null;
                $.each(_this.louDong,function(index,val){
                    if(selected.attr("data-id") === val.id + ""){
                        text = val.name;
                    }
                });
                //  将物业ID存入本地存储；（非首页可删除）；
                dataSession["propertyId"] = selected.attr("data-id");
                dataSession["propertyName"] = text;
                sessionStorage.setItem("dataSession",JSON.stringify(dataSession));

                //  修改首页顶部物业名
                $("#address").text(text);
                var indexAjax = new IndexAjax(selected.attr("data-id"));
                indexAjax.main();
            }
        });
    },
    dongAjax:function(){
        var _this = this;
        $.ajax({
            type:'get',
            url:  server_LouDong + server_v1 + '/property/manager/'+ userId +'.json',
            data: null,
            dataType:'json',
            success:function(data){
                var html = '';
                _this.addressList.empty();
                if(data.code === 0){
                    _this.louDong = data.data;
                    var one = null;var sum = 1;
                    $.each(data.data,function(index,val){
                        //  如果parentId === null 则表示没有上一级，ajax只显示一级列表；
                        if(val.parentId === null){
                            html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
                            if(sum === 1){
                                one = val;
                            }
                            sum++;
                        }
                    });
                    _this.addressList.append(html);
                    if(one){
                        deposited("propertyId",one.id);
                        deposited("propertyName",one.name);
                    }else{
                        showMask("没有物业");
                        return;
                    }
                    _this.Default(one);    // 显示本地存储内楼栋名；

                    //  这边部分是首页数据；可以删除
                    var propertyIdD = propertyId?propertyId:one.id;
                    //  首页数据；
                    var indexAjaxb = new IndexAjax(propertyIdD);
                    indexAjaxb.main();

                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    },
    dongSelect:function(){

        //  点击下一级；

        var _this = this;
        $(document).bind('tap','#addressList li',function(){
            var self = this;
            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");

            var id = $(this).attr("data-id");


            var bur = _this.judgment(id);  // 判断有没有下一级；
            if(bur){
                //  判断是不是点击的全部；
                if(!$(this).is(".all")){

                    // console.log("有下一级");
                    //  隐藏确定；
                    $("#determine").addClass("hide");


                    if($("#prompt").is(".active")){

                        _this.topApend($(this).attr("data-id"),$(this).attr("data-pid"),$(this).text());
                        //  位移到滚动条最后面；
                        $(".nav").scrollLeft( $('.nav')[0].scrollWidth );
                    }else{
                        $("#prompt").addClass("active")
                            .siblings().removeClass("active");

                        //  判断是不是点击了之前的元素;
                        $.each($("#prompt").siblings(),function(index,val){
                            if($(val).attr("data-pid") === $(self).attr("data-pid")){
                                $(val).attr({
                                    "data-id":$(self).attr("data-id"),
                                    "data-pid":$(self).attr("data-pid")
                                });
                                $(val).text($(self).text());
                            }
                        });
                    }

                    _this.nextLevel(id);
                }else{
                    // console.log("可以选择确定");
                    $("#determine").removeClass("hide");
                }

            }else{
                // console.log("没有下一级");
                $("#determine").removeClass("hide");
            }
        });
    },
    Default:function(data){
        var _this = this;
        //  判断sessionStorage存储的ID和name是否为空;
        if(propertyId && propertyName){
            //  如果有数据，则楼栋显示为
            $("#address").text(propertyName);

            $.each(_this.louDong,function(index,val){
                if(parseInt(propertyId) === val.id){
                    _this.SameLevel(propertyId,val.parentId + "");
                    //  如果父级ID为不为空，则添加父级ID到顶部导航；
                    _this.repeatAdd(val.parentId);  // 重复添加父级，一直到父级ID为null
                }
            })



        }else{
            //  如果没有，则选择第一级第一个数据作为物业名和物业ID；
            $("#address").text(data.name);
        }
    },
    superior:function(){
        //  选择同级；
        var _this = this;
        $(document).on("tap",".switch .nav li",function(){
            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");

            //  如果顶部点击元素和“请选择”中间有其他元素，需要删除它；
            var index = $("#prompt").index() - $(this).index();
            if(index > 1){
                for(var x = 1 ; x < index ; x++){
                    $(".switch .nav li").eq($(this).index()+1).remove();
                }
            }
            if($(this).is("#prompt")){
                //  如果是点击“请选择”：获取子级元素；
                _this.nextLevel($(".switch .nav li").eq($(this).index()-1).attr("data-id"));
            }else{
                //  如果不是点击“请选择”：获取同级元素；
                _this.SameLevel($(this).attr("data-id"),$(this).attr("data-pid"));
            }

        });
    },
    SameLevel:function(id,pid){
        //  获取同级楼栋；pid使用的是字符串
        var html = '';
        this.addressList.empty();
        if(!(pid === "null")){
            html = '<li class="all" data-id="'+ pid +'"><i></i>全部</li>';
        }
        $.each(this.louDong,function(index,val){
            var IndexActive = "";
            if(val.parentId + "" === pid){
                //  保证刷新后突出显示
                if(propertyId && parseInt(propertyId) === val.id){
                    IndexActive = "active";
                }
                html += '<li class="'+ IndexActive +'" data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
            }

        });
        this.addressList.append(html);
    },
    nextLevel:function(id){
        //  获取子集楼栋；
        var html = '';
        this.addressList.empty();
        html = '<li class="all" data-id="'+ id +'"><i></i>全部</li>';
        $.each(this.louDong,function(index,val){
            if(val.parentId + "" === id){
                html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
            }
        });
        this.addressList.append(html);
    },
    repeatAdd:function(pid){
        var ParData = this.topSuperior(pid);
        var pidData = ParData?ParData.parentId:"null";
        if(ParData){
            //  如果父级ID不为"null"，则重复添加；   ****** 此操作在前，以此让顶部菜单排列正确！*********
            if(!(pidData === "null")){
                this.repeatAdd(pidData);
            }
            this.topApend(ParData.id,pidData,ParData.name);
        }
    },
    topApend:function(id,pid,text){
        //  将选择的放入顶部导航；id:当前ID ， pid：当前父级ID， text：当前名
        $("#prompt").before('<li data-pid="'+ pid +'" data-id="'+ id +'">'+ text +'</li>');
    },
    topSuperior:function(pid){
        //  判断是否有上一级,如果有上一级则返回数据，如果没有则返回null
        var bur = null;
        //  pid为null时，不遍历；
        if(parseInt(pid)){
            $.each(this.louDong,function(index,val){
                if(parseInt(pid) === val.id){
                    bur = val;
                }
            });
        }
        return bur;

    },
    judgment:function(id){
        //  判断是否有下一级
        var bur = false;
        $.each(this.louDong,function(index,val){
            if(parseInt(id) === val.parentId){
                bur = true;
            }
        });
        return bur;
    }
};

$(document).ready(function(){
    //  楼栋切换；
    var tap = new dongSwitch();
    tap.main();  // 调用总函数；
});

// 数据获取
function IndexAjax(proPertyId){
    this.userId = userId;   // 用户ID；
    this.propertyId = proPertyId;   // 物业ID；

    this.main = function(){
      this.authority();     //权限接口；
      this.prompt();        // 五个机制是否显示红点提示；
      this.noticeIndex();   // 通知列表；
      this.rvatIndex();     // 首页预约看房；
      this.repairIndex();   // 首页报修列表；
    };
    this.authority = function(){
        // 权限；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/usercenter/'+ userId,
            data: null,
            dataType:'json',
            success:function(data){
                if(data.code === 0 && data.data){
                    sessionStorage.setItem("authority",JSON.stringify(data.data));
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    },
    this.prompt = function(){
        // console.log(this.propertyId);
        // 五个机制是否显示红点提示；
        // 报修；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/index/repair/count.json',
            data: {
                "userId":this.userId,
                "propertyId":this.propertyId
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0 && data.data){
                    if(data.data >= 0){
                        $(".features a").eq(2).find(".red-icon").show();
                    }
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
        // 公告；
        $.ajax({
            type:'get',
            url:  server_url_notice + server_v1 + '/notice/count.json',
            data: {
                "userId":this.userId,
                "propertyId":this.propertyId
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0 && data.data){
                    if(data.data.noticeCount > 0){
                        $(".features a").eq(1).find(".red-icon").show();
                    }
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
    this.noticeIndex = function(){
        // 通知列表；
        $.ajax({
            type:'get',
            url:  server_url_notice + server_v1 + '/notify/roll.json',
            data: {
                "userId":this.userId,
                "propertyId":this.propertyId
            },
            dataType:'json',
            success:function(data){
                var noticeIndex = $("#noticeIndex");
                var html = "";
                noticeIndex.empty();
                if(data.code === 0 && data.data){
                    $.each(data.data.items,function(index,val){
                        html += '<div class="swiper-slide box-center"><a href="html/notice/notice_details.html?id='+ val.id +'">'+ val.title +'</a></div>';
                    });
                    noticeIndex.append(html);
                }else{
                    noticeIndex.append('<div class="swiper-slide box-center"><a href="javascript:">暂无最新通知，请点击更多通知</a></div>');
                    noticeWord.stopAutoplay();
                }
                noticeWord.reLoop();   //   这个函数是重新计算swiper个数
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
    this.rvatIndex = function(){
        // 首页预约看房；
        $.ajax({
            type:'get',
            url:  server_rent + server_v1 + '/rentBespeaks/index.json',
            data: {
                "userId":this.userId,
                "page":page,
                "size":2
            },
            dataType:'json',
            success:function(data){
                var showings = $("#showings");
                var html = "";
                showings.empty();
                if(data.code === 0 && data.data){
                    $.each(data.data.items,function(index,val){
                        var span = '';
                        // <!--标签有两种颜色：tag-green tag-gray-->
                        switch (val.allotStatus){
                            case 0:span = '<span class="tag-green tag">未分配</span>';
                                break;
                            case 1:span = '<span class="tag-green tag tag-gray">已分配</span>';
                                break;
                        }
                        html += '<li> <a class="overall" href="html/rent/order_detail.html?id='+ val.id +'"> <div class="introduction"> <div class="personal"> <img class="avatar" src="'+ server_uel_user_img + val.beseakUser.photo +'"  onerror="defaultPA(this)"> <div class="information"> <div class="name">'+ val.beseakUser.name + span +'</div> <time>'+ val.createTime +'</time> </div> </div> ' +
                            '<article>'+ val.rentTitle +'</article><div class="showings-time"><i class="time-icon"></i>预约时间：<span>'+ val.bespeakTime +'</span></div> </div> <img onerror="defaultP(this)" class="cover" src="'+ server_url_img + val.imageUrl +'" alt=""></a> </li>';
                    })
                }else{
                    html = '<div class="noData">亲，暂无新内容，去别的地方转转吧</div>';
                }
                showings.append(html);
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
    this.repairIndex = function(){
        // 首页报修列表；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/index/repair/list.json',
            data: {
                "userId":this.userId,
                "propertyId":this.propertyId,
                "page":page,
                "size":2
            },
            dataType:'json',
            success:function(data){
                var repair = $("#repair");
                var html = '';
                repair.empty();
                if(data.code === 0 && data.data){
                    $.each(data.data.items,function(index,val){
                        var span = '';
                        switch (val.status){
                            case 1:span = '<span class="tag-green tag">未派单</span>';
                                break;
                            case 2:span = '<span class="tag-gray tag">已派单</span>';
                                break;
                        }
                        var name = '',color = '';var address = "";
                        switch (val.type){
                            case 1:
                                name = "办公区域";color = 'blue';address = val.address;
                                break;
                            case 2:
                                name = "公共区域";color = 'pluple';address = val.publicAddress;
                                break;
                        }
                        html += '<li> <a class="overall" href="html/repair/repair_details.html?id='+ val.id +'"><div class="introduction"><div class="personal"> <img class="avatar" src="'+ server_uel_user_img + val.user.photo +'"  onerror="defaultPA(this)" alt=""> <div class="information"> <div class="name">'+ val.user.name + span +'</div> <time>'+ val.createTime +'</time> </div> </div> ' +
                            '<div class="address"><i class="position-icon"></i>地址：<span>'+ address +'</span><div class="address-types '+ color +'"><span>'+ name +'</span></div></div> </div> <img onerror="defaultP(this)" class="cover" src="'+ server_url_img + val.repairImages[0] +'" alt=""> </a> </li>';
                    })
                }else{
                    html = '<div class="noData">亲，暂无新内容，去别的地方转转吧</div>';
                }
                repair.append(html);
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
}












//  点击头像跳转
$(".personal").click(function(){
    window.location.href = "html/repair/repair_list.html";
    return false;
});


