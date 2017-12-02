/**
 * Created by Administrator on 2017/7/3.
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
//权限初始化，先行隐藏同意和不同意
var isEdit = null;
$(document).ready(function(){
    // 补签到列表	html/duty/retroactive.html	100130003
    // 补签审批		1001300030001
    isShow("","1001300030001");
    if(isEdit){
        $(".con-oper").show();
    }else{
        $(".con-oper").hide();
    }

    //所属企业
    company(function(data){
        var company = $("#company");
        var html = '';
        $.each(data.data.company,function(index,val){
            html += '<option value="'+ val.id +'">'+ val.companyName +'</option>';
        });
        company.append(html);
    });
    label(paGe,pageNum,keyword);
});
function label(page,size,keyword){
    var pageCount,vpage;   //初始的
    //开始时显示数据
    var dataObject = {
        "userName":keyword[0],
        "paramStartTime":keyword[2],
        "paramEndTime":keyword[3],
        "reviewStatus":keyword[4],
        pageNum:page,
        pageSize:size,
        "dutyResign":{
            "companyId":keyword[1]
        }
    };
    $.ajax({
        type:'post',
        url:server_url + '/web/webDutyCtr/findSignList',
        data:JSON.stringify(dataObject),
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            const list = $(".listTable");  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 200&&data.data.content.length!=0){
                var listData = '';
                $.each(data.data.content,function(index,val){
                    var status = '-';
                    var statusBtn = '-';
                    var bur = null;
                    switch (val.resignStatus){
                        case "yes":status = '已同意';bur = 1;
                            break;
                        case "no":status = '不同意';bur = 1;
                            break;
                        case "wait":
                            if(isEdit){
                                status = '待审核';statusBtn = '<a onclick="single($(this),0)">同意</a> <a onclick="single($(this),1)">不同意</a>';
                            }else{
                                status = '待审核';statusBtn = '-';
                            }
                            break;
                    }
                    listData += ' <tr> <td><input data-bur="'+ bur +'" data-id="'+ val.id +'" type="checkbox"><i></i></td> <td>'+ (index + 1) +'</td> <td>'+ val.name +'</td> <td>'+ val.resignContent +'</td> <td>'+ (new Date(val.createTime)).toLocaleString() +'</td> <td>'+ (new Date(val.resignDate)).toLocaleString() +'</td> <td>'+ status +'</td> <td class="coazhuo"> '+ statusBtn +' </td> </tr>'
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



//**************************************************同意or不同意***********************************************************
function single(_this,bur){
    var id = _this.parents("tr").find("input[type=checkbox]").attr("data-id");
    bur = bur===0?"yes":"no";   //是在不好接yes和no
    var data = {
        "reviewStatus":bur,
        "dutyResign":{
            "id":id
        }
    };
    if(bur=='yes'){
        confirmMsg("是否同意补签？",function(dialog){
            dialog.close();
            approval(data,true);
        })
    }else{
        confirmMsg("是否不同意补签？",function(dialog){
            dialog.close();
            approval(data,true);
        })
    }
}
//**************************************************批量    同意or不同意***********************************************************
function batch(bur){
    var ids = [];var burString = true;
    var dataID = $('#main_table tbody input[type=checkbox]:checked');   //单选按钮
    $.each(dataID,function(index,val){
        ids.push($(val).attr("data-id"));   //获取id
        if(parseInt($(val).attr("data-bur")) === 1){
            burString = false;
        }
    });
    if(!burString){
        returnMessage(2,"你所选择的申请单中不满足审核条件，请重新选择！");
        return false;
    }
    if(ids.length <= 0){
        returnMessage(2,"请选择数据！");
        return false;
    }
    var data = {
        "reviewStatus":bur,
        "ids":ids
    };
    if(bur=='yes'){
        confirmMsg("是否同意补签？",function(dialog){
            dialog.close();
            approval(data,false);
        })
    }else{
        confirmMsg("是否不同意补签？",function(dialog){
            dialog.close();
            approval(data,false);
        })
    }
}



// ************************************************审批 ajax *************************************************************
function approval(data,bur){
    //用bur判断url
    var url = bur?'/web/webDutyCtr/updateSignStatusById':'/web/webDutyCtr/updateSignStatusByIds';
    $.ajax({
        type:'post',
        url: server_url + url,
        data:JSON.stringify(data),
        
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            if(data.code === 200){

                returnMessage(1,"审核成功！");

                label(paGe,pageNum,keyword);
            }else{
                //无数据提醒框
                // returnMessage(2,data.message);
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