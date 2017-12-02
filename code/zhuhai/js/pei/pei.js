//初始化上半部分轨迹图
var cxt = $("#doughnut").get(0).getContext("2d");
//上半部分轨迹图的数据
var myNewChart = new Chart(cxt).Doughnut([
    {
        value : 11,
        color : "#76419B"
    },
    {
        value : 11,
        color : "#464543"
    },
    {
        value : 11,
        color : "#299385"
    },
    {
        value : 11,
        color : "#DADBD6"
    },
    {
        value : 11,
        color : "#BB7A28"
    },
    {
        value : 11,
        color : "#1589A2"
    },
    {
        value : 11,
        color : "#BB1928"
    },
    {
        value : 11,
        color : "#ACC13E"
    },
    {
        value : 12,
        color : "#14A24E"
    }
]);


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = document.body.clientWidth;
var height = ctx.canvas.height;

if (window.devicePixelRatio) {
    ctx.canvas.style.width = width + "px";
    ctx.canvas.style.height = height + "px";
    ctx.canvas.height = height * window.devicePixelRatio;
    ctx.canvas.width = width * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
var coord_x=width/2-30;
var coord_y=height/2;
//var r = 2.67*parseFloat($("html").css("font-size"));
var clientWidth= document.body.clientWidth;
var r=0;//圆环半径
if(clientWidth<=320){
    r=80;
}else{
    r=100;
}
var average=r/100;//将半径分成一百等份
//扇形
CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
// 初始保存
    this.save();
// 位移到目标点
    this.translate(x, y);
    this.beginPath();
// 画出圆弧
    this.arc(0,0,radius,sDeg, eDeg);
// 再次保存以备旋转
    this.save();
// 旋转至起始角度
    this.rotate(eDeg);
// 移动到终点，准备连接终点与圆心
    this.moveTo(radius,0);
// 连接到圆心
    this.lineTo(0,0);
// 还原
    this.restore();
// 旋转至起点角度
    this.rotate(sDeg);
// 从圆心连接到起点
    this.lineTo(radius,0);
    this.closePath();
// 还原到最初保存的状态
    this.restore();
    return this;
};
ctx.fillStyle="#F8F8F8";
ctx.sector(coord_x,coord_y,r+10,-Math.PI/180*90,Math.PI/180*270).fill();
ctx.fillStyle="#E7E7E7";
ctx.sector(coord_x,coord_y,r,-Math.PI/180*90,Math.PI/180*270).fill();
//十三等份的弧形
var data=[
    {val:60,text:'主体责任落实'},
    {val:75,text:'民主(组织)生活会'},
    {val:70,text:'中心组学习'},
    {val:40,text:'下抓两级机制落实'},
    {val:80,text:'监督执纪'},
    {val:50,text:'入党思想心得'},
    {val:60,text:'日常学习心得'},
    {val:70,text:'品牌创新'},
    {val:60,text:'干部关爱'},
    {val:50,text:'文明创建'},
    {val:40,text:'三会一课'},
    {val:55,text:'廉政谈话'},
    {val:65,text:'其他类别'}
];
//    按占比从多到少的顺序传值  积分模块数据
var data1=[
    {val:45,text:'上传台账'},
    {val:34,text:'获得点赞'},
    {val:21,text:'学习'}
];
//    四个机制模块数据
var data2=[
    {val:40,text:'党组带头'},
    {val:30,text:'领导表率'},
    {val:20,text:'支部堡垒'},
    {val:10,text:'党员先锋'}
];
//其他  模块的数据
var data3=[
    {val:70,text:'签到'},
    {val:30,text:'抽奖'}
];

var start=-90;
for(var i=0;i<data.length;i++){
    var end=start+13.8;
    data[i].start=start;
    data[i].end=end;
    start=end;
}
ctx.fillStyle="#A8A9AE";
//    画右边十三等份的扇形
$.each(data,function(index,item){
    var r1=item.val*average;
    ctx.sector(coord_x,coord_y,r1,Math.PI/180*item.start,Math.PI/180*item.end).fill();
});
//    绘制后边十三等份的文字和直线
for(var j=data.length-1;j>=0;j--) {
    var x=coord_x + Math.sin((2*Math.PI / 360)*(6.9+(13.8*j))) * 30*average;
    var y=coord_y + Math.cos((2*Math.PI / 360)*(6.9+(13.8*j))) * 30*average;
    var x1=coord_x + Math.sin((2*Math.PI / 360)*(6.9+(13.8*j))) * (r+10);
    var y1=coord_y + Math.cos((2*Math.PI / 360)*(6.9+(13.8*j))) * (r+10);
    ctx.fillStyle = "#000";
    ctx.sector(x,y,1,-Math.PI/180*90,Math.PI/180*270).fill();
    //画直线
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x1,y1);
    ctx.lineWidth=0.5;
    ctx.stroke();
    ctx.closePath();
