var officeChart = echarts.init($('.office_diagram')[0]);
var rentChart = echarts.init($('.rent')[0]);
var option1 = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['一月', '二月', '三月', '四月', '五月', '六月'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    fontSize:'14px',
                    color: '#578fe6'
                }
            }
        }
    ],
    series : [
        {
            name:'预约看办公室',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#2ad7c9'},
                            {offset: 1, color: '#578fe6'}
                        ]
                    )
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#14ecc1'},
                            {offset: 1, color: '#038dff'}
                        ]
                    )
                }
            },
            data:[600, 52, 200, 334, 390, 220]
        }
    ],
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: function (idx) {
        return Math.random() * 300;
    }
};

var option2 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:[
            {value:1561, name:'已出租'},
            {value:350, name:'未出租'}
        ]
    },

    color:[new echarts.graphic.LinearGradient(
        0, 0, 0, .8,
        [
            {offset: 0, color: '#2ad7c9'},
            {offset: 1, color: '#578fe6'}
        ]
    ),new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [
            {offset: 0, color: '#ffce54'},
            {offset: 1, color: '#fb6e96'}
        ]
    )],
    series: [
        {
            name:'办公室出租情况',
            type:'pie',
            radius: ['90px', '150px'],
            label: {
                normal: {
                    position: 'inner',
                    formatter:"{d}%"
                }
            },
            data:[
                {value:1561, name:'已出租'},
                {value:350, name:'未出租'}
            ]
        }
    ],
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: function (idx) {
        return Math.random() * 300;
    }
};

officeChart.setOption(option1);
rentChart.setOption(option2);








//baidu Map
map = new BMap.Map("baiduMap");
map.centerAndZoom(new BMap.Point(116.417854,39.921988), 15);
var data_info = [[116.417854,39.921988,"地址：北京市东城区王府井大街88号乐天银泰百货八层"],
    [116.406605,39.921585,"地址：北京市东城区东华门大街"],
    [116.412222,39.912345,"地址：北京市东城区正义路甲5号"]
];
var opts = {
    width : 800,     // 信息窗口宽度
    height: 470,     // 信息窗口高度
    title : "<h4 style='text-align: center;color: #06bb79;font-size: 20px;line-height: 60px;'>智慧园区</h4>" , // 信息窗口标题
    enableMessage:true//设置允许信息窗发送短息
};
for(var i=0;i<data_info.length;i++){
    var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // 创建标注
    var content = data_info[i][2];
    map.addOverlay(marker);               // 将标注添加到地图中
    addClickHandler(content,marker);
}
function addClickHandler(content,marker){
    marker.addEventListener("click",function(e){
        openInfo(content,e)}
    );
}
function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}
map.enableScrollWheelZoom(true);








//tabs function：
function tabs(con,tabs,tabPal){//事件代理容器，tabs标签，tabs_panel标签
    $(con).on('click',tabs,function(){
        var tab = $(tabs).removeClass('blueChange');
        $(this).addClass('blueChange');

        var tabP = $(tabPal).removeClass('active');
        $.each(tab,function(i,v){
            if($(v).hasClass('blueChange')){
                $(tabP[i]).addClass('active');
            }
        });
    });
}

tabs('.diagram_1','.diagram_tabs .tabs_title','.diagram_tabs_con .tabs_item');
tabs('.msg','.msg_tabs .tabs_title','.msg_tabs_con .tabs_item');









