var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var keyword = null;  //搜索内容
var flag = null;

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

$(document).ready(function(){
    load(paGe,pageNum);
    // getComp("#firmId");
});

function load(page,size,keyword){
    var pageCount,vpage;   //初始的
    //开始时显示数据
    var dataObject = {
        page:page,
        size:size
    };
    //如果有keyword，则说明是搜索
    if(keyword){
        dataObject["keyword"] = keyword;
    }
    $.ajax({
        type:'get',
        url: DMBserver_image_url + '/web/api/images.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            $("#userlist_tab .list").empty();
            //list.empty();  //清空
            if(data.code === 0){
                var html='';
                $.each(data.data.items,function(index,item){
                    var isShow=item.isShow===1?"":"No";
                    var status=item.status===0?"待审核":item.status===1?"通过":"不通过";
                    html+='<tr><td><input onclick="checkDown(this)" data-id="'+item.id+'" type="checkbox"></td><td>'+ (index + 1 + page * 10) +'</td><td>'+item.id+'</td><td class="img"><img src="'+unite_img_url+(item.fileName)+'" alt=""></td><td>'+item.remark+'</td><td class="yesNo '+isShow+'"><div><button></button><span></span></div></td><td>'+item.createTime+'</td><td>'+item.companyName+'</td><td>'+item.sort+'</td><td>'+ status +'</td><td class="caozhuo"><a onclick="deleteImage(this)">删除</a></td></tr>';
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
                            load(paGe,pageNum,keyword);
                        }
                    });
                }else{
                    if(flag) {
                        paGe = 0;
                        load(paGe, pageNum, keyword);
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
    search(paGe,pageNum);
    //load(paGe,pageNum);
    $(_this).siblings('input').val(num);
}
/*批量删除*/
function deleteUser(){
    if($('#userlist_tab .list input[type=checkbox]:checked').length!=0){
        var dataID = $('#userlist_tab tbody input[type=checkbox]:checked');   //单选按钮
        var id = [];
        $.each(dataID,function(index,val){
            id.push($(val).attr("data-id"));   //获取id
        });
        confirmMsg('你确认删除吗？',function(dialog){
            dialog.close();  //关闭确定提示框
            deteleImage(id);      //调用删除函数，删除列表中的图片
            $("#userlist_tab thead tr th:first input").removeAttr("checked");
        });
    }else{
        returnMessage(2,'请选择要删除的图片！')
    }
}
//删除单个
function deleteImage(_this){
    var id=[];
    id.push($(_this).parents("tr").find("input").attr("data-id"));
    confirmMsg('你确认删除吗？',function(dialog){
        dialog.close();  //关闭确定提示框
        deteleImage(id);      //调用删除函数，删除列表中的图片
    });
}
//删除图片
function deteleImage(id){
    $.ajax({
        type:'post',
        url:DMBserver_image_url+'/web/api/images/delete.json',
        data:{
            ids:id    //图片ID,数组
        },
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                //删除成功
                returnMessage(1,'删除成功！');
                load(paGe,pageNum);
            }else{
                //无数据提醒框
                returnMessage(2,'删除失败！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
function search(page,size){
    var key = $("#keyword").val();
    var begin=$("#begin").val();
    var end=$("#end").val();
    var status=$("#status").val();
    var firmId=$("#firmId").val();
    var pageCount,vpage;   //初始的
    //开始时显示数据
    var dataObject = {
        page:page,
        size:size,
        keyword:key,
        begin:begin,
        end:end,
        status:status,
        firmId:firmId
    };
    $.ajax({
        type:'get',
        url: DMBserver_image_url + '/web/api/images.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            $("#userlist_tab .list").empty();
            //list.empty();  //清空
            if(data.code === 0){
                var html='';
                $.each(data.data.items,function(index,item){
                    var isShow=item.isShow===1?"":"No";
                    var status=item.status===0?"待审核":item.status===1?"通过":"不通过";
                    html+='<tr><td><input onclick="checkDown(this)" data-id="'+item.id+'" type="checkbox"></td><td>'+(index+1)+'</td><td>'+item.id+'</td><td class="img"><img src="'+unite_img_url+(item.fileName)+'" alt=""></td><td>'+item.remark+'</td><td class="yesNo     '+isShow+'"><div><button></button><span></span></div></td><td>'+item.createTime+'</td><td>'+item.companyName+'</td><td>'+item.sort+'</td><td>'+ status +'</td><td class="caozhuo"><a onclick="deleteImage(this)">删除</a></td></tr>';
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
                            search(paGe,pageNum);
                        }
                    });
                }else{
                    if(flag) {
                        paGe = 0;
                        search(paGe, pageNum);
                        flag = false;
                        $('.pages').hide();
                    }
                }
            }else{
                //无数据提醒框
                // returnMessage(2,'暂无数据！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });

}
//是否显示切换
$(document).on("click",".list .yesNo",function(){
    var isShow=$(this).hasClass("No");
    var status=null;
    if(isShow){
        status=1;
    }else{
        status=0;
    }
    var id=[];
    id.push($(this).parents("tr").find("input").attr("data-id"));
    $.ajax({
        type:'POST',
        url: DMBserver_image_url + '/web/api/images/isshow.json',
        data:{ids:id,status:status},
        dataType:'json',
        traditional:true,
        success:function(data){
            console.log(data);
            if(data.code === 0){
                returnMessage(1,'显示状态修改成功！');
                load(paGe,pageNum);
            }else{
                returnMessage(2,'修改显示状态失败！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });


});