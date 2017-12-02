function stateDateInit(){//初始化开始活动时间
    WdatePicker({el:'dateStart',dateFmt:'yyyy-MM-dd HH:mm:ss',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'%y-%M-%d',maxDate:'#F{$dp.$D(\'dateEnd\')||\'{%y+1}-%M-%d\'}'});
}
function endDateInit(){//初始化结束活动时间
    WdatePicker({el:'dateEnd',dateFmt:'yyyy-MM-dd HH:mm:ss',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'#F{$dp.$D(\'dateStart\')||\'%y-%M-%d\'}',maxDate:'{%y+1}-%M-%d'});
}

function stateTimeInit(){//初始化开始报名时间
    WdatePicker({el:'startTime',dateFmt:'yyyy-MM-dd HH:mm:ss',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'2017-01-01',maxDate:'#F{$dp.$D(\'endTime\')||\'%y-%M-%d\'}'});
}
function endTimeInit(){//初始化结束报名时间
    WdatePicker({el:'endTime',dateFmt:'yyyy-MM-dd HH:mm:ss',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'#F{$dp.$D(\'startTime\')||\'2017-01-01\'}',maxDate:'%y-%M-%d'});
}



KindEditor.ready(function(K) {
    window.editor = K.create('#editor',{});
});




//保存新增活动：
function newsActivity(){

}