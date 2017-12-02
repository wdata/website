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
/*//隐藏
$(".modal-footer,.modal-header").click(function(){
    $("#detail_modal").removeClass("show").removeClass("in");
});*/


var pageNum = 10;//每次页数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var keyword = [];  //搜索内容
var flag = null;

//报错列表数据
var listDataDetails = null;

var Details=null;

$(document).ready(function(){
    //日常巡检列表	html/daily/daily.html	100110001
    // 查看巡检事件详细		1001100010001
    // 删除日常巡检		    1001100010002
    // 导出日常巡检	    	1001100010003
    isShow("","","","","","1001100010003");
    //是否有权限，显示or隐藏
    //***************************************************获取设备组***********************************************************
    $.ajax({
        type:'post',
        url: server_url + '/web/common/select  ',
        data:{
            "type":2
        },
        dataType:'json',
        success:function(data){
            if(data.code === 200){
                var optoin = '';
                $.each(data.data,function(index,val){
                    optoin += '<option value="'+ val.id + '">'+ val.groupName +'</option>';
                });
                $("#equipment").append(optoin);
            }else{
                // returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
    //***************************************************报警类型***********************************************************
    $.ajax({
        type:'post',
        url:server_url + '/public/getTypeSureWarningeForJson',
        dataType:'json',
        success:function(data){
            if(data.code === 200){
                var optoin = '';
                $.each(data.data,function(index,val){
                    optoin += '<option value="'+ val.key + '">'+ val.val +'</option>';
                });
                $("#sureWarningType").append(optoin);
            }else{
                // returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
    label(paGe,pageNum,keyword);


});




function label(page,size,keyword){
    var pageCount,vpage;   //初始的
    //开始时显示数据
    var dataObject = {
        "pageNum":page,
        "pageSize":size,
        "userName":keyword[0],
        "deviceGroupId":keyword[1],
        "sureWarningType":keyword[2],
        "startTime":keyword[3],
        "endTime":keyword[4]
    };
    $.ajax({
        type:'post',
        url:server_url + '/web/dailyCheckCtr/getDailyCheckList',
        data:{
            "jsonStr":JSON.stringify(dataObject)
        },
        dataType:'json',
        success:function(data){
            const list = $(".listTable");  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 200&&data.data.content.length!=0){
                listDataDetails = data.data.content;
                var listData = '';
                $.each(data.data.content,function(index,val){
                    var BetailsWord = '-';
                    if(Details){
                        BetailsWord = '<a data-id="'+ val.id +'" onclick="details(this)" class="dailyDetails">详情</a>';
                    }
                    var createTime = (new Date(val.createTime)).toLocaleString();
                    listData += `
                        <tr>
                            <td><input type="checkbox"><i></i></td>
                            <td>${index + 1}</td>
                            <td>${val.serialNumber}</td>
                            <td>${val.address}</td>
                            <td>${val.groupName}</td>
                            <td>${val.companyName}</td>
                            <td>${tdCheck(val.userName)}</td>
                            <td>${tdCheck(val.sureWarningType)}</td>
                            <td>${tdCheck(val.solutionType)}</td>
                            <td>${tdCheck(val.currentStatus)}</td>
                            <td>${BetailsWord}</td>
                            <td>${createTime}</td>
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
    paGe = num;
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


//******************************************  详情  **************************************************
function details(_this){
    //$("#detail_modal").addClass("show").addClass("in");
    $("#detail_modal").modal("show");
    $.each(listDataDetails,function(index,val){
        if($(_this).attr("data-id") === val.id){
            $(".currentStatus").text(val.currentStatus);  //日常巡检事件
            $(".content").text(tdCheck(val.solutionDesc));   //事件描述
            $(".address").text(val.address);   //节点所在地址
            $(".name").text(tdCheck(val.userName));   //巡检人员姓名
            $(".createTime").text(tdCheck(val.createTime));   //事件时间
            //图片
            var img = '';
            var self = $("#detailsImg .img");
            $.each(val.urlList,function(index,val){
                img += `<img src="${val}">`;
            });
            self.html(img);
        }
    })

}
