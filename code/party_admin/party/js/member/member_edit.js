/**
 * Created by Administrator on 2017/7/1.
 */

$(document).ready(function(){
    $("#birthday").datetimepicker({
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
    }).on('changeDate',function(){
        if($(this).val()){
            $(this).siblings('.error').hide();
            $(this).removeClass('error').addClass('valid')
        }
    });
    $("#joinPartyDate").datetimepicker({
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
    }).on('changeDate',function(){
        if($(this).val()){
            $(this).siblings('.error').hide();
            $(this).removeClass('error').addClass('valid')
        }
    });
    $("#changeDate").datetimepicker({
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
    }).on('changeDate',function(){
        if($(this).val()){
            $(this).siblings('.error').hide();
            $(this).removeClass('error').addClass('valid')
        }
    });
    blurCheck($("#newForm"));
});

console.log(sessionStorage.getItem("modify_Id"));
var modify_Id = sessionStorage.getItem("modify_Id");


//修改 -- 函数 ******************************************数据详情*****************************************************
$.ajax({
    type:'get',
    url:  DMBServer_url +  '/web/api/user/'+ modify_Id +'.json',
    data: {},
    dataType:'json',
    success:function(data){
        if(data.code === 0){

            $("#id").val(data.data.id);    ///id
            $("#name").val(data.data.name);  //名字
            $("#phone").val(data.data.phone);   //电话
            //性别
            switch(data.data.sex){
                case -1:$("#unknown").attr("checked","");
                    break;
                case 0:$("#Female").attr("checked","");
                    break;
                case 1:$("#male").attr("checked","");
                    break;
            }
            $("#birthday").val(data.data.birthday); //出生日期
            //学历
            $.each($("#degree option"),function(index,val){
                if($(val).val() === data.data.degree){
                    $(this).attr("selected","");
                }
            });
            var firmId = data.data.firmId;
            var organId = data.data.organId;
            //组织
            $.ajax({
                type:'get',
                url:  DMBServer_url +  '/web/api/organizations.json',
                data: {
                    firmId:firmId
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        var html = '';
                        $.each(data.data,function(index,val){
                            if(val.id === organId){
                                html += '<option selected value="'+ val.id +'">'+ val.name+'</option>';
                            }else{
                                html += '<option value="'+ val.id +'">'+ val.name+'</option>';
                            }
                        });
                        $("#organization").append(html);
                    }else{
                        // returnMessage(2,'暂无数据');
                    }
                },
                error:function(data){
                    //报错提醒框
                    returnMessage(2,'报错：' +  data.status);
                }
            });

            //职位
            var jobs = [];
            //如果有职位则，将职位ID放入数字中
            if(data.data.jobs){
                $.each(data.data.jobs,function(index,val){
                    jobs.push(val.id);
                })
            }
            //获取所有职位
            $.ajax({
                type:'get',
                url:  DMBServer_url +  '/web/api/jobs.json',
                data: {},
                dataType:'json',
                success:function(data){
                    var josbElement =  $("#jobs");
                    josbElement.empty();
                    if(data.code === 0){
                        var html = '';
                        $.each(data.data,function(index,val){
                            //判断是否有原来的职位
                            if(jobs.length > 0){
                                var bur = true;  //作为显示原职位判断
                                //遍历原职位，并勾选
                                $.each(jobs,function(x,y){
                                    console.log(y === val.id);
                                    if(y === val.id){
                                        html += '<label class="checkbox-inline"> <input type="checkbox" checked value="'+ val.id +'"> '+ val.name +' </label>';
                                        bur = false;
                                    }
                                });
                                if(bur){
                                    html += '<label class="checkbox-inline"> <input type="checkbox"  value="'+ val.id +'"> '+ val.name +' </label>';
                                }
                            }else{
                                html += '<label class="checkbox-inline"> <input type="checkbox"  value="'+ val.id +'"> '+ val.name +' </label>';
                            }
                        });
                        josbElement.append(html);
                    }else{
                        // returnMessage(2,'暂无数据');
                    }
                },
                error:function(data){
                    //报错提醒框
                    returnMessage(2,'报错：' +  data.status);
                }
            });
            $("#joinPartyDate").val(data.data.joinPartyDate);   //入党时间
            $("#changeDate").val(data.data.changeDate);    //迁入组织时间
            //身份类型
            $.each($("#type option"),function(index,val){
                if(parseInt($(val).val()) === data.data.type){
                    $(this).attr("selected","");
                }
            });


        }else{
            returnMessage(2,'暂无数据');
        }
    },
    error:function(data){
        //报错提醒框
        returnMessage(2,'报错：' +  data.status);
    }
});

//****************************************************修改上传*****************************************************
function determine(){
    //修改,调用修改ajax
    //职位ID
    var jobs = [];
    //遍历checked，获取选择向Id
    $.each($("#jobs input:checked"),function(index,val){
        jobs.push($(val).val());
    });
    if(jobs.length > 3){
        returnMessage(2,'最多只能选择三个职位');
        return false;
    }
    //将ID数据添加的input中
    $("#jobIds").val(jobs);
    var form = $("#newForm").serialize();   //序列化
    $.ajax({
        type:'POST',
        url: DMBServer_url + '/web/api/user/update.json',
        data: form,
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){

                returnMessage(1,'修改成功');

            }else{
                //data.code === -1
                returnMessage(2,'修改失败data.code为：' + data.code);
            }
        },
        beforeSend:function(){
            $('.opering-mask').show().find('.con').text('正在处理中，处理结束后该弹窗消失！');
        },
        complete:function(){
            $('.opering-mask').hide()
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}