var pageNum = 5;//每次条数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var flag = null;
var node_id = null;//节点ID
var map = new BMap.Map("allmap");// 创建Map实例
map.centerAndZoom(new BMap.Point(110.404, 31.515), 5); // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 允许滚轮缩放
var companyId=sessionStorage.getItem("companyID");

$(document).ready(function(){
    poly();
    load(paGe,{userId:1,currentPage:paGe,pageSize:pageNum,companyId:companyId});
    //推送
    var clt = sessionStorage.getItem('clt');
    var goEasy = new GoEasy({appkey: 'BC-bc8aca99c2334b7d980144423300d20c'});
    goEasy.subscribe({
        channel: clt,
        onMessage: function(message){
            poly();
            load(paGe,{userId:1,currentPage:paGe,pageSize:pageNum,companyId:companyId});
        }
    });
    $(".node_list").click(function(){
        var isShow=$(".map .tab").hasClass("hide");
        if(isShow){
            $(".map .tab").removeClass("hide");
        }else{
            $(".map .tab").addClass("hide");
        }
    });
});
function load(page,date){
    var pageCount;   //初始的
    if(date!=undefined){
        $.ajax({
            type:'post',
            url: server_url + '/web/index/searchDeviceByName',
            data:date,
            dataType:'json',
            success:function(data){
                if(data.code==200){
                    $("#node_list tbody").empty();
                    var html='';
                    $.each(data.data.content,function(index,item){
                        var text=item.onlineStatus=="normal"?"":item.onlineStatus=="alarm"?"alarm":item.onlineStatus=="fault"?"fault":item.onlineStatus=="offline"?"offline":"";
                        var onlineStatus=item.onlineStatus=="normal"?"正常":item.onlineStatus=="alarm"?"报警":item.onlineStatus=="fault"?"故障":item.onlineStatus=="offline"?"离线":"";
                        html+='<tr class="'+text+'"><td>'+item.deviceName+'</td><td>'+item.companyName+'</td><td>'+onlineStatus+'</td><td><a onclick="session(\'location_id\',\''+item.id+'\'),localtion()">定位</a></td></tr>';
                    });
                    $("#node_list tbody").append(html);
                    //分页
                    pageCount = data.data.totalPages;//总页数
                    $(".total .num").text(pageCount);
                    if(pageCount>1){
                        $('.pages').removeClass("undis");
                        flag = true;
                        initPagination('#pagination',pageCount,1,page,function(num,type){
                            if(type === 'change'){
                                paGe = num;
                                date.currentPage=paGe;
                                load(paGe,date);
                            }
                        });
                    }else{
                        $('.pages').addClass("undis");
                        if(flag) {
                            paGe = 1;
                            date.currentPage=paGe;
                            load(paGe,date);
                            flag = false;

                        }
                    }
                }else if(data.code==204){
                    $("#node_list tbody").html('<tr><td style="text-align: center" colspan="4">当前条件下无数据展示！！！</td></tr>');
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
        returnMessage(2,"请传入参数");
    }
}
//画聚合地图
function poly(){
    var place=[],warings=[],faults=[],offlines=[];

    $.ajax({
        type:'post',
        url:server_url+"/web/index/getDevices",
        data:{companyId:companyId},
        headers:{userId:1},
        dataType:'json',
        success:function(data){
            if(data.code==200) {
                $.each(data.data,function(index,item){
                    var coord={},waring={},fault={},offline={};
                    if(item.onlineStatus=="normal"){
                        coord.longitude=item.longitude;
                        coord.latitude=item.latitude;
                        coord.id=item.id;
                        place.push(coord);
                    }else if(item.onlineStatus=="alarm"){
                        waring.longitude=item.longitude;
                        waring.latitude=item.latitude;
                        waring.id=item.id;
                        warings.push(waring);
                    }else if(item.onlineStatus=="fault"){
                        fault.longitude=item.longitude;
                        fault.latitude=item.latitude;
                        fault.id=item.id;
                        faults.push(fault);
                    }else if(item.onlineStatus=="offline"){
                        offline.longitude=item.longitude;
                        offline.latitude=item.latitude;
                        offline.id=item.id;
                        offlines.push(offline);
                    }
                });
                var markers = [];
                var pt1 = null,pt2 = null,pt3 = null,pt4=null;
                map.clearOverlays();
                $.each(place,function(index,item){
                    pt1 = new BMap.Point(item.longitude,item.latitude);
                    var myIcon = new BMap.Icon("../../../images/green.png?id="+item.id, new BMap.Size(19,25));
                    var marker2 = new BMap.Marker(pt1,{icon:myIcon});  // 创建标注
                    marker2.addEventListener("click",attribute);
                    markers.push(marker2);
                });
                $.each(offlines,function(index,item){
                    pt4 = new BMap.Point(item.longitude,item.latitude);
                    var myIcon = new BMap.Icon("../../../images/offline.png?id="+item.id, new BMap.Size(19,25));
                    var marker2 = new BMap.Marker(pt4,{icon:myIcon});  // 创建标注
                    marker2.addEventListener("click",attribute);
                    markers.push(marker2);

                });
                $.each(warings,function(index,item){
                    pt2 = new BMap.Point(item.longitude,item.latitude);
                    var myIcon = new BMap.Icon("../../../images/red.png?id="+item.id, new BMap.Size(19,25));
                    var marker2 = new BMap.Marker(pt2,{icon:myIcon});  // 创建标注
                    marker2.addEventListener("click",attribute);
                    markers.push(marker2);
                });
                $.each(faults,function(index,item){
                    pt3 = new BMap.Point(item.longitude,item.latitude);
                    var myIcon = new BMap.Icon("../../../images/yellow.png?id="+item.id, new BMap.Size(19,25));
                    var marker2 = new BMap.Marker(pt3,{icon:myIcon});  // 创建标注
                    marker2.addEventListener("click",attribute);
                    markers.push(marker2);
                });
                //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
                var markerClusterer1 = new BMapLib.MarkerClusterer(map, {markers:markers});
                //markerClusterer1.setStyles(myStyles1);

            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//查看楼层的设备状态
function attribute(){
    var icon=this.getIcon().imageUrl;
    node_id=icon.substring(icon.indexOf("id=")+3);
    session("node_id",node_id);
    $("#map_frame", window.parent.document).attr("src","floor.html");
    parent.return_page();
}
//列表定位
function localtion(){
    parent.return_page();
    $("#map_frame", window.parent.document).attr("src","location.html");
}