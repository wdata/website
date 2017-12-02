/**
 * Created by Administrator on 2017/8/18.
 */

var htmlAjax = new HtmlAjax();
var dropload;
var comment = 1;
/*
*  dropload：评论的滚动插件；
*  comment：滚动插件需要的page全局变量；
* */

//  显示评论和点赞按钮
$(".prompt").on("click",function(){
    $("#CLbutton").toggleClass("hide");
});
//  显示和隐藏评论输入框
$("#comment").on("click",function(){
    //  如果没有权限显示确认验收，则不修改；
    if(!$(".comment-box").is(".auth")){
        $(".confirm").toggleClass("hide");
        $(".comment-box").toggleClass("hide");
    }
});

var auth_1 = authMethod("/llt/repair/list/button/sendOrders");
var auth_2 = authMethod("/llt/repair/list/button/sendAgain");
var auth_3 = authMethod("/llt/repair/list/button/check");
var auth_4 = authMethod("/llt/repair/list/button/orderReceive");
var auth_5 = authMethod("/llt/repair/list/button/handover");
var auth_6 = authMethod("/llt/repair/list/button/handle");
var auth_7 = authMethod("/llt/repair/list/button/revoke");


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


$(document).ready(function(){
   htmlAjax.details();  //详情；
    htmlAjax.features(); // 接单和确认颜色操作；
});


