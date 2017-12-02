var house_id=sessionStorage.getItem("house_id");
var warningId=[];
if(sessionStorage.getItem("warningId")!=="null"){
    warningId.push(sessionStorage.getItem("warningId"));
}
var status='';
//报警列表的
var flag_warning=false;
var paGe = 1;   //第几页  修改时，出现在被修改页面
//维保历史的参数
var page=1;
var flag=false;
$(document).ready(function(){
    //查看户型图啊
    load();
    tab_load(1,{'currentPage':1,'pageSize':5,'id':house_id},server_url+'/web/device/searchDeviceMaintences.json','post');
    waring_list(1,{currentPage:1,pageSize:5,id:house_id});
    $(".history>.item").click(function(){
        $(".history>.item").removeClass("hover");
        $(this).addClass("hover");
        if($(this).attr("class").indexOf("maintenance")!=-1){
            $(".waring_list").hide();
            $(".alarm_table").show();
        }else{
            $(".alarm_table").hide();
            $(".waring_list").show();
        }
    })
    $(".head_title>.item").click(function(){
        $(".head_title>.active").removeClass("active");
        $(this).addClass("active");
        if($(this).attr('class').indexOf("effectImg")!=-1){
            $("img.houseImg").hide();
            $("img.houseImg+span").hide();
            $("img.effectImg").show();
        }else{
            $("img.effectImg").hide();
            $("img.houseImg").show();
            $("img.houseImg+span").show();
        }
    })
});
function load(){
    $.ajax({
        type:'post',
        url: server_url + '/web/device/getDeviceInfo',
        data:{id:house_id},
        headers:{userId:1},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                var lineStatus=data.data.onlineStatus=="normal"?"正常":data.data.onlineStatus=="alarm"?"报警":data.data.onlineStatus=="fault"?"故障":data.data.onlineStatus=="offline"?"离线":"-";
                status=data.data.currentStatus;
                var currentStatus=data.data.currentStatus=="alarm"?"报警中":data.data.currentStatus=="receive"?"已报警":data.data.currentStatus=="processing"?"处理中":data.data.currentStatus=="declare"?"故障申报":data.data.currentStatus=="applyfor"?"申报维保":data.data.currentStatus=="complete"?"完成":"-";
                $("#currentStatus").html(currentStatus);
                $("#lineStatus_h").html(lineStatus);
                $("#warningDesc_h").html(tdCheck(data.data.warningDesc));
                if(data.data.startTime!=null){
                    $("#warningTime_h").html(new Date(data.data.startTime).toLocaleString());
                }else{
                    $("#warningTime_h").html("-");
                }
                $("#serialNumber_h").html(data.data.serialNumber);
                $("#deviceName_h").html(data.data.deviceName);
                $("#gatewayEui_h").html(data.data.gatewayEui);
                $("#gatewayName_h").html(data.data.gatewayName);
                $("#address_h").html(data.data.mergerName);
                $("#longitude_h").html(data.data.longitude);
                $("#latitude_h").html(data.data.latitude);
                $("#groupName_h").html(data.data.groupName);
                $("#companyName_h").html(data.data.companyName);
                $("#floorMax_h").html(data.data.floorMax);
                $("#floor_h").html(data.data.floor);
                $("#createTime").html(new Date(data.data.createTime).toLocaleString());
                $("#manager").html(data.data.manager);
                $("#patrol").html(data.data.patrol);
                $("#telNumber_h").html(data.data.telNumber);
                $(".house .swiper .houseImg").attr("src",data.data.showUrl);
                $(".house .swiper .effectImg").attr("src",data.data.effectUrl);
                $(".house .swiper span").css({"left":data.data.planeX+"%","top":data.data.planeY+"%"});
                $(".house .swiper span").addClass(data.data.onlineStatus);
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
//维保I
function maintenance(_id){
    console.log(_id);
    if(_id.length!=0) {
        var isSend = status == "declare" ? true : false;
        if (isSend) {
            $.ajax({
                type: 'post',
                url: server_url + '/web/warning/applyforMaintence',
                data: JSON.stringify({ids: _id}),
                dataType: 'json',
                headers: {userId: 1},
                contentType: 'application/json',
                traditional: true,
                beforeSend: function () {
                    $('.opering-mask').show();
                },
                complete: function () {
                    $('.opering-mask').hide();
                },
                success: function (data) {
                    if (data.code == 200) {
                        returnMessage(1, data.message);
                        load();
                    } else {
                        returnMessage(2, data.message);
                    }
                },
                error: function (data) {
                    //报错提醒框
                    returnMessage(2, '报错：' + data.status);
                }
            });
        } else {
            returnMessage(2, "当前报警处理状态不能发送维保请求");
        }
    }else{
        returnMessage(2,"节点状态正常,不能发送维保请求！！");
    }
}
//报警推送
function warning_push(_id){
    if(_id.length!=0){
        $.ajax({
            type:'post',
            url: server_url + '/web/warning/manualSendWarnings',
            data:JSON.stringify({ids:_id}),
            dataType:'json',
            headers:{userId:1},
            contentType: 'application/json',
            traditional:true,
            beforeSend: function () {
               $('.opering-mask').show();
            },
            complete: function () {
                $('.opering-mask').hide();
            },
            success:function(data){
                if(data.code==200){
                    returnMessage(1,data.message);
                }else{
                    returnMessage(2,data.message);
                }
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }else{
        returnMessage(2,"节点状态正常,不能进行推送操作！！");
    }
}
//查看效果图
function effectImg(_this){
    //$(_this).css("width","100%");
    //$(".house .swiper>.houseImg").hide();
    //$(".house .swiper>.isShow").show();
}

//维保报警按钮切换
function tab_load(page,elem,url,type){
    var pageCount,vpage;
    $.ajax({
        type:type,
        url:url,
        dataType:'json',
        data:elem,
        success:function(data){
            if(data.code=200 && data.data!=null){
                var oData=data.data;
                var code="";
                if(oData.totalElements>0){
                    $.each(oData.content,function(index,item){
                        var n=item.currentStatus;
                        var status=item.onlineStatus=="normal"?'正常':item.onlineStatus=="alarm"?'报警':item.onlineStatus=="fault"?"故障":"离线";
                        var dealStatus=n=="alarm"?'报警中':n=="receive"?'已接警':n=="processing"?"处理中":n=='declare'?'故障申报':n=="applyfor"?'申请维保':'完成';
                        code+=`
								<tr>
									<td><input type="checkbox" data-id=${item.id}><i></i></td>
									<td>${index+1}</td>serialNumber
									<td>${tdCheck(item.deviceName)}</td>groupName
									<td>${tdCheck(item.serialNumber)}</td>
									<td>${tdCheck(item.gatewayNum)}</td>
									<td>${tdCheck(item.groupName)}</td>
									<td>${tdCheck(status)}</td>
									<td>${tdCheck(item.warningDesc)}</td>
									<td>${dateDeal(item.startTime)}</td>
									<td>${tdCheck(item.solutionDesc)}</td>
									<td>${tdCheck(item.mergerName)}</td>
									<td>${tdCheck(item.manager)}</td>
									<td>${tdCheck(item.patrol)}</td>
									<td>${tdCheck(item.companyName)}</td>
									<td>${tdCheck(dealStatus)}</td>
								</tr>
							`;
                    });
                    pageCount=oData.totalPages;
                    $('#page2 .total span').text(pageCount);
                    if(pageCount>1){
                        flag=true;
                        $('#page2').show();
                        initPagination('#pagination',pageCount,1,page,function(num,type){
                            if(type=='change'){
                                page=num;
                                elem.currentPage=num;
                                tab_load(num,elem,url,'post');
                            }
                        })
                    }else{
                        $('#page2').hide();
                        if(flag){
                            tab_load(1,elem,url,'post')
                            flag=false;
                            $('#page2').hide();
                        }
                    }
                }else{
                    code=`<td colspan="18" class="tc">当前条件下无数据展示</td>`;
                    $('.pageing').hide();
                }
                $('#alarm_table .list').html(code);
            }else{
                $('#alarm_table .list').html(`<td colspan="18" class="tc">当前条件下无数据展示</td>`);
            }
        }
    })
}
/*时间处理*/
function dateDeal(elem){
    if(elem){
        return (new Date(elem)).toLocaleString();
    }else{
        return "-"
    }
}
//报警列表
function waring_list(pag,date){
    var pageCount;   //初始的
    //如果有keyword，则说明是搜索
    if(date!=undefined){
        $.ajax({
            type:'post',
            url: server_url + '/web/warning/searchUnsolvedWarnings',
            data:date,
            dataType:'json',
            success:function(data){
                $("#waring_list tbody").empty();
                if(data.code === 200){
                    var html='';
                    $.each(data.data.content,function(index,item){
                        var currentStatus=item.currentStatus=="alarm"?"报警中":item.currentStatus=="receive"?"已报警":item.currentStatus=="processing"?"处理中":item.currentStatus=="declare"?"故障申报":item.currentStatus=="applyfor"?"申请维保":item.currentStatus=="complete"?"完成":"";
                        var warningType=item.warningType=="fire_alarm"?"火警报警":item.warningType=="device_fault"?"故障报警":"";
                        html+='<tr><td><input data-id="'+item.id+'" type="checkbox" name=""><i></i></td><td>'+(index+1)+'</td><td>'+item.warningDesc+'</td><td>'+item.deviceName+'</td><td>'+item.serialNumber+'</td><td>'+warningType+'</td><td>'+item.address+'</td><td>'+new Date(item.startTime).toLocaleString()+'</td><td>'+new Date(item.endTime).toLocaleString()+'</td><td class="statues" data_status="'+item.currentStatus+'">'+currentStatus+'</td><td>'+item.manager+'</td><td>'+item.patrol+'</td><td>'+item.groupName+'</td><td>'+item.companyName+'</td><td>'+item.sureWarningType+'</td></tr>';

                    });
                    $("#waring_list tbody").html(html);
                    //分页
                    pageCount = data.data.totalPages;//总页数
                    $("#page1 .total .num").text(pageCount);
                    if(pageCount>1){
                        $('#page1').removeClass("undis");
                        $("#page1 .total").removeClass("hide");
                        flag_warning = true;
                        initPagination('#pagination_war',pageCount,1,pag,function(num,type){
                            if(type === 'change'){
                                paGe = num;
                                date.currentPage=paGe;
                                waring_list(paGe,date);
                            }
                        });
                    }else{
                        $('#page1').addClass("undis");
                        if(flag_warning) {
                            paGe = 0;
                            date.currentPage=paGe;
                            waring_list(paGe,date);
                            flag_warning = false;
                        }
                    }
                }else if(data.code==204){
                    $("#waring_list tbody").html('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
                }else{
                    //无数据提醒框
                    $('#page1').addClass("undis");
                    returnMessage(2,data.message);
                }
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }
}
