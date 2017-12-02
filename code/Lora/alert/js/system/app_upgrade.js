/**
 * Created by Administrator on 2017/7/7.
 */
$("#datetimeStart").datetimepicker({
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
$("#datetimeEnd").datetimepicker({
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


var pageNum = 10;//每次页数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var keyword = [];  //搜索内容
var flag = null;
var isAdd=null,isEdit=null;
$(document).ready(function(){
    // app升级管理	html/system/app_upgrade.html	100110006
    // 添加app升级		1001400060001
    // 启用app		1001400060002
    isShow("1001400060001","1001400060002");
    isAdd?$(".oper").removeClass("undis"):$(".oper").addClass("undis");
    label(paGe,pageNum,keyword);
});
function label(page,size,keyword){
    var pageCount,vpage;   //初始的
    //开始时显示数据
    var dataObject = {
        pageNum:page,
        pageSize:size,
        "upgradeType":keyword[0],
        "startTime":keyword[1],
        "endTime":keyword[2]
    };
    $.ajax({
        type:'post',
        url:server_url + '/web/appManager/getAppManagerList',
        data:dataObject,
        dataType:'json',
        success:function(data){
            const list = $(".listTable");  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 200){
                if(data.data.content.length!=0){
                    var listData = '';
                    $.each(data.data.content,function(index,val){
                        var upgradeType = '';
                        switch(val.upgradeType){
                            case "choose":upgradeType = "确认升级";
                                break;
                            case "mandatory":upgradeType = "强制升级";
                                break;
                        }
                        var enable = '';
                        switch(val.enable){
                            case false:
                                if(isEdit){
                                    enable = '<a data-id="'+ val.id +'" onclick="enabled(this)">启用</a>';
                                }else{
                                    enable = '<a class="" data-id="'+ val.id +'">启用</a>';
                                }
                                break;
                            case true:enable = '已启用';
                                break;
                        }
                        var  createTime=(new Date(val.createTime)).toLocaleString();
                        listData +=`
                            <tr>
                                <td>${(index + 1)}</td>
                                <td>${val.name}</td>
                                <td>${val.version}</td>
                                <td>${val.size}</td>
                                <td>${upgradeType}</td>
                                <td>${val.androidDownloadUrl}</td>
                                <td>${createTime}</td>
                                <td class="coazhuo">${enable}</td>
                            </tr>`;
                    });
                    list.append(listData);
                    //分页
                    pageCount = data.data.totalPages;
                    vpage = pageCount>10?10:pageCount;
                    $(".total span").text(data.data.totalPages);
                    if(pageCount>1){
                        $('.undis').show();
                        flag = true;
                        initPagination('#pagination',pageCount,1,page,function(num,type){
                            if(type === 'change'){
                                paGe = num ;
                                label(paGe,pageNum,keyword);
                            }
                        });
                    }else{
                        if(flag){
                            paGe = 0;
                            label(paGe,pageNum,keyword);
                            flag = false;
                            $('.undis').hide();
                        }
                    }
                }else{
                    list.append('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
                    $('.undis').hide();
                }
            }else{
                //无数据提醒框
                // returnMessage(2,data.message);
                list.append('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
                $('.undis').hide();
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
    label(paGe,pageNum);
    $(_this).siblings('input').val(num);
}

//******************************************  搜索  **************************************************
function search(){
    keyword = [];
    $.each($('.clearfix .form-control'),function(index,val){
        keyword.push($(val).val())
    });
    paGe = 1;   //如果在1以上页面，则返回1页面并搜索内容
    label(paGe,pageNum,keyword);
}

// ************************************************ 启用 *************************************************************
function enabled(_this){
    var id = $(_this).attr("data-id");
    $.ajax({
        type:'post',
        url: server_url + "/web/appManager/updateAppManager",
        data:{
            aid:id
        },
        
        dataType:'json',
        // contentType:'application/json',
        success:function(data){
            if(data.code === 200){
                returnMessage(1,"启用成功！");
                label(paGe,pageNum,keyword);
            }else{
                //无数据提醒框
                 returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
}

//Enter
function searchKey(e){
    if(e.keyCode==13){
        search();
    }
}