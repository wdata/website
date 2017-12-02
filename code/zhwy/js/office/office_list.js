var Office = function(){
    this.ajax = new Util();
    this.userId = getSession('userId');
};

Office.prototype.getArgument = function(){
    var data = {};
    data.userId = this.userId;
    return data;
};

Office.prototype.getOfficeList = function(){
    var _this = this;
    this.data = this.getArgument();
    this.ajax.get('/web/api/v1/rent/office/getOfficeList',this.data,function(res){
        if(res.code===0){
            var data = res.data;
            if(data.items.length>0){
                var html = '';
                $.each(data.items,function(i,item){
                    var endTime = new Date(item.endTime).toStr();
                    html +=`
                        <tr class="text-center" data-propertyId="${item.propertyId}">
                            <td><input type="checkbox"></td>
                            <td>${i+1}</td>
                            <td>${val(item.name)}</td>
                            <td>${val(item.propertyName)}</td>
                            <td>${val(item.acreage)}</td>
                            <td>${val(item.firmName)}</td>
                            <td>${val(endTime)}</td>
                            <td>
                                <button class="btn btn-link btn-xs" onclick="goPage('page/office/office_details.html');">查看</button>
                            </td>
                            <td>${val(item.status)}</td>
                            <td>
                                <button type="button" class="btn btn-info btn-xs" onclick=""><i class="fa fa-edit fa-fw"></i>修改</button>
                                <button type="button" class="btn btn_red btn-xs" onclick=""><i class="fa fa-edit fa-fw"></i>删除</button>
                            </td>
                        </tr>
                    `;
                });
                $('#list tbody').html(html);
            }
        }
    });
};

var office = new Office();
office.getOfficeList();



































// 基于准备好的dom，初始化echarts实例
var firstChart = echarts.init(document.getElementById('first_echarts'));
var secondChart = echarts.init(document.getElementById('second_echarts'));

// 指定图表的配置项和数据
var option1 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['已租','预定','空置'],
        align: 'right',
        right:'2%',
        top: '5%'
    },
    grid: {
        left: '1%',
        right: '2%',
        bottom: '9%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        data: [8, 11, 16, 3, 7,8, 11, 16, 3, 78, 11, 16, 3, 78, 11, 16, 3, 78, 11, 16, 3, 7]
    }],
    yAxis: [{
        type: 'value',
        //name: '总价(万元)',
        axisLabel: {
            formatter: '{value}'
        }
    }],
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 30
    }, {
        start: 0,
        end: 20,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '60%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    color:[new echarts.graphic.LinearGradient(
        0, 0, 0, .8,
        [
            {offset: 0, color: '#2ad7c9'},
            {offset: 1, color: '#578fe6'}
        ]
    ),new echarts.graphic.LinearGradient(
        0, 0, 0, .8,
        [
            {offset: 0, color: '#7c9cf8'},
            {offset: 1, color: '#a757e5'}
        ]
    ),new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [
            {offset: 0, color: '#ffce54'},
            {offset: 1, color: '#fb6e96'}
        ]
    )],
    series: [
        {name: '已租',type: 'bar',data: [8, 11, 0, 3, 7,8, 11, 16, 3, 78, 11, 16, 3, 78, 11, 16, 3, 78, 11, 16, 3, 7]},
        {name: '预定', type: 'bar', data: [21, 9, 5, 5, 16,8, 11, 16, 3, 78, 11, 16, 3, 78, 11, 16, 3, 78, 11, 16, 3, 7]},
        {name: '空置',type: 'bar',data: [29, 20, 21, 8, 23,8, 11, 16, 3, 78, 11, 16, 3, 78, 11, 16, 3, 78, 11, 16, 3, 7]}
    ],
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: function (idx) {
        return Math.random() * 300;
    }
};

var option2 = option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    color:[new echarts.graphic.LinearGradient(
        0, 0, 0, .8,
        [
            {offset: 0, color: '#2ad7c9'},
            {offset: 1, color: '#578fe6'}
        ]
    ),new echarts.graphic.LinearGradient(
        0, 0, 0, .8,
        [
            {offset: 0, color: '#7c9cf8'},
            {offset: 1, color: '#a757e5'}
        ]
    ),new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [
            {offset: 0, color: '#ffce54'},
            {offset: 1, color: '#fb6e96'}
        ]
    )],
    legend: {
        data: ['已租','预定','空置'],
        align: 'right',
        right:'2%',
        top: '5%'
    },
    series : [
        {
            name:'出租情况',
            type:'pie',
            radius : '70%',
            center: ['50%', '50%'],
            data:[
                {value:400, name:'已租'},
                {value:235, name:'预定'},
                {value:274, name:'空置'}
            ]/*.sort(function (a, b) { return a.value - b.value; })*/,
            roseType: 'radius',
            label: {
                normal: {
                    position: 'inner',
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: "{d}%"
                }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 500;
            }
        }
    ]
};
// 使用刚指定的配置项和数据显示图表。
firstChart.setOption(option1);
secondChart.setOption(option2);


