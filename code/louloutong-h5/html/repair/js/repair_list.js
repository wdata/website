/**
 * Created by Administrator on 2017/8/23.
 */
var page = null;   // 页数
var repairType = null;  // 报修状态；
var searchStatus = null;  // 报修类型；
var searchType = 1;  // 搜索类型；
var keyword = null;   // 搜索关键字；
var pIdRepair = propertyId;  // 物业ID；
var comment = 1;      //page数
var dropload;


//  权限； 报修列表按钮
// /llt/repair/list/button/sendOrders 派单
// /llt/repair/list/button/sendAgain  重新派单
// /llt/repair/list/button/check  确认验收
// /llt/repair/list/button/orderReceive   接单
// /llt/repair/list/button/handover   移交
// /llt/repair/list/button/handle 填写处理
// /llt/repair/list/button/revoke 撤销

var auth_1 = authMethod("/llt/repair/list/button/sendOrders");
var auth_2 = authMethod("/llt/repair/list/button/sendAgain");
var auth_3 = authMethod("/llt/repair/list/button/check");
var auth_4 = authMethod("/llt/repair/list/button/orderReceive");
var auth_5 = authMethod("/llt/repair/list/button/handover");
var auth_6 = authMethod("/llt/repair/list/button/handle");
var auth_7 = authMethod("/llt/repair/list/button/revoke");
// console.log(auth_1,auth_2,auth_3,auth_4,auth_5,auth_6,auth_7);




var htmlAjax = new HtmlAjax();
htmlAjax.distribution();
htmlAjax.listStatus();


//<div class="repair-status green">未派单</div>
//<div class="repair-status red">被移交</div>
//<div class="repair-status gray">已撤销</div>
//<div class="repair-status green">待验收</div>
//<div class="repair-status blue">已派单</div>
//<div class="repair-status blue">已受理</div>
//<div class="repair-status yellow">已确认</div>

//<div class="repair-operating cancel red">撤销</div> 移交(transfer)
//<div class="repair-operating single blue">派单</div>，接单(orders)，填写处理(dealWith)
//<div class="repair-operating reappear blue">重新派单</div>
//<div class="repair-operating confirm yellow">确认验收</div>

