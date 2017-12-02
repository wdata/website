var bur  = false;       //判断是否可以保存
var addId = null;    //记录添加ID
var dutyMonth = '';

$("#datetimeStart").datetimepicker({
    format: "yyyy-mm",
    startDate:(new Date()),
    minView:'year',
    startView:"year",
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
}).on("click",function(){
    $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val());
}).on("changeDate",function(ev){
    dutyMonth = ev.target.value;
    cycle(ev.target.value);
    valChange();
});

//检查某人是否已排班：
function valChange(){
    var val = $("#userName").val();
    if(val&&dutyMonth){
        var date = {
            "dutyMonth":dutyMonth,
            "duty":{
                "userId":val
            }
        };
        addId = val;
        Scheduling(date);
    }
}

$('#userName').change(function(){
    valChange();
});

$(document).ready(function(){
    //默认显示当月,获取当月格式：2017-7
    var  date = new Date();
    var month = (date.getMonth() + 1)<=9?"0" + (date.getMonth() + 1):date.getMonth() + 1;   //小于10，加0
    var sum = date.getFullYear() + "-" + month;
    // $("#datetimeStart").val(sum);  //显示默认时间
    cycle(sum);

    //所属企业
    company(function(data){
        var company = $("#company");
        company.empty();
        var html = '';
        $.each(data.data.company,function(index,val){
            html += '<option value="'+ val.id +'">'+ val.companyName +'</option>';
        });
        company.append(html);
        var companyId = data.data.company[0].id;
        if(data.code === 200){
            $.ajax({
                type:'post',
                url: server_url + '/web/managementCtr/getUserListByCompanyId',
                data:{
                    companyId:companyId
                },

                dataType:'json',
                success:function(data){
                    if(data.code === 200){
                        var optoin = '';
                        $.each(data.data,function(index,val){
                            optoin += '<option value="'+ val.id +'">'+ val.name +'&nbsp;&nbsp;&nbsp;'+ val.telNumber +'</option>';
                        });
                        $("#userName").append(optoin);
                    }else{
                        returnMessage(2,data.message)
                    }
                },
                error:function(data){
                    //报错提醒框
                    returnMessage(2,'报错：' + data.status);
                }
            });
        }
    });
});


//根据天数循环添加天数和星期  格式：2017-7
function cycle(value){
    var split = value.split("-");  //例子：2017 , 7
    var dayNumber = getDaysInOneMonth(split[0],split[1]); //获取当月天数；
    var th = '';
    var td = '';
    $(".dutyDate").remove();
    $(".form-checkbox").parent().remove();
    $(".month").text(split[1] + "月");   //显示月份
    for(var x = 1 ; x <= dayNumber; x++){
        var z = value + "-" + x;
        //获取某天是星期几
        var week = getDayNumber(z);
        //确保除星期六和星期天以外，其他默认选择状态；
        var holiday = weekDay(z);
        var checked = holiday?"":"checked";

        th += '<th class="dutyDate">'+ x +'<b class="colorWeek">'+ week +'</b></th>';
        td += '<td><input type="checkbox" '+ checked +' class="form-checkbox" value="'+ z +'"><i></i></td>';
    }
    //显示当月所有天数和星期；
    $(".work").append(th);
    //显示当月选择框
    $(".list tr").append(td);
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



//以姓名和时间判断是否排班；
function Scheduling(data){
    $.ajax({
        type:'post',
        url: server_url + '/web/webDutyCtr/getDutyEmptyByUserId',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            switch (data.code){
                case 200:bur = true;
                    break;
                case 1000:returnMessage(2,data.message);bur = false;       //数据已存在
                    break;
                case 1001:returnMessage(2,data.message);bur = false;       //用户已存在
                    break;
                default:returnMessage(2,data.message);bur = false;
                    break;
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
}
//保存值班记录
function save(){
    var sum = [];
    var time = $("#datetimeStart");
    if(!($("#userName").val()&&time.val())){
        returnMessage(2,"姓名、时间为必选项！");
        return;
    }
    if(!bur){
        returnMessage(2,"请重新输入！");
        return;
    }
    $.each($(".form-checkbox"),function(index,val){
        var dutyStatus = $(val).is(":checked")?"duty":"rest";
        var data = {
            "userId":$("#userName").val(),
            "dutyDate":$(val).val(),
            "companyId":$("#company").val(),
            "dutyStatus":dutyStatus
        };
        sum.push(data);
    });
    var data = {
        "dutyMonth":time.val(),
        "dutys":sum
    };

    $.ajax({
        type:'post',
        url: server_url + '/web/webDutyCtr/addDutyInfo',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            if(data.code === 200){
                rebackList("排班成功！");
            }else{
                returnMessage(2,data.message);
            }
        },
        beforeSend:function(){
            $('.opering-mask').show();
        },
        complete:function(){
            $('.opering-mask').hide();
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' + data.status);
        }
    });
}