function HtmlAjax(){
    this.userId = userId;   // 用户ID；
    this.propertyId = propertyId;   // 物业ID；
    this.details = function(){
        var _this = this;
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repair/'+ urlParams("id") +'.json',
            data: {
                "userId":_this.userId
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    var img = '',operating = '',color = '',mi = '',href = 'repair_details.html',type = '',address = "",dataD = data.data;
                    /* color：各种状态不同的颜色；
                     *  mi：如果登录人和被派单人相同则显示“给我的”；
                     *  href：撤销和其他状态是两个不同的页面；
                     *  img：保存图片HTML代码；
                     *  operating：例如派单、撤销、移交等操作；
                     *  type：办公区域和公共区域；
                     *  address：两种区域的地方参数不同；
                     *  dataD：数据
                     * */
                    switch (dataD.status){
                        case 1:
                            color = "green";
                            //  如果是物业管理人员则显示未派单；如果是租户，则显示待受理；
                            if(auth_1){
                                operating += '<a href="repair_sent.html?id='+ dataD.id +'&status=1" class="repair-operating single blue">派单</a>';
                            }
                            operating += _this.odr(dataD.id);  // 接单
                            break;
                        case 2:
                            //  判断维修ID等于登录ID，则显示“给我的”派单；
                            if(dataD.handlerId === parseInt(userId)){
                                mi = '<i class="mine-icon"></i>';
                                color = auth_1?"blue":"green";  // 有派单权限，显示蓝色；没有显示绿色；
                                operating += _this.odr(dataD.id);  // 接单
                            }else{
                                color = auth_1?"blue":"green";  // 有派单权限，显示蓝色；没有显示绿色；
                            }
                            break;
                        case 3:
                            color = "blue";
                            if(auth_5){
                                operating += '<a href="repair_transfer.html?id='+ dataD.id +'" class="repair-operating transfer blue">移交</a>';
                            }
                            if(auth_6){
                                operating += '<a href="repair_result.html?id='+ dataD.id +'" class="repair-operating dealWith blue">填写处理</a>';
                            }
                            break;
                        case 4:
                            color = "red";
                            //  有重新派单权限，可以派单；
                            if(auth_2){
                                operating += '<a href="repair_sent.html?id='+ dataD.id +'&status=2" class="repair-operating reappear blue">重新派单</a>';
                            }
                            operating += _this.odr(dataD.id);  // 接单
                            break;
                        case 5:
                            color = "green";
                            if(auth_3 && parseInt(userId) === dataD.user.id){
                                _this.apt(dataD.id);  // 显示确认验收
                            }else if(auth_3 && dataD.type === 2 && parseInt(userId) !== dataD.handlerId){
                                _this.apt(dataD.id);  // 显示确认验收
                            }else{
                                _this.cmt();   // 显示评论，并提示点击评论出现按钮，不能显示确认验收；
                            }
                            break;
                        case 6:
                            color = "yellow";
                            _this.cmt();   // 显示评论，并提示点击评论出现按钮，不能显示确认验收；
                            break;
                        case 7:
                            color = "gray";
                            href = 'repair_revoked_has.html';
                            $(".comment-box").removeClass("hide");
                            break;
                    }
                    //  如果有撤销权限，切登录ID和发布ID相同，则可以撤销；
                    if(auth_7 && parseInt(userId) === dataD.user.id && (dataD.status === 1 || dataD.status === 2)){
                        operating += '<a href="repair_revoked.html?id='+ dataD.id +'" class="repair-operating cancel red">撤销</a>';
                    }
                    var status = '<div class="repair-status '+ color +'">'+ mi + dataD.statusName +'</div>';


                    if(dataD.repairImages){
                        $.each(dataD.repairImages,function(x,y){
                            img += '<figure><a href="'+ server_url_img + y +'" data-size="1024x1024" ><img src="'+ server_url_img + y +'"  onerror="defaultP(this)"></a><figcaption >repair pictures '+ (x + 1) +'</figcaption></figure>';
                            // img += '<a href="https://farm3.staticflickr.com/2567/5697107145_a4c2eaa0cd_o.jpg" itemprop="contentUrl" data-size="1024x1024"> <img src="https://farm3.staticflickr.com/2567/5697107145_3c27ff3cd1_m.jpg" itemprop="thumbnail" alt="Image description" /> </a>'
                        })
                    }

                    // 报修类型
                    switch (dataD.type){
                        case 1:type = "办公区报修";address = dataD.address;break;
                        case 2:type = "公共区报修";address = dataD.publicAddress;$(".pbc").hide();break; //  公共区域没有类型，时间等；
                    }


                    var su = null; // 给顶部显示维修人员定位；
                    //  头部状态；
                    if(dataD.status >= 1){
                        _this.stu(0);   // 四个状态显示；
                        if(dataD.status >= 3){
                            _this.stu(1);   // 四个状态显示；
                            $(".process").addClass("active"); //  当已受理时，显示报修头像和报修人
                            su = "one";
                            if(dataD.status >= 5){
                                _this.stu(2);   // 四个状态显示；
                                su = "two";
                                //  显示点赞，评论，显示处理详情；
                                $(".result").removeClass("hide");
                                $(".con-main").removeClass("hide");

                                _this.comList();  //    评论列表；
                                _this.likeList();  //   点赞头像列表；
                                if(dataD.status >= 6){
                                    _this.stu(3);   // 四个状态显示；
                                    su = "three";
                                }
                            }
                        }
                    }
                    // 报修类型；
                    $("#type").html('<i></i>' + type);
                    //  可进行操作；
                    $("#set").empty().append(operating);
                    //  报修人;
                    $("#people").empty().append('<img class="avatar" src="'+ server_uel_user_img + dataD.user.photo +'"  onerror="defaultPA(this)"> <div class="information"> <div class="name">'+ dataD.user.name +'</div> <time>'+ dataD.createTime +'</time> </div>').attr("href",headJumps(dataD.user.id));
                    //  订单状态；
                    $("#status").empty().append(status);
                    //  报修类型；
                    $("#aspect").text(dataD.repairItem);
                    //  报修内容;
                    $("#content").text(dataD.content);
                    //  图片；
                    $("#image").empty().append(img);
                    //  地址;
                    $("#property").text(address);
                    //  预约上门时间;
                    $("#reservation").text(dataD.bespeakTime);
                    //  期待完成时间;
                    $("#carryOut").text(dataD.expectTime);





                    //  已受理；以上会有维修人头像和名字：
                    var html = '';
                    if(dataD.handlerUsers){
                        if(dataD.handlerUsers.length > 1){
                            html = '<div class="most frame '+ su +'"> ' +
                                '<a class="service over"  href="'+ headJumps(dataD.handlerUsers[1].id) +'"><img class="avatar" src="'+ server_uel_user_img + dataD.handlerUsers[1].photo +'" onerror="defaultPA(this)" alt=""></a> ' +
                                '<a class="service" href="'+ headJumps(dataD.handlerUsers[0].id) +'"> <img class="avatar" src="'+ server_uel_user_img + dataD.handlerUsers[0].photo +'" onerror="defaultPA(this)" alt=""> <div class="concise"><p class="career">维修员</p><p>'+ dataD.handlerUsers[0].name +'</p></div> </a> </div>'
                        }else{
                            html = '<div class="odd-number frame '+ su +'"> <a class="service" href="'+ headJumps(dataD.handlerUsers[0].id) +'"> <img class="avatar" src="'+ server_uel_user_img + dataD.handlerUsers[0].photo +'" onerror="defaultPA(this)" alt=""> <div class="concise"><p class="career">维修员</p><p>'+ dataD.handlerUsers[0].name +'</p></div> </a> </div>'
                        }
                        $(".repair-man").empty().append(html);
                    }


                    //  待验收；
                    var imgA = "";
                    if(dataD.repairRecordImages){
                        $.each(dataD.repairRecordImages,function(x,y){
                            imgA += '<figure><a href="'+ server_url_img + y +'" data-size="1024x1024" ><img src="'+ server_url_img + y +'" ></a><figcaption itemprop="caption description">repair pictures '+ (x + 1) +'</figcaption></figure>';
                        });
                        $("#images").empty().append(imgA);
                    }
                    //  处理内容
                    $("#dealCon").text(dataD.remark);
                    //  处理时间；
                    $("#rRDate").text(dataD.repairRecordDate);

                    //  评论是否点赞；
                    dataD.isUpvote === true?$(".like-btn").addClass("active"):"";
                    //  显示
                    $("#pending").removeClass("hide");
                }
            },
            error:function(data){
                ErrorReminder(data);
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
        _this.apt = function(data){
            $("#confirm").removeClass("hide").attr("data-id",data);
            $(".hr-96").removeClass("hide");
        };
        _this.cmt = function(){
            $(".comment-box").removeClass("hide").addClass("auth");
            $(".hr-96").removeClass("hide");
        };
        _this.stu = function(data){
            $(".status>span").eq(data).addClass("active");
            $(".transparent").eq(data).addClass("active");
        };
    };
    this.comList = function(){
        var _this = this;
        //  报修评论列表；
        dropload = $('#list').dropload({
            scrollArea : $(".repair-details"),
            autoLoad:true,
            loadDownFn : function(me){
                //  获取报修评论列表
                $.ajax({
                    type:'get',
                    url:  server_url_repair + server_v1 + '/repairMessage/list.json',
                    data: {
                        "repairId":urlParams("id"),
                        "page":comment,
                        "size":5
                    },
                    dataType:'json',
                    success:function(data){
                        var html = '';
                        if(comment === 1 && data.code === 0 && data.data && data.data.items <= 0){
                            $(".comment").addClass("hide");   //没有评论时隐藏评论列表；
                            return false;
                        }
                        if(data.code === 0 && data.data){
                            $(".comment").removeClass("hide");   //有评论时显示评论列表；
                            $.each(data.data.items,function(index,val){
                                html += '<li> <a href="'+ headJumps(val.id) +'"><img class="small-avatar" src="'+ server_uel_user_img + val.user.photo +'" onerror="defaultPA(this)" alt=""></a> <div class="inform"> <p class="name">'+ val.user.name +'</p> <time>'+ val.createTime +'</time> <div class="content">'+ val.content +'</div> </div> </li>';
                            });
                            $("#listCom").append(html);

                            comment++;
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

                        $(".comment").addClass("hide");   //没有评论时隐藏评论列表；

                        _this.noData(me);   // 无数据
                        me.resetload();    //数据加载玩重置
                    }
                })
            }
        });
        _this.noData = function(me){
            me.lock();  //智能锁定，锁定上一次加载的方向
            me.noData();      //无数据
        };

    };
    this.releaseCom = function(){
        var _this = this;
        var con = $("#comCon").val();
        //  发布评论；
        if(!(reg.test(con)||con === "")){
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repairMessage/add.json',
                data: {
                    "userId":userId,
                    "repairId":urlParams("id"),
                    "content":con
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        showMask("评论成功！");
                        $("#listCom").empty();  // 删除列表数据；
                        $("#comCon").val("");  // 清空评论；
                        comment = 1;
                        dropload.unlock();
                        dropload.noData(false);
                        dropload.resetload();
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        }else{
            showMask("评论不能为空！");
        }
    };
    this.releaseLike = function(self){
        var _this = this;
        //  判断是点赞，还是取消点赞；
        if($(self).is(".active")){
            //  取消点赞
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repairBehaviour/delete.json',
                data: {
                    "userId":userId,
                    "repairId":urlParams("id"),
                    "type":1
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        $(self).removeClass("active");
                        _this.likeList();
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        }else{
            //  点赞
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repairBehaviour/add.json',
                data: {
                    "userId":userId,
                    "repairId":urlParams("id"),
                    "type":1
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        $(self).addClass("active");
                        _this.likeList();
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        }
    };
    this.likeList = function(){
        //  点赞列表；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repairBehaviour/list.json',
            data: {
                "repairId":urlParams("id"),
                "page":1,
                "size":9
            },
            dataType:'json',
            success:function(data){
                var list = $("#likeList");
                var html = '';
                list.empty();
                if(data.code === 0 && data.data){
                    $(".like").removeClass("hide");   // 有点赞，显示点赞列表；
                    $.each(data.data.items,function(index,val){
                        html += '<a href="javascript:"><img class="small-avatar" src="'+ server_uel_user_img + val.user.photo +'"  onerror="defaultPA(this)" alt=""></a>';
                    });
                    list.append(html);
                }else{
                    $(".like").addClass("hide");   // 如果没有点赞，隐藏点赞列表；
                }
            },
            error:function(data){
                ErrorReminder(data);
                $(".like").addClass("hide");   // 如果没有点赞，隐藏点赞列表；
            }
        })
    };
    this.features = function(){
        $(document).on("click",".orders",function(){
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
                        history.go(0); //   刷新页面；
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        });
        $(document).on("click","#confirm",function(){
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
                        history.go(0); //   刷新页面；
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        })
    }
}