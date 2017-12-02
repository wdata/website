var node_id=sessionStorage.getItem("node_id");
var group_id='';
//报警列表的
var flag_warning=false;
var paGe = 1;   //第几页  修改时，出现在被修改页面
//维保历史的参数
var page=1;
var flag=false;
$(document).ready(function(){
    $.ajax({
        type:'post',
        url: server_url + '/web/device/getDeviceInfo',
        data:{id:node_id},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                group_id=data.data.groupId;
                load(1,{'currentPage':1,'pageSize':5,'groupId':group_id},server_url+'/web/device/searchDeviceMaintences.json','post');
                waring_list(page,{currentPage:page,pageSize:5,groupId:group_id});
                $.ajax({
                    type:'post',
                    url: server_url + '/web/device/getAllBuildingDevices',
                    data:{id:node_id},
                    dataType:'json',
                    success:function(data){
                        if(data.code==200){
                            var html='';
                            var date=data.data.reverse();
                            $.each(date,function(index,item){
                                if(item.count!=0){
                                    var text="",floor=null;
                                    $.each(item.list,function(index,icon){
                                        var status1=icon.onlineStatus=="fault"?"fault":icon.onlineStatus=="alarm"?"alarm":icon.onlineStatus=="offline"?"offline_icon":"normal";
                                        var status2=icon.onlineStatus=="fault"?"fault_":icon.onlineStatus=="alarm"?"alarm_":icon.onlineStatus=="offline"?"offline_icon":"normal_";
                                        floor=icon.floor;
                                        var img_name=icon.id==node_id?status2:status1;
                                        text+='<a onclick="houseId(\''+icon.id+'\',\''+icon.warningId+'\')"><span><img src="../../images/'+img_name+'.png" alt=""></span></a>';
                                    });
                                }else{
                                    text="",floor=1;
                                }
                                var floor_='';
                                if(item.count>=5){
                                    floor_='<div data_id="'+item.floor+'" onclick="node_list(this)" class="img_btn"><div class="img_total"><img src="../../images/normal.png" alt=""><i>'+item.count+'</i></div></div>';
                                }else{
                                    floor_='<div class="img_btn" >'+text+'</div>';
                                }
                                html+='<div class="swiper-slide"><i>'+floor+'楼</i><img src="../../images/ceng.png" alt="">'+floor_+'</div>';
                            });
                            $(".swiper-container .swiper-wrapper").html(html);
                            var num=data.data.length>=5?5:data.data.length;
                            $(".floor>.swiper .swiper-container").css("height",num*100+"px");
                            var mySwiper = new Swiper('.floor_swiper',{
                                direction : 'vertical',
                                slidesPerView:num,
                                slidesPerGroup:num,
                                initialSlide:data.data.length
                            });
                        }else{
                            returnMessage(2, data.message);
                        }
                    },
                    error:function(data){
                        //报错提醒框
                        returnMessage(2,'报错：' +  data.status);
                    }
                });
                var lineStatus=data.data.onlineStatus=="normal"?"正常":data.data.onlineStatus=="alarm"?"报警":data.data.onlineStatus=="fault"?"故障":data.data.onlineStatus=="offline"?"离线":"-";
                var currentStatus=data.data.currentStatus=="alarm"?"报警中":data.data.currentStatus=="receive"?"已报警":data.data.currentStatus=="processing"?"处理中":data.data.currentStatus=="declare"?"故障申报":data.data.currentStatus=="applyfor"?"申报维保":data.data.currentStatus=="complete"?"完成":"-";
                $("#currentStatus").html(currentStatus);
                $("#lineStatus").html(lineStatus);
                $("#warningDesc").html(tdCheck(data.data.warningDesc));
                if(data.data.startTime!=null){
                    $("#warningTime").html(new Date(data.data.startTime).toLocaleString());
                }else{
                    $("#warningTime").html("-");
                }
                    $("#serialNumber").html(data.data.serialNumber);
                $("#deviceName").html(data.data.deviceName);
                $("#gatewayEui").html(data.data.gatewayEui);
                $("#gatewayName").html(data.data.gatewayName);
                $("#address").html(data.data.mergerName);
                $("#longitude").html(data.data.longitude);
                $("#latitude").html(data.data.latitude);
                $("#groupName").html(data.data.groupName);
                $("#companyName").html(data.data.companyName);
                $("#floorMax").html(data.data.floorMax);
                $("#floor").html(data.data.floor);
                $("#manager").html(data.data.manager);
                $("#patrol").html(data.data.patrol);
                $("#createTime").html(new Date(data.data.createTime).toLocaleString());
                $(".map").addClass("hide");
                $(".floor").removeClass("hide");
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
    //维保报警按钮切换
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
});
function houseId(house_id,warningId){
    sessionStorage.setItem("house_id",house_id);
    sessionStorage.setItem("warningId",warningId);
    $("#map_frame", window.parent.document).attr("src","house.html");
}

//维保历史列表
function load(pag,elem,url,type){
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
                            initPagination('#pagination',pageCount,1,pag,function(num,type){
                                if(type=='change'){
                                    page=num;
                                    elem.currentPage=num;
                                    load(num,elem,url,'post');
                                }
                            })
                        }else{
                            $('#page2').hide();
                            if(flag){
                                load(1,elem,url,'post');
                                flag=false;
                                $('#page2').hide();
                            }
                        }
                    }else{
                        code=`<td colspan="18" class="tc">当前条件下无数据展示</td>`;
                        $('#page2').hide();
                    }
                    $('#alarm_table .list').html(code);
                }else{
                    $('#alarm_table .list').html(`<td colspan="18" class="tc">当前条件下无数据展示</td>`);
                }
            }
        })
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
                        var startTime=new Date(item.startTime).toLocaleString();
                        var endTime=new Date(item.endTime).toLocaleString();
                        html+=
                            `<tr>
                                <td><input data-id="${item.id}" type="checkbox" name=""><i></i></td>
                                <td>${index + 1}</td>
                                <td>${item.warningDesc}</td>
                                <td>${item.deviceName}</td>
                                <td>${item.serialNumber}</td>
                                <td>${warningType}</td>
                                <td>${item.address}</td>
                                <td>${startTime}</td>
                                <td>${endTime}</td>
                                <td class="statues" data_status="${item.currentStatus}">${currentStatus}</td>
                                <td>${item.manager}</td>
                                <td>${item.patrol}</td>
                                <td>${item.groupName}</td>
                                <td>${item.companyName}</td>
                                <td>${item.sureWarningType}</td>
                            </tr>`;

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

