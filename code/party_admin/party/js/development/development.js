var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var flag = null;

var keyword = [];

$(document).ready(function(){
    label(paGe,pageNum);
    // getComp("#firmId");
});

function label(page,size,keyword){
    var pageCount,vpage;   //初始的
    //如果有keyword，则说明是搜索
    //开始时显示数据
    var dataObject = {
        page:page,
        size:size,
        type:6
    };
    //如果有keyword，则说明是搜索
    if(keyword){
        dataObject["keyword"] = keyword[0];
        dataObject["stage"] = keyword[1];
        dataObject["firmId"] = keyword[2];
    }
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/articles.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            $("#userlist_tab .list").empty();
            if(data.code === 0){
                var html='';
                $.each(data.data.items,function(index,item){
                    //阶段 0:群众,10:积极份子,20:重点对象,30预备党员,100党员
                    var stage=item.stage==0?"群众":item.stage==10?"积极分子":item.stage==20?"重点对象":item.stage==30?"预备党员":"党员";
                    var sex=item.user.sex==0?"女":item.user.sex==1?"男":"未知";
                    html+='<tr><td><input onclick="checkDown(this)" data-id="'+item.id+'" type="checkbox"></td><td>'+ (index + 1 + page * 10) +'</td><td>'+item.user.name+'</td><td>'+item.user.phone+'</td><td>'+sex+'</td><td>'+stage+'</td><td>'+item.changeTime+'</td><td>'+item.user.organName+'</td><td>'+item.companyName+'</td><td><button class="btn bg-info text-muted btn-dialog-tab" href="party/development/development/development_view.html" onclick="session(\'development_id\','+item.user.id+');" class="btn btn-info btn-dialog">查看</button></td><td><a onclick="verifier(this)" class="btn btn-info btn-dialog">查看</a></td></tr>';
                });
                $("#userlist_tab .list").append(html);
                //分页
                pageCount = data.data.pageCount;
                vpage = pageCount>10?10:pageCount;
                if(pageCount>1){
                    $('.pages').show();
                    flag = true;
                    initPagination('#pagination',pageCount,vpage,page+1,function(num,type){
                        if(type === 'change'){
                            paGe = num - 1;
                            label(paGe,pageNum,keyword);
                        }
                    });
                }else{
                    if(flag) {
                        paGe = 0;
                        label(paGe,pageNum,keyword);
                        flag = false;
                        $('.pages').hide();
                    }
                }
            }else{
                //无数据提醒框
                // returnMessage(2,'暂无数据！');
                $('.pages').hide();

            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });

}
/*跳转到第几页*/
function pageTo(_this){
    var max=parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
    var val=parseInt($(_this).siblings('input').val());
    var num=(val>0?val:1)>max?max:(val>0?val:1);
    paGe = num - 1;
    label(paGe,pageNum,keyword);
    $(_this).siblings('input').val(num);
}
//搜索查询
function search(){
    keyword = [];
    $.each($('.input-sm .form-control'),function(index,val){
        keyword.push($(val).val());
    });
    if(keyword.length >= 1){
        console.log(keyword);
        paGe = 0;   //如果在1以上页面，则返回1页面并搜索内容
        //调用台账模板列表
        label(paGe,pageNum,keyword);
    }else{
        //无内容，不搜索，并且提示
        returnMessage(3,'请输入搜索内容！');
    }
}
// 查看审核详情
function verifier(_this){
    var id=$(_this).parents("tr").find("input").attr("data-id");
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/article/'+id+'.json',
        data:{},
        dataType:'json',
        success:function(data){
            var type=data.data.user.type==0?"群众":data.data.user.type==10?"积极分子":data.data.user.type==20?"重点对象":data.data.user.type==30?"预备党员":"党员";
            console.log(data);
            if(data.code === 0){
                $("#userName").text(data.data.user.userName);
                $("#name").text(data.data.user.name);
                $("#type").text(type);
                $("#content").text(data.data.content);
                $("#reviewer").text(data.data.reviewer);
                $("#reviewTime").text(data.data.reviewTime);
                $("#myModal").modal();
            }else{
                //无数据提醒框
                returnMessage(2,'暂无数据！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}