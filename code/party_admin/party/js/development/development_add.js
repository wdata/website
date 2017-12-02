var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var flag = null;
var dataID=null;//账号的id
var stage_text='';//发展阶段
//单击弹出账号人员名单
function userList(){
    load(paGe,{page:paGe,size:pageNum});
    $(".pic-review-edit").addClass("show").addClass("in");
}
function load(page,data){
    var pageCount,vpage;   //初始的
    //如果有keyword，则说明是搜索
    if(data!=undefined){
        $.ajax({
            type:'get',
            url: DMBServer_url + '/web/api/users.json',
            data:data,
            dataType:'json',
            success:function(data){
                $("#userlist_tab .list").empty();
                if(data.code === 0){
                    var html='';
                    $.each(data.data.items,function(index,item){
                        //阶段 0:群众,10:积极份子,20:重点对象,30预备党员,100党员
                        var stage=item.type==0?"群众":item.type==10?"积极分子":item.type==20?"重点对象":item.type==30?"预备党员":"党员";
                        html+='<tr><td><input name="user" data-id="'+item.id+'" type="radio"></td><td>'+item.userName+'</td><td>'+item.name+'</td><td>'+item.phone+'</td><td data-type="'+item.type+'">'+stage+'</td><td>'+item.organName+'</td></tr>';
                    });
                    $("#userlist_tab .list").append(html);
                    //分页
                    pageCount = data.data.pageCount;
                    vpage = pageCount>10?10:pageCount;
                    var keyword = $("#keyword").val();
                    if(keyword=="undefined")keyword=null;
                    if(pageCount>1){
                        $('.pages').show();
                        flag = true;
                        initPagination('#pagination',pageCount,vpage,page+1,function(num,type){
                            if(type === 'change'){
                                paGe = num - 1;
                                load(paGe,{page:paGe,size:pageNum,keyword:keyword});
                            }
                        });
                    }else{
                        if(flag) {
                            paGe = 0;
                            load(paGe,{page:paGe,size:pageNum,keyword:keyword});
                            flag = false;
                            $('.pages').hide();
                        }
                    }
                }else{
                    //无数据提醒框
                    returnMessage(2,'暂无数据！');
                    $('.pages').hide();

                }
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }
}
//搜索查询
function search(size){
    var keyword = $("#keyword").val();
    //开始时显示数据
    var dataObject = {
        page:0,
        size:size,
        keyword:keyword
    };
    if(dataObject.keyword!=undefined){
        load(0,dataObject);
    }
}
/*跳转到第几页*/
function pageTo(_this){
    var max=parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
    var val=parseInt($(_this).siblings('input').val());
    var num=(val>0?val:1)>max?max:(val>0?val:1);
    paGe = num - 1;
    load(paGe,{page:paGe,size:pageNum});
    $(_this).siblings('input').val(num);
}
//选择账号的弹框 确定
function confirm(){
    var userlist_tab=$('#userlist_tab .list input[type=radio]:checked');
    if(userlist_tab.length!=0) {
        dataID = userlist_tab.attr("data-id");   //单选按钮
        var name=$(userlist_tab.parents("tr").find("td")[2]).text();
        var stage=$(userlist_tab.parents("tr").find("td")[4]).text();
        var userName=$(userlist_tab.parents("tr").find("td")[1]).text();
        stage_text=$(userlist_tab.parents("tr").find("td")[4]).attr("data-type");
        $("#name").text(name);
        $("#stage").text(stage);
        $("#userName").val(userName);
        $(".pic-review-edit").removeClass("show").removeClass("in");
    }else{
        returnMessage(2,'请选择账号！')
    }
}
//取消
function cancel(){
    $(".pic-review-edit").removeClass("show").removeClass("in");
}
//新增的确定
function editAjax(){
    var data={
        userId:dataID,
        reviewer:$("#reviewer").val(),
        content:$("#content").val(),
        type:stage_text
    };
    if($("#newForm").valid()){
        $.ajax({
        type:'POST',
        url: DMBServer_url + '/web/api/article/partyDevelop/add.json',
        data:data,
        dataType:'json',
        success:function(data){
            if(data.code === 0){
                returnMessage(1,'添加成功！');
                //修改成功，清空表单
                $("#newForm")[0].reset();
            }else{
                returnMessage(2,'添加失败data.code为：' + data.code);
            }
        },
        beforeSend:function(xhr){
            $('.opering-mask').show().find('.con').text('正在处理中，处理结束后该弹窗消失！');
        },
        complete:function(){
            $('.opering-mask').hide();
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
    }
}
