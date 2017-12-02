var mondifyMonth = null;      //给修改的时间

var pageNum = 10;//每次页数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var keyword = [];  //搜索内容
var flag = null;
var isAdd=null,isEdit=null;
var pitch = [];  //需要删除的设备

$("#datetimeStart").datetimepicker({
    format: "yyyy-mm",
    minView:'month',
    //startView:"month",
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
}).on("click",function(){
    $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val());
}).on("changeDate",function(ev){
    cycle(ev.target.value);
    keyword = [];
    $.each($('.clearfix .form-control'),function(index,val){
        keyword.push($(val).val())
    });
    paGe = 1;   //如果在1以上页面，则返回1页面并搜索内容
    label(paGe,pageNum,keyword);
});
$(document).ready(function(){
    // 值班管理列表	html/duty/duty.html	100130001
    // 添加值班人员		1001300010001
    // 修改值班人员		1001300010002
    // 删除值班人员		1001300010003
    isShow("1001300010001","1001300010002");

    //是否有权限，显示or隐藏
    if(isAdd){
        $(".oper").removeClass("hide");
    }else{
        $(".oper").hide();
    }

    //默认显示当月,获取当月格式：2017-7
    var  date = new Date();
    var month = (date.getMonth() + 1)<=9?"0" + (date.getMonth() + 1):date.getMonth() + 1;   //小于10，加0
    var sum = date.getFullYear() + "-" + month;
    $("#datetimeStart").val(sum);  //显示默认时间
    cycle(sum);

    //需要默认传递时间
    keyword = [];
    $.each($('.clearfix .form-control'),function(index,val){
        keyword.push($(val).val())
    });
    paGe = 1;   //如果在1以上页面，则返回1页面并搜索内容
    label(paGe,pageNum,keyword);


    //所属企业
    company(function(data){
        var company = $("#company");
        var html = '';
        $.each(data.data.company,function(index,val){
            html += '<option value="'+ val.id +'">'+ val.companyName +'</option>';
        });
        company.append(html);
    });
});
//根据天数循环添加天数和星期  格式：2017-7
function cycle(value){
    mondifyMonth = value;
    var split = value.split("-");  //例子：2017 , 7
    var dayNumber = getDaysInOneMonth(split[0],split[1]); //获取当月天数；
    var th = '';
    $(".dutyDate").remove();
    for(var x = 1 ; x <= dayNumber; x++){
        //console.log(value + "-" + x);
        var week = getDayNumber(value + "-" + x);
        var the = TheDay(value + "-" + x)?"the-green dutyDate":"dutyDate";
        th += '<th class="'+ the +'">'+ x +'<b class="colorWeek">'+ week +'</b></th>';
    }
    $(".theadStatus").before(th);
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
    console.log(d);
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
//获取是否是当天
function TheDay(sum){
    var  date = new Date();
    var day = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return (day === sum);
}


function label(page,size,keyword){
    var pageCount;   //初始的
    //开始时显示数据
    // page:page,
    // size:size
    var dataObject = {
        "userName":keyword[0],
        "companyId":keyword[1],
        "dutyMonth":keyword[2],
        pageSize:size,
        pageNum:page
    };
    $.ajax({
        type:'post',
        url:server_url + '/web/webDutyCtr/findDutyList',
        data:{
            "jsonStr":JSON.stringify(dataObject)
        },
        dataType:'json',
        success:function(data){
            const list = $(".listTable");  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 200){
                if(data.data.content.length!=0){
                    var listData = '';
                    var sum = 1;
                    $.each(data.data.content,function(index,val){
                        var td = '';
                        $.each(val.dutyList,function(x,y){
                            //duty("应上班"),sign("已上班"),resign("补签"),resign_audit("补签审核中"),leave("请假"),rest("休息"),rest_audit("请假审核中"),no_attendance("缺席");
                            switch(y.dutyStatus){
                                case "duty":td += '<td class="duty-green">应上班</td>';
                                    break;
                                case "sign":td += '<td class="duty-gray">已上班</td>';
                                    break;
                                case "resign":td += '<td class="duty-gray">补签</td>';
                                    break;
                                case "resign_audit":td += '<td class="duty-gray">补签中</td>';
                                    break;
                                case "leave":td += '<td class="duty-red">请假</td>';
                                    break;
                                case "rest":td += '<td class="duty-red">休息</td>';
                                    break;
                                case "rest_audit":td += '<td class="duty-gray">请假中</td>';
                                    break;
                                case "no_attendance":td += '<td class="duty-red">缺席</td>';
                                    break;
                                default:td += '<td class="duty-gray">空</td>';
                                    break;
                            }
                        });
                        var edit = '-';
                        if(isEdit){
                            edit = '<a onclick="modify(this)" href="duty/duty_edit.html">修改</a>';
                        }
                        listData += '<tr> <td><input  data-id="'+ val.userId +'" type="checkbox" name="test" class="check-box"><i></i></td> <td>'+ sum +'</td> <td class="name">'+ val.userName +'</td> '+ td +' <td class="coazhuo"> '+ edit + '</td> </tr>';
                        sum ++;
                    });
                    list.append(listData);
                    pageCount = data.data.totalPages;
                    $('.pageing .total span').text(pageCount);
                    if(pageCount>1){
                        flag=true;
                        $('.pageing').show();
                        initPagination('#pagination',pageCount,1,page,function(num,type){
                            if(type=='change'){
                                paGe=num;
                                label(paGe,pageNum,keyword);
                            }
                        });
                    }else{
                        $('.pageing').hide();
                        if(flag){
                            label(paGe,pageNum,keyword);
                            flag=false;
                            $('.pageing').hide();
                        }
                    }
                }else{
                    //无数据提醒框
                    list.append('<tr><td style="text-align: center" colspan="35">当前条件下无数据展示！！！</td></tr>');
                    $('.undis').hide();
                }
            }else{
                 returnMessage(2,data.message);
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

    //  添加一个判断，时间框不能为空，以此解决不点击插件，直接删除时间然后在搜索问题；
    if($("#datetimeStart").val().length<= 0){
        returnMessage(2,"请输入时间！");
        return false;
    }

    label(paGe,pageNum,keyword);
}
//******************************************  修改  **************************************************
function modify(_this){
    sessionStorage.setItem("modify_ID",$(_this).parent().siblings("td").find("input[type=checkbox]").attr("data-id"));
    sessionStorage.setItem("modify_month",mondifyMonth);
    sessionStorage.setItem("modify_name",$(_this).parent().siblings(".name").text());
}
//批量删除
function dutyDelete() {
  pitch = [];
    $('table tbody input[type=checkbox]:checked').each(function() {
        pitch.push($(this).attr('data-id'));
    });
    console.log(pitch);

    if(pitch == '') {
        returnMessage(2, '请先选择要删除的消息');
    } else {
        msgShow('type-danger','请确认是否需要执行删除操作？','btn-danger','type-default',function(dialog){
            deleteDevice();
            dialog.close();
        });
    }
}
function deleteDevice() {
  $.ajax({
    type:'post',
    url:server_url+'/web/webDutyCtr/deleteDutyInfomation',
    dataType:'json',
    contentType:"application/json; charset=utf-8",
    data:JSON.stringify({
      "date": mondifyMonth,
      "ids":pitch
    }),
    success:function(data){
      if(data.code==200){
        returnMessage(1, data.message);
        search();
      } else {
        returnMessage(2, data.message)
      }
    },
    error: function (data) {
      returnMessage(2,data.message);
    }
  })
}


//Enter
function searchKey(e){
    if(e.keyCode==13){
        search();
    }
}