// 数据获取
function HtmlAjax(){
    this.Dlist = $("#list");
    this.distribution = function(){
        var _this = this;
         dropload = $(".repair-list").dropload({
            scrollArea : $(".repair-list"),
            autoLoad:true,
            loadDownFn : function(me){
                //  获取报修列表
                _this.repairList(pIdRepair,searchType,keyword,me,repairType,searchStatus);
            }
        });
    };
    this.road = function(){
        var _this = this;
        _this.Dlist.empty();            //清除列表数据;
        comment = 1;
        dropload.unlock();
        dropload.noData(false);
        dropload.resetload();
    };
    this.repairList = function(proId,searchType,keyword,me,repairType,searchStatus){
        var _this = this;
        console.log("物业ID：" + proId + " 搜索类型：" + searchType + " 搜索内容：" + keyword + " page：" + comment);
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repair/list.json',
            data: {
                "userId":userId,
                "propertyId":proId,
                "page":comment,
                "size":5,
                "status":repairType,
                "type":searchStatus,
                "searchType":searchType,
                "keyword":keyword
            },
            dataType:'json',
            success:function(data){
                var html = '';
                if(data.code === 0 && data.data){
                    $.each(data.data.items,function(index,val){
                        var img = '',operating = '',color = '',mi = '',href = 'repair_details.html',type = '',address = "";
                        /* color：各种状态不同的颜色；
                        *  mi：如果登录人和被派单人相同则显示“给我的”；
                        *  href：撤销和其他状态是两个不同的页面；
                        *  img：保存图片HTML代码；
                        *  operating：例如派单、撤销、移交等操作；
                        *  type：办公区域和公共区域；
                        *  address：两种区域的地方参数不同；
                        * */
                        switch (val.status){
                            case 1:
                                color = "green";
                                //  如果是物业管理人员则显示未派单；如果是租户，则显示待受理；
                                if(auth_1){
                                    operating += '<a href="repair_sent.html?id='+ val.id +'&status=1" class="repair-operating single blue">派单</a>';
                                }
                                operating += _this.odr(val.id);  // 接单
                                break;
                            case 2:
                                //  判断维修ID等于登录ID，则显示“给我的”派单；
                                if(val.handlerId === parseInt(userId)){
                                    mi = '<i class="mine-icon"></i>';
                                    color = auth_1?"blue":"green";  // 有派单权限，显示蓝色；没有显示绿色；
                                    operating += _this.odr(val.id);  // 接单
                                }else{
                                    color = auth_1?"blue":"green";  // 有派单权限，显示蓝色；没有显示绿色；
                                }
                                break;
                            case 3:
                                color = "blue";
                                //  有移交权限
                                if(auth_5){
                                    operating += '<a href="repair_transfer.html?id='+ val.id +'" class="repair-operating transfer blue">移交</a>';
                                }
                                //  有填写处理权限；
                                if(auth_6){
                                    operating += '<a href="repair_result.html?id='+ val.id +'" class="repair-operating dealWith blue">填写处理</a>';
                                }
                                break;
                            case 4:
                                color = "red";
                                //  有重新派单权限，可以派单；
                                if(auth_2){
                                    operating += '<a href="repair_sent.html?id='+ val.id +'&status=2" class="repair-operating reappear blue">重新派单</a>';
                                }
                                operating += _this.odr(val.id);  // 接单
                                break;
                            case 5:
                                color = "green";
                                if(auth_3 && parseInt(userId) === val.user.id){
                                    // 办公区域
                                    operating += '<div data-id="'+ val.id +'" class="repair-operating confirm yellow">确认验收</div>';
                                }else if(auth_3 && val.type === 2 && userId !== val.handlerId){
                                    // 公共区域
                                    operating += '<div data-id="'+ val.id +'" class="repair-operating confirm yellow">确认验收</div>';
                                }
                                break;
                            case 6:
                                color = "yellow";
                                break;
                            case 7:
                                color = "gray";
                                href = 'repair_revoked_has.html';
                                break;
                        }
                        //  如果有撤销权限，切登录ID和发布ID相同，则可以撤销；
                        if(auth_7 && parseInt(userId) === val.user.id && (val.status === 1 || val.status === 2)){
                            operating += '<a href="repair_revoked.html?id='+ val.id +'" class="repair-operating cancel red">撤销</a>';
                        }
                        // 状态
                        var status = '<div class="repair-status '+ color +'">'+ mi + val.statusName +'</div>';
                        // 判断是否有图片
                        if(val.repairImages){
                            $.each(val.repairImages,function(x,y){
                                img += '<img src="'+ server_url_img + y +'" alt="" >';
                            })
                        }
                        // 报修类型
                        switch (val.type){
                            case 1:type = "办公区域";address = val.address;break;
                            case 2:type = "公共区域";address = val.publicAddress;break;
                        }
                        html += '<li> <a class="header"  href="'+ headJumps(val.id) +'"> <img class="avatar" src="'+ server_uel_user_img + val.user.photo +'" onerror="defaultPA(this)" alt=""> <div class="information"> <div class="name">'+ val.user.name +'</div> <time>'+ val.createTime +'</time> </div> ' +
                            ''+ status +' </a><a href="'+ href +'?id='+ val.id +'"> <div class="address"><i class="address-icon"></i><span>'+ address +'</span></div> <div class="image"> '+ img +'' +
                            '</div> <p class="repair-types">报修类型：'+ type +'</p> </a> ' +
                            '<footer> '+ operating +' </footer> </li>';
                    });
                    _this.Dlist.append(html);
                    comment ++;
                    if(data.data.pageNum*data.data.pageSize >= data.data.totalCount){
                        _this.noData(me);   // 无数据
                    }
                }else{
                    _this.noData(me);   // 无数据
                }
                me.resetload();    //数据加载玩重置
            },
            error:function(data){
                ErrorReminder(data);
                _this.noData(me);   // 无数据
                me.resetload();    //数据加载玩重置
            }
        });
        _this.odr = function(data){
            //  有接单权限，可以接单；
            if(auth_4){
                return '<div data-id="'+ data +'" class="repair-operating orders blue">接单</div>';
            }else{
                return "";
            }
        };
        _this.noData = function(me){
            me.lock();  //智能锁定，锁定上一次加载的方向
            me.noData();      //无数据
        };
    };
    this.listSearch = function(slef){
        keyword = $(slef).val();
        if(keyword.length > 0){
            $(".sBox-wrapper").addClass("hei");
            this.road();  // 重置
        }else{
            $(".sBox-wrapper").removeClass("hei");
        }
    };
    this.listStatus = function(){
        var _this = this;
        $(".list-con").on("tap",".list-con div",function(){
            // 搜索类型 1：报修人 2：报修状态 3：服务地址 4：报修类型
            searchType = $(this).attr("data-id");
        });
        $(".back").on("tap",function(){
            searchType = 1;  // 报修类型
            $("#search_btn").val("");
        });
        $('#search_btn').focus(function(){
            $("#search_btn").attr("placeholder","搜索报修人");
        });
        $('#cancel').on("click",function(){

            $('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');

            searchType = 1;  // 报修类型
            keyword = "";       //  清除搜索条件；
            repairType = null;  // 报修状态；
            searchStatus = null;  // 报修类型；

            _this.Dlist.empty();            //清除列表数据;
            setTimeout(function(){
                _this.road();  // 重置
            },600);

        });
        $(document).on("tap",".orders",function(){
            var self = $(this);
            //  接单；
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repair/recept.json',
                data: {
                    "id":self.attr("data-id"),
                    "handlerId":userId
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        window.location.href = "repair_details.html?id="+ self.attr("data-id") +"";
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        });
        $(document).on("tap",".confirm",function(){
            var self = $(this);
            //  确认验收；
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repair/checked.json',
                data: {
                    "id":self.attr("data-id")
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        window.location.href = "repair_details.html?id="+ self.attr("data-id") +"";
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        })
    };
}




$(document).ready(function(){

    var tap = new DongSwitch();
//  楼栋切换；
    tap.main();  // 调用总函数；
});
function DongSwitch(){
    this.louDong = null;       //   保存数据；
    this.addressList = $("#addressList");   //  楼栋列表父级元素
}
DongSwitch.prototype = {
    constructor:DongSwitch,
    main:function(){
        this.animation();    // 确定、重置功能；和动画切换效果；（这个是可以随意编辑的，）
        this.dongAjax();     //  ajax事件获取数据，并将数据保存；（这个是获取数据）
        this.dongSelect();   //  选择下一级
        this.superior();     //  顶部导航重新选择同级楼栋；
    },
    animation:function(){
        var _this = this;
        //  确定
        $("#determine").click(function(){
            $(".index").removeClass("active");
            $(".repair-switch").removeClass("active");

            var id = $("#addressList li.active").attr("data-id");
            var text = $(".statusList .active").text();
            //  判断id不为空；
            if(id){
                pIdRepair = id;
            }
            repairType = $("#repairType .active").attr("data-value");  // 报修状态；
            searchStatus = $("#searchStatus .active").attr("data-value");  // 报修类型；

            htmlAjax.road();  // 重置
        });
        //  重置
        $("#reset").click(function(){
            //  重置订单报修状态；
            $(".repair-switch .status li:first-child").addClass("active").siblings().removeClass("active");
            //   重置楼栋
            _this.dongAjax();     //  ajax事件获取数据，并将数据保存；
            //  删除顶部选择楼栋；
            $("#prompt").siblings().remove();
            //  重置搜索数据；
            repairType = null;  // 报修状态；
            searchStatus = null;  // 报修类型；
        });

        // 平移动画效果
        $(document).on("click","#filter",function(){
            $(".index").addClass("active");
            $(".repair-switch").addClass("active");
        });
        //  选择订单报修状态
        $(".repair-switch .status li").click(function(){
            $(this).addClass("active").siblings().removeClass("active");
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
                    $.each(data.data,function(index,val){
                        //  如果parentId === null 则表示没有上一级，ajax只显示一级列表；
                        if(val.parentId === null){
                            html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
                        }
                    });
                    _this.addressList.append(html);
                    _this.Default();
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
        $(document).on("click","#addressList li",function(){
            var self = this;

            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");

            var id = $(this).attr("data-id");


            var bur = _this.judgment(id,_this.louDong);  // 判断有没有下一级；
            if(bur){
                //  判断是不是点击的全部；
                if(!$(this).is(".all")){

                    // console.log("有下一级");

                    if($("#prompt").is(".active")){
                        //  将选择的放入顶部导航；
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
                }
            }
        });

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
    Default:function(){
        var _this = this;
        //  判断sessionStorage存储的ID和name是否为空;
        if(propertyId && propertyName){
            $.each(_this.louDong,function(index,val){
                if(parseInt(propertyId) === val.id){
                    _this.SameLevel(propertyId,val.parentId + "");
                    //  如果父级ID为不为空，则添加父级ID到顶部导航；
                    _this.repeatAdd(val.parentId);  // 重复添加父级，一直到父级ID为null
                }
            })

        }
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
}