//        绘制文字
    if(j==0){
        ctx.font = '14px Helvetica';
        ctx.fillStyle = "#2670AD";
        ctx.fillText(data[data.length-1].val+"%", x1-10, y1+10);
        ctx.font = '12px Helvetica';
        ctx.fillStyle = "#ce3a3d";
        ctx.fillText(data[data.length-1].text,x1-20, y1+20);
    }else if(j==data.length-1){
        ctx.font = '14px Helvetica';
        ctx.fillStyle = "#2670AD";
        ctx.fillText(data[0].val+"%", x1-10, y1-15);
        ctx.font = '12px Helvetica';
        ctx.fillStyle = "#ce3a3d";
        ctx.fillText(data[0].text,x1-25, y1-5);
    }else{
        ctx.font = '14px Helvetica';
        ctx.fillStyle = "#2670AD";
        ctx.fillText(data[data.length-j-1].val+"%", x1, y1+5);
        ctx.font = '12px Helvetica';
        ctx.fillStyle = "#ce3a3d";
        ctx.fillText(data[data.length-j-1].text,x1+26, y1+5);
    }

}
//    其他模块的扇形
ctx.fillStyle="#2F4577";
ctx.sector(coord_x,coord_y,r,Math.PI/180*90,Math.PI/180*150).fill();
ctx.fillStyle="#3B589A";
ctx.sector(coord_x,coord_y,data3[0].val*average,Math.PI/180*90,Math.PI/180*150).fill();




//四个机制扇形
ctx.fillStyle="#7D8EA8";
ctx.sector(coord_x,coord_y,r,Math.PI/180*150,Math.PI/180*210).fill();
ctx.fillStyle="#627794";
ctx.sector(coord_x,coord_y,(data2[0].val+data2[1].val+data2[2].val)*average,Math.PI/180*150,Math.PI/180*210).fill();
ctx.fillStyle="#2F4577";
ctx.sector(coord_x,coord_y,(data2[0].val+data2[1].val)*average,Math.PI/180*150,Math.PI/180*210).fill();
ctx.fillStyle="#3B589A";
ctx.sector(coord_x,coord_y,data2[0].val*average,Math.PI/180*150,Math.PI/180*210).fill();

//    积分模块扇形
ctx.fillStyle="#607792";
ctx.sector(coord_x,coord_y,r,Math.PI/180*210,Math.PI/180*270).fill();
ctx.fillStyle="#2F4577";
ctx.sector(coord_x,coord_y,(data1[0].val+data1[1].val)*average,Math.PI/180*210,Math.PI/180*270).fill();
ctx.fillStyle="#3B589A";
ctx.sector(coord_x,coord_y,data1[0].val*average,Math.PI/180*210,Math.PI/180*270).fill();
//    绘制 其他 模块的文字和直线
$.each(data3,function(index,item){
    var data3_x=coord_x + Math.sin((2*Math.PI / 360)*330) * data3[0].val/2*average;
    var data3_y=coord_y + Math.cos((2*Math.PI / 360)*330) *  data3[0].val/2*average;
    var data3_x1=coord_x + Math.sin((2*Math.PI / 360)*330) * (r+15);
    var data3_y1=coord_y + Math.cos((2*Math.PI / 360)*330) * (r+15);
    ctx.fillStyle = "#000";
    ctx.sector(data3_x,data3_y,1,-Math.PI/180*90,Math.PI/180*270).fill();
    //画直线
    if(index==1){
        ctx.beginPath();
        ctx.moveTo(data3_x,data3_y);
        ctx.lineTo(data3_x1,data3_y1);
        ctx.lineWidth=0.5;
        ctx.stroke();
        ctx.closePath();
        ctx.font = '14px Helvetica';
        ctx.fillStyle = "#2670AD";
        ctx.fillText(data3[0].val+"%", data3_x1-10, data3_y1+15);
        ctx.font = '12px Helvetica';
        ctx.fillStyle = "#ce3a3d";
        ctx.fillText(data3[0].text,data3_x1+25, data3_y1+15);
        ctx.font = "bold 16px Arial";
        ctx.fillText("其他",data3_x1-15, data3_y1+35);
    }


    var data3_x2=coord_x + Math.sin((2*Math.PI / 360)*320) * (data3[0].val+10)*average;
    var data3_y2=coord_y + Math.cos((2*Math.PI / 360)*320) *  (data3[0].val+10)*average;
    var end_x2=coord_x + Math.sin((2*Math.PI / 360)*320) * (r+15);
    var end_y2=coord_y + Math.cos((2*Math.PI / 360)*320) * (r+15);
    ctx.fillStyle = "#000";
    ctx.sector(data3_x2,data3_y2,1,-Math.PI/180*90,Math.PI/180*270).fill();
    if(index==1){
        ctx.beginPath();
        ctx.moveTo(data3_x2,data3_y2);
        ctx.lineTo(end_x2,end_y2);
        ctx.lineWidth=0.5;
        ctx.stroke();
        ctx.closePath();
        ctx.font = '14px Helvetica';
        ctx.fillStyle = "#2670AD";
        ctx.fillText(item.val+"%", end_x2-30, end_y2+10);
        ctx.font = '12px Helvetica';
        ctx.fillStyle = "#ce3a3d";
        ctx.fillText(item.text,end_x2, end_y2+10);
    }

});