/*时间处理*/
function dateDeal(elem){
    if(elem){
        return (new Date(elem)).toLocaleString();
    }else{
        return "-"
    }
}

function node_list(_this){
    var current_floor=$(_this).attr("data_id");
    $.ajax({
        type:'post',
        url: server_url + '/web/device/getAllBuildingDevices',
        data:{id:node_id},
        dataType:'json',
        beforeSend: function () {
            $('.opering-mask').show();
            $(this).attr("disabled",true);
        },
        complete: function () {
            $('.opering-mask').hide();
            $(this).attr("disabled",false);
        },
        success:function(data){
            if(data.code==200){
                var html='';
                var date=data.data.reverse();
                $.each(date,function(index,item){
                   if(item.floor==current_floor){
                        $.each(item.list,function(index,icon){
                            var status1=icon.onlineStatus=="fault"?"fault":icon.onlineStatus=="alarm"?"alarm":icon.onlineStatus=="offline"?"offline_icon":"normal";
                            var lineStatus=icon.onlineStatus=="normal"?"正常":icon.onlineStatus=="alarm"?"报警":icon.onlineStatus=="fault"?"故障":icon.onlineStatus=="offline"?"离线":"-";
                            html+=` <li onclick="houseId('${icon.id}','${icon.warningId}')">
                        <div class="status"><img src="../../images/${status1}.png"></div>
                        <div class="node_mes">
                            <div class="node_name"><span class="nodeName">节点名称：<i>${tdCheck(icon.deviceName)}</i></span><span class="item">设备状态：<i>${lineStatus}</i></span></div>
                            <div class="node_num">节点编号：<i>${tdCheck(icon.serialNumber)}</i></div>
                        </div>
                    </li>`;
                        })
                   }
                });
                $("#nade_modal .floor_list").html(html);
                $("#nade_modal").modal();
            }else{
                returnMessage(2, data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
