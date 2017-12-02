/**
 * Created by Administrator on 2017/8/15.
 */

// 修改上传图片

$(document).ready(function(){

    htmlAjax.project();   //  获取报修项目；

    operating.OPevent();  // DOM事件；
    operating.OPtime();   // 时间插件；
    //  楼栋切换；
    var tap = new dongSwitch();
    tap.main();  // 调用总函数；
});
//  ajax请求获取数据和发布报修；
var htmlAjax = new HtmlAjax();
function HtmlAjax(){
    this.releaseRpr = function(){
        if(wxImg.imgBur){
            showMask("正在处理图片，请稍等！");
            return
        }
        var urls = [];
        var data = {};
        $.each(wxImg.fileData,function(index,val){
           urls.push(val.url);
        });

        var type = $(".addType .active").attr("data-id");  //类型;
        var content = $("#box").html();                     //报修内容
        var bespeakTime = '',expectTime = '',repairItemId = '',repairAddressId = '';
        var serviceAdd = $("#service-address").attr("data-id");
        var address = $("#pA").val();
        if(type === "1"){
            bespeakTime = $("#reservation").val();
            expectTime = $("#expected").val();
            repairItemId = $("#projectList .active").attr("data-id");
            repairAddressId = $("#ads").attr("data-id");

            data["bespeakTime"] = bespeakTime;
            data["expectTime"] = expectTime;
            data["repairItemId"] = repairItemId;
            data["repairAddressId"] = repairAddressId;
            data["propertyId"] = propertyId;

        }else if(type === "2"){

            if(serviceAdd){
                data["propertyId"] = serviceAdd;
            }else{
                showMask("请选择服务地址！");
                return;
            }

            if(reg.test(address) || content === ""){
                showMask("请输入报修项目详细地址！");
                return;
            }

            data["address"] = address;
        }

        //  判断是否为空！
        if(type === "1" && (!bespeakTime || !expectTime)){
            showMask("请选择预约和期望时间！");
            return;
        }
        if(new Date().getTime() >= new Date(bespeakTime).getTime()){
            showMask("预约上门时间不能早于当前日期！");
            return ;
        }
        if(new Date(bespeakTime).getTime() >= new Date(expectTime).getTime()){
            showMask("期待完成时间必须大于预约上门时间！");
            return ;
        }
        if(reg.test(content) || content === ""){
            showMask("请输入报修内容！");
            return;
        }
        if(urls.length <= 0){
            showMask("请添加最少一张图片！");
            return;
        }

        data["urls"] = urls;
        data["userId"] = userId;
        data["type"] = type;
        data["content"] = content;

        $.ajax({
            type:'post',
            url:  server_url_repair + server_v1 + '/repair/add.json',
            data: data,
            dataType:'json',
            traditional:true,
            success:function(data){
                if(data.code === 0){
                    window.location.href = "repair_list.html";
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
    this.project = function(){
        //  获取用户信息;
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/usercenter/userInfo/'+ userId +'.json',
            data: null,
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    $("#name").val(data.data.name);
                    $("#phone").val(data.data.phone);
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
        //  获取报修项目；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repairItem/list.json',
            data: null,
            dataType:'json',
            success:function(data){
                var html = '';
                var pList = $("#projectList");
                pList.empty();
                if(data.code === 0){
                    $.each(data.data,function(index,val){
                        //  添加必选；
                        if(index === 0){
                            html += '<li class="active" data-id="'+ val.id +'">'+ val.name +'</li>';
                        }else{
                            html += '<li data-id="'+ val.id +'">'+ val.name +'</li>';
                        }
                    });
                    pList.append(html);
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
        //  服务地址;
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repairAddress/list.json',
            data: {
                "userId":userId,
                "propertyId":propertyId
            },
            dataType:'json',
            success:function(data){
                var html = '';
                var aList = $(".addressList");
                aList.empty();
                if(data.code === 0){
                    $.each(data.data,function(index,val){
                        //  添加必选；
                        if(val.isDefault === 1){
                            html += '<li class="active"> <div data-id="'+ val.id +'" class="address">'+ val.address +'</div><div class="select"><i class="select-icon"></i>设为默认</div> </li>';
                            //  如果为默认，则默认显示在列表中；
                            $("#ads").text(val.address).attr("data-id",val.id);
                        }else{
                            html += '<li> <div data-id="'+ val.id +'" class="address">'+ val.address +'</div><div class="select"><i class="select-icon"></i>设为默认</div> </li>';
                        }
                    });
                    aList.append(html);
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        })
    };
    this.upDefault = function(self){
        $.ajax({
            type:'post',
            url:  server_url_repair + server_v1 + '/repairAddress/update.json',
            data: {
                "id":$(self).find(".address").attr("data-id"),
                "isDefault":1
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    console.log("修改默认成功！");
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    }
}


//  HTML中DOM事件和时间插件；
var operating = new Operating();
function Operating(){

    this.OPevent = function(){
        //  报修类型和报修项目选择
        $(document).on("click",".repair-type li",function(){
            $(this).addClass("active").siblings("li").removeClass("active");

            //  如果为公共区域和办公区域
            if($(this).is(".office-area")){
                $(".officeArea").removeClass("hide");
                $(".next-step").removeClass("hide");
                $(".publicSub").addClass("hide");
                $(".publicArea").addClass("hide");
            }else if($(this).is(".public-area")){
                $(".officeArea").addClass("hide");
                $(".next-step").addClass("hide");
                $(".publicSub").removeClass("hide");
                $(".publicArea").removeClass("hide");
            }
        });
        //  请选择服务地址；
        $("#service").click(function(){
           $(".repair-add-switch").addClass("active");
        });

        //  服务地址默认地址切换
        $(document).on("click",".service li",function(){
            $(this).addClass("active")
                .siblings().removeClass("active");
            //  修改默认地址；
            if(!$(this).is(".ative")){
                htmlAjax.upDefault(this);
            }
        });
        //  服务地址选择；
        $("#address").on("click",function(){
            $(".repair-add").addClass("active");
            $(".service").addClass("active");
        });
        //  从服务页面返回输入页面；
        $("#addressReturn").on("click",function(){
            $(".repair-add").removeClass("active");
            $(".service").removeClass("active");

            $("#ads").text($(".addressList li.active .address").text())
                .attr("data-id",$(".addressList li.active").find(".address").attr("data-id"));
            return false;
        });
        //  下一步
        $(".next-step").on("click",function(){
            $(".first").addClass("active");
            $(".second").addClass("active");
            $(".project").text($("#projectList li.active").text());
            $(".repair-add-A .header-return").unbind().addClass("previousPage");   // 解除返回的点击事件
        });
        //  返回上一步选择报修类型；
        $(document).on("click",".previousPage",function(){
            $(".first").removeClass("active");
            $(".second").removeClass("active");

            // 移除返回上一步，绑定返回上一页；
            $(".repair-add-A .header-return").removeClass("previousPage")
                .on("click",function(){
                history.go(-1);
            })
        });
        $(".repair-add-A .header-return").on("click",function(){
            history.go(-1);
        })
    };
    this.OPtime = function(){
        //  时间插件
        var currYear = (new Date()).getFullYear();
        var opt={};
        opt.date = {preset : 'date'};
        opt.datetime = {preset : 'datetime'};
        opt.time = {preset : 'time'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式
            mode: 'scroller', //日期选择模式
            dateFormat: 'yyyy-mm-dd',
            lang: 'zh',
            showNow: true,
            nowText: "今天",
            startYear: currYear, //开始年份
            endYear: currYear + 10 //结束年份
        };
        var optDateTime = $.extend(opt['datetime'], opt['default']);
        $("#reservation").mobiscroll(optDateTime).datetime(optDateTime);
        $("#expected").mobiscroll(optDateTime).datetime(optDateTime);
        //  自适应问题，所以根据HTML上的font-size来判断增加的padding
        var fontSize = parseInt($("html").css("font-size"));
        if(fontSize <= 32){
            $("body").addClass("active1")
        }
    }
}

function dongSwitch(){
    this.louDong = null;       //   保存数据；
    this.addressList = $("#addressList");   //  楼栋列表父级元素
}
dongSwitch.prototype = {
    constructor:dongSwitch,
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

            var a = $("#addressList li.active");
            var id = a.attr("data-id");
            var address = '';   //  服务地址；

            //  判断id不为空；
            if(id){
                $.each($("#prompt").siblings(),function(index,val){
                    address += $(val).text() + " ";
                });
                if(!(a.text() === "全部")){
                    address += a.text() + " ";
                }
                $(".service-address").addClass("active");
                $("#service-address").text(address).attr("data-id",id);
            }
        });
        //  重置
        $("#reset").click(function(){
            //  重置订单报修状态；
            $(".repair-switch .status li:first-child").addClass("active").siblings().removeClass("active");
            //   重置楼栋
            _this.dongAjax();     //  ajax事件获取数据，并将数据保存；
            //  删除顶部选择楼栋；
            $("#prompt").siblings().remove();
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
        $(document).on("click",".switch .nav li",function(){
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