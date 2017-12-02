//日期格式化成2017-01-02格式：
Date.prototype.toDateStr = function() {
    return this.getFullYear()+"-"+((this.getMonth()+ 1)<10?('0'+(this.getMonth()+ 1)):(this.getMonth()+ 1))+"-"+(this.getDate()<10?('0'+this.getDate()):this.getDate());
};
function stateTimeInit(){//初始化开始时间
    WdatePicker({el:'dateStart',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'whyGreen',minDate:'2017-01-01',maxDate:'#F{$dp.$D(\'dateEnd\')||\'%y-%M-%d\'}'});
}
function endTimeInit(){//初始化结束时间
    WdatePicker({el:'dateEnd',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'whyGreen',minDate:'#F{$dp.$D(\'dateStart\')||\'2017-01-01\'}',maxDate:'%y-%M-%d'});
}
function timeIsChange(time){
    console.log(time);
}