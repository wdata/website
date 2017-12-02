var location_id=sessionStorage.getItem("location_id");
$(document).ready(function(){
    load();
    //推送
    var clt = sessionStorage.getItem('clt');
    var goEasy = new GoEasy({appkey: 'BC-bc8aca99c2334b7d980144423300d20c'});
    goEasy.subscribe({
        channel: clt,
        onMessage: function(message){
            load();
        }
    });
});
function load(){
    $.ajax({
        type:'post',
        url: server_url + '/web/device/getDeviceInfo',
        data:{id:location_id},
        headers:{userId:1},
        dataType:'json',
        success:function(data){
            if(data.code==200){
                var date=data.data;
                var map = new BMap.Map("allmap");// 创建Map实例
                map.centerAndZoom(new BMap.Point(116.331398,39.897445),16);    // 初始化地图,用城市名设置地图中心点
                map.enableScrollWheelZoom(); // 允许滚轮缩放
                var new_point = new BMap.Point(date.longitude,date.latitude);
                var img_name=date.onlineStatus=="normal"?"green":date.onlineStatus=="alarm"?"red":date.onlineStatus=="fault"?"yellow":date.onlineStatus=="offline"?"offline":"";
                var marker=null;
                if(img_name!=""){
                    var myIcon = new BMap.Icon("../../images/"+img_name+".png?id="+location_id, new BMap.Size(19,25));
                    marker = new BMap.Marker(new_point,{icon:myIcon});  // 创建标注
                }else{
                    marker = new BMap.Marker(new_point);
                }
                map.addOverlay(marker);
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                marker.addEventListener("click",attribute);
                // 将标注添加到地图中
                map.panTo(new_point);

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
//跳转到楼层的设备状态页面
function attribute(){
    var icon=this.getIcon().imageUrl;
    var node_id=icon.substring(icon.indexOf("id=")+3);
    session("node_id",node_id);
    $("#map_frame", window.parent.document).attr("src","floor.html");
}