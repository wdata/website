var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var flag = null;

var keywordData = null;

$(document).ready(function(){

    /*日期初始化*/
    $("#begin").datetimepicker({
        format: "yyyy-mm-dd",
        minView:'month',
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
    }).on("click",function(){
        $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
    });
    $("#end").datetimepicker({
        format: "yyyy-mm-dd",
        minView:'month',
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
        //pickerPosition: "bottom-left"
    }).on("click",function(){
        $("#datetimeEnd").datetimepicker("setStartDate",$("#datetimeStart").val())
    });
    keywordData = {page:paGe,size:pageNum};
    load(paGe,keywordData);
    //获取公司列表
    // getComp('#firmId')

});

function load(page,date){
    var pageCount,vpage;   //初始的
    //如果有keyword，则说明是搜索
    if(date!=undefined){
        $.ajax({
            type:'get',
            url: DMBServer_url + '/web/api/activitys.json',
            data:date,
            dataType:'json',
            success:function(data){
                $("#userlist_tab .list").empty();
                if(data.code === 0){
                    var html='';
                    var cancelFlag=false;               //取消按钮是否显示
                    $.each(data.data.items,function(index,item){
                        //活动状态 -1:已结束, 0:进行中, 1:未开始
                        if(item.status===0 || item.timeStatus!=1){
                            cancelFlag=true;
                        }else{
                            cancelFlag=false;
                        }
                        var hide=cancelFlag?"hide":'';
                        var status=item.status===0?"已取消":item.timeStatus===1?"未开始":item.timeStatus===0?"进行中":"已结束";
                        html+='<tr><td><input onclick="checkDown(this)" data-id="'+item.id+'" type="checkbox"></td><td>'+ (index + 1 + page * 10) +'</td><td>'+item.title+'</td><td class="img"><img src="'+unite_img_url+(item.icon)+'"></td><td>'+new Date(item.createTime).toLocaleString()+'</td><td>'+new Date(item.begin).toDateString()+'</td><td>'+new Date(item.end).toDateString()+'</td><td>'+item.user.name+'</td><td>'+item.companyName+'</td><td>'+item.comments+'</td><td>'+item.upvotes+'</td><td>'+item.collects+'</td><td>'+status+'</td><td><button class="btn bg-info text-muted btn-dialog-tab" href="party/activity/activity/activity_detail.html" target="_blank" onclick="session(\'activity_id\','+item.id+');">查看</button></td><td><a class="btn" onclick="del(this)">删除</a><a class="btn '+hide+'" onclick="cancel(this)">取消</a></td></tr>';
                    });
                    $("#userlist_tab .list").append(html);
                    //分页
                    pageCount = data.data.pageCount;
                    vpage = pageCount>10?10:pageCount;
                    if(pageCount>1){
                        $('.pages').show();
                        flag = true;
                        if(flag){
                            initPagination('#pagination',pageCount,vpage,page+1,function(num,type){
                                if(type === 'change'){
                                    paGe = num - 1;
                                    date.page=paGe;
                                    load(paGe,date);
                                }
                            });    
                        }
                        
                    }else{
                        if(flag) {
                            paGe = 0;
                            date.page=paGe;
                            load(paGe,date);
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
//搜索查询
function search(size){
    var keyword = $("#keyword").val();
    var status=$("#status").val();
    // var firmId=$("#firmId").val();
    var begin=$("#begin").val();
    var end=$("#end").val();
    //开始时显示数据
    var dataObject = {
        page:0,
        size:size,
        keyword:keyword,
        status:status,
        // firmId:firmId,
        begin:begin,
        end:end
    };
    keywordData = dataObject;
    load(0,dataObject);
}
//删除
function del(_this){
    var id=[];
    var bool=false;
    if($(_this).parent().is('td')){
        id.push($(_this).parents("tr").find("input").attr("data-id"));
        bool=true;
    }else{
        var checkEl=$('#userlist_tab .list input[type=checkbox]:checked')
        if(checkEl.length>0){
            checkEl.each(function(){
                id.push($(this).attr('data-id'));
                bool=true;
            })    
        }else{
            returnMessage(2,'请选择至少一条数据进行删除！')
        }
    }
    if(bool) confirmMsg('你确定删除吗？',function(dialog){
                dialog.close();
                delOper(id);
                
            })
}
//删除活动操作
function delOper(id){
    $.ajax({
        type:'post',
        url:DMBServer_url + '/web/api/activity/delete.json',
        dataType:'json',
        data:{'ids':id},
        traditional:true,
        success:function(data){
            successMsg(data.code,0,'删除成功','删除失败');
            load(0,keywordData);
        },
        error:function(data){
            returnMessage(2,'删除失败');
        }
    })
}
//取消活动
function cancel(_this){
    $('#myModal').modal();
    $('#myModal .btn-primary').attr('onclick',"cancelOper("+$(_this).parents('tr').find('input').attr('data-id')+")")
    
}
blurCheck('#newForm');
function cancelOper(id){
    if($('#newForm').valid()){
        $.ajax({
            type:'post',
            url:DMBServer_url+'/web/api/activity/cancel.json',
            dataType:'json',
            data:{'id':id,'remark':$('#newForm textarea').val()},
            success:function(data){
                successMsg(data.code,0,'取消成功','取消失败');
                $('#myModal').modal('hide');
                load(0,keywordData);
            }
        })   
    }
    
}















