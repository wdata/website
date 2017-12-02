/**
 * Created by Administrator on 2017/7/4.
 */
var userEditTd = sessionStorage.getItem("modify_ID");   //ID
var month = sessionStorage.getItem("modify_month");  //月份
var name = sessionStorage.getItem("modify_name");  //姓名
var companyId = null;  //公司ID

$(document).ready(function(){
    $("#datetimeStart").val(month);
    $("#name").val(name);
    cycle(month);

    //所属企业
    company(function(data){
        var company = $("#company");
        company.empty();
        var html = '';
        $.each(data.data.company,function(index,val){
            html += '<option value="'+ val.id +'">'+ val.companyName +'</option>';
        });
        company.append(html);
    });

});

//根据天数循环添加天数和星期  格式：2017-7
function cycle(value){
    var split = value.split("-");  //例子：2017 , 7
    var dayNumber = getDaysInOneMonth(split[0],split[1]); //获取当月天数；
    var th = '';
    $(".dutyDate").remove();
    $(".month").text(split[1] + "月");   //显示月份
    for(var x = 1 ; x <= dayNumber; x++){
        var z = value + "-" + x;
        //获取某天是星期几
        var week = getDayNumber(z);
        //确保除星期六和星期天以外，其他默认选择状态；
        var holiday = weekDay(z);
        th += '<th class="dutyDate">'+ x +'<b class="colorWeek">'+ week +'</b></th>';
    }
    //显示当月所有天数和星期；
    $(".work").append(th);
}
//获取当月天数
function getDaysInOneMonth(year,month){
    month = parseInt(month, 10);
    var d= new Date(year, month, 0);
    return d.getDate();
}
//获取某天的星期
function getDayNumber(sum){
    var d = (new Date(sum)).getDay();
    var week = '';
    switch (d){
        case 0:week = "日";
            break;
        case 1:week = "一";
            break;
        case 2:week = "二";
            break;
        case 3:week = "三";
            break;
        case 4:week = "四";
            break;
        case 5:week = "五";
            break;
        case 6:week = "六";
            break;
        default:week = "空";
            break;
    }
    return week;
}
//获取某天是否是星期六和星期天
function weekDay(sum){
    var d = (new Date(sum)).getDay();
    var week = null;
    if(d === 0 || d === 6){
        week = true;
    }else{
        week = false;
    }
    return week;
}
//获取是否是当天
function TheDay(sum){
    var  date = new Date();
    var day = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return (day === sum);
}




$.ajax({
    type:'post',
    url: server_url + '/web/webDutyCtr/editDutyInfoByUserIdAnddutyMonth',
    data:JSON.stringify({
        "dutyMonth":month,
        "duty":{
            "userId":userEditTd
        }
    }),
    
    dataType:'json',
    contentType:'application/json',
    success:function(data){
        $(".form-checkbox").parent().remove();
        if(data.code === 200){
            var td = '';
            companyId = data.data[0].companyId;
            console.log(companyId);
            $.each(data.data,function(index,val){
                var checked = "";
                //duty("应上班"),sign("已上班"),resign("补签"),resign_audit("补签审核中"),leave("请假"),rest("休息"),rest_audit("请假审核中"),no_attendance("缺席");
                switch(val.dutyStatus){
                    case "duty":
                        checked = "checked";td += '<td data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'"><input type="checkbox" '+ checked +' class="form-checkbox" value="'+ val.dutyDate +'"><i></i></td>';
                        break;
                    case "sign":
                        td += '<td  data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'" class="duty-gray">出勤<input type="hidden" class="form-checkbox"  value="'+ val.dutyDate +'"></td>';
                        break;
                    case "resign":
                        td += '<td data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'" class="duty-gray">补签<input type="hidden" class="form-checkbox" value="'+ val.dutyDate +'"></td>';
                        break;
                    case "resign_audit":
                        td += '<td data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'" class="duty-gray">补签中<input type="hidden" class="form-checkbox" value="'+ val.dutyDate +'"></td>';
                        break;
                    case "leave":
                        td += '<td data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'" class="duty-red">请假<input type="hidden" class="form-checkbox" value="'+ val.dutyDate +'"></td>';
                        break;
                    case "rest":
                        checked = "";
                        td += '<td data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'"><input type="checkbox" '+ checked +' class="form-checkbox" value="'+ val.dutyDate +'"><i></i></td>';
                        break;
                    case "rest_audit":
                        td += '<td data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'" class="duty-gray">请假中<input type="hidden" class="form-checkbox" value="'+ val.dutyDate +'"></td>';
                        break;
                    case "no_attendance":
                        td += '<td data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'" class="duty-red">缺席<input type="hidden" class="form-checkbox"  value="'+ val.dutyDate +'"></td>';
                        break;
                    default:
                        td += '<td data-id="'+ val.id +'" data-status="'+ val.dutyStatus +'" class="duty-gray">空</td>';
                        break;
                }
            });
            //显示当月选择框
            $(".list tr").append(td);
        }else{
            returnMessage(2,data.message);
        }
    },
    error:function(data){
        //报错提醒框
        returnMessage(2,'报错：' + data.status);
    }
});

//保存值班记录
function save(){
    var sum = [];
    $.each($(".form-checkbox"),function(index,val){
        var dutyStatus = null;
        //判断是不是选择框
        if($(val).is("[type=checkbox]")){
            dutyStatus = $(val).is(":checked")?"duty":"rest";
        }else{
            dutyStatus = $(val).parent().attr("data-status");
        }
        var data = {
            "id":$(val).parent().attr("data-id"),
            "userId":userEditTd,
            "dutyDate":$(val).val(),
            "dutyStatus":dutyStatus,
            "companyId":companyId
        };
        sum.push(data);
    });
    var data = {
        "dutyMonth":month,
        "dutys":sum
    };
    console.log(data);
    $.ajax({
        type:'post',
        url: server_url + '/web/webDutyCtr/updateDutyInfo',
        data:JSON.stringify(data),
        
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            if(data.code === 200){
                rebackList("修改成功！");
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
}