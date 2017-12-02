//打开地图并获取标点的坐标
var mylayer;
function getMapMarker(){
    mylayer=layer.open({
        type: 2,
        title:'<h4 class="text-center" style="line-height: 42px">点击地图进行选点</h4>',
        shade: false,
        area: ['1000px', '700px'],
        maxmin: true,
        content: 'map_baidu.html',
        zIndex: layer.zIndex, //重点1
        success: function(layero){
            layer.setTop(layero); //重点2
        }
    });
}

function setMapMarker(lng,lat){
    $('.location .lng').val(lng);
    $('.location .lat').val(lat);
}