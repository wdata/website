
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('first_echarts'));

// 指定图表的配置项和数据
var option = {
    title: {
        text: '2016年12月长宁区合规成本分析'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['总报修', '办公区域','公共区域'],
        align: 'right',
        left:'30%',
        bottom: 0
    },
    grid: {
        left: '1%',
        right: '10%',
        bottom: '5%',
        containLabel: true
    },
    yAxis: [{
        type: 'category',
        data: ['7月', '8月', '9月', '10月', '11月']
    }],
    xAxis: [{
        type: 'value',
        //name: '总价(万元)',
        axisLabel: {
            formatter: '{value}'
        }
    }],
    series: [ {
        name: '办公区域',
        type: 'bar',
        data: [8, 11, 16, 3, 7]
    }, {
        name: '公共区域',
        type: 'bar',
        data: [21, 9, 5, 5, 16]
    },{
        name: '总报修',
        type: 'bar',
        data: [29, 20, 21, 8, 23]
    }],
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: function (idx) {
        return Math.random() * 300;
    }
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);