//    绘制 四个机制 模块的文字和直线
$.each(data2,function(index,item){
//        党组带头位置
    var data2_x=coord_x + Math.sin((2*Math.PI / 360)*285) * data2[0].val/2*average;
    var data2_y=coord_y + Math.cos((2*Math.PI / 360)*285) *  data2[0].val/2*average;
    var data2_x1=coord_x + Math.sin((2*Math.PI / 360)*290) * (r+15);
    var data2_y1=coord_y + Math.cos((2*Math.PI / 360)*290) * (r+15);
//        领导表率位置
    var data2_xl=coord_x + Math.sin((2*Math.PI / 360)*270) * (data2[0].val+10)*average;
    var data2_yl=coord_y + Math.cos((2*Math.PI / 360)*270) *  (data2[0].val+10)*average;
    var end_xl=coord_x + Math.sin((2*Math.PI / 360)*278) * (r+15);
    var end_yl=coord_y + Math.cos((2*Math.PI / 360)*278) * (r+15);
    //        支部堡垒位置
    var data2_xz=coord_x + Math.sin((2*Math.PI / 360)*255) * (data2[0].val+data2[1].val+10)*average;
    var data2_yz=coord_y + Math.cos((2*Math.PI / 360)*255) *  (data2[0].val+data2[1].val+10)*average;
    var end_xz=coord_x + Math.sin((2*Math.PI / 360)*262) * (r+15);
    var end_yz=coord_y + Math.cos((2*Math.PI / 360)*262) * (r+15);
//        党员先锋位置
    var data2_xd=coord_x + Math.sin((2*Math.PI / 360)*250) * (100-data2[3].val/2)*average;
    var data2_yd=coord_y + Math.cos((2*Math.PI / 360)*250) *  (100-data2[3].val/2)*average;
    var end_xd=coord_x + Math.sin((2*Math.PI / 360)*250) * (r+15);
    var end_yd=coord_y + Math.cos((2*Math.PI / 360)*250) * (r+15);
    ctx.fillStyle = "#000";
    ctx.sector(data2_x,data2_y,1,-Math.PI/180*90,Math.PI/180*270).fill();
    ctx.sector(data2_xl,data2_yl,1,-Math.PI/180*90,Math.PI/180*270).fill();
    ctx.sector(data2_xz,data2_yz,1,-Math.PI/180*90,Math.PI/180*270).fill();
    ctx.sector(data2_xd,data2_yd,1,-Math.PI/180*90,Math.PI/180*270).fill();
    //画直线
    if(index==1){
        ctx.beginPath();
        ctx.moveTo(data2_x,data2_y);
        ctx.lineTo(data2_x1,data2_y1);
        ctx.moveTo(data2_xl,data2_yl);
        ctx.lineTo(end_xl,end_yl);
        ctx.moveTo(data2_xz,data2_yz);
        ctx.lineTo(end_xz,end_yz);
        ctx.moveTo(data2_xd,data2_yd);
        ctx.lineTo(end_xd,end_yd);
        ctx.lineWidth=0.5;
        ctx.stroke();
        ctx.closePath();
        ctx.font = '14px Helvetica';
        ctx.fillStyle = "#2670AD";
        ctx.fillText(data2[0].val+"%", data2_x1-10, data2_y1+15);
        ctx.fillText(data2[1].val+"%", end_xl-15, end_yl+13);
        ctx.fillText(data2[2].val+"%", end_xz-20, end_yz+13);
        ctx.fillText(data2[3].val+"%", end_xd-25, end_yd+5);
        ctx.font = '12px Helvetica';
        ctx.fillStyle = "#ce3a3d";
        ctx.fillText(data2[0].text,data2_x1-20, data2_y1+28);
        ctx.fillText(data2[1].text,end_xl-25, end_yl+25);
        ctx.fillText(data2[2].text,end_xz-31, end_yz+25);
        ctx.fillText(data2[3].text,end_xd-37, end_yd+18);
        ctx.font = "bold 16px Arial";
        ctx.fillText("四个机制",end_xd-40, end_yd-10);
    }
});

//    绘制 积分 模块的文字和直线
$.each(data1,function(index,item){
//        上传台账 位置
    var data1_x=coord_x + Math.sin((2*Math.PI / 360)*200) * data1[0].val/2*average;
    var data1_y=coord_y + Math.cos((2*Math.PI / 360)*200) *  data1[0].val/2*average;
    var data1_x1=coord_x + Math.sin((2*Math.PI / 360)*200) * (r+15);
    var data1_y1=coord_y + Math.cos((2*Math.PI / 360)*200) * (r+15);
//        获得点赞位置
    var data1_xd=coord_x + Math.sin((2*Math.PI / 360)*215) * (data1[0].val+10)*average;
    var data1_yd=coord_y + Math.cos((2*Math.PI / 360)*215) *  (data1[0].val+10)*average;
    var end_xd=coord_x + Math.sin((2*Math.PI / 360)*215) * (r+15);
    var end_yd=coord_y + Math.cos((2*Math.PI / 360)*215) * (r+15);
    //        学习位置
    var data1_xx=coord_x + Math.sin((2*Math.PI / 360)*230) * (100-data1[2].val/2)*average;
    var data1_yx=coord_y + Math.cos((2*Math.PI / 360)*230) *  (100-data1[2].val/2)*average;
    var end_xx=coord_x + Math.sin((2*Math.PI / 360)*230) * (r+15);
    var end_yx=coord_y + Math.cos((2*Math.PI / 360)*230) * (r+15);
    ctx.fillStyle = "#000";
    ctx.sector(data1_x,data1_y,1,-Math.PI/180*90,Math.PI/180*270).fill();
    ctx.sector(data1_xd,data1_yd,1,-Math.PI/180*90,Math.PI/180*270).fill();
    ctx.sector(data1_xx,data1_yx,1,-Math.PI/180*90,Math.PI/180*270).fill();
//        //画直线
    if(index==1){
        ctx.beginPath();
        ctx.moveTo(data1_x,data1_y);
        ctx.lineTo(data1_x1,data1_y1);
        ctx.moveTo(data1_xd,data1_yd);
        ctx.lineTo(end_xd,end_yd);
        ctx.moveTo(data1_xx,data1_yx);
        ctx.lineTo(end_xx,end_yx);
        ctx.lineWidth=0.5;
        ctx.stroke();
        ctx.closePath();
        ctx.font = '14px Helvetica';
        ctx.fillStyle = "#2670AD";
        ctx.fillText(data1[0].val+"%", data1_x1-10, data1_y1-12);
        ctx.fillText(data1[1].val+"%", end_xd-20, end_yd-12);
        ctx.fillText(data1[2].val+"%", end_xx-30, end_yx-12);
        ctx.font = '12px Helvetica';
        ctx.fillStyle = "#ce3a3d";
        ctx.fillText(data1[0].text,data1_x1-20, data1_y1);
        ctx.fillText(data1[1].text,end_xd-28, end_yd);
        ctx.fillText(data1[2].text,end_xx-31, end_yx);
        ctx.font = "bold 16px Arial";
        ctx.fillText("积分",end_xd-28, end_yd-30);
    }
});