KindEditor.ready(function(K) {
    window.editor = K.create('#editor',{
        uploadJson:''
    });
});

function stateTimeInit(){//初始化时间插件
    WdatePicker({el:'dateStart',dateFmt:'yyyy-MM-dd HH:mm:ss',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'%y-%M-%d',maxDate:'2099-12-31'});
}


function testEditor(){
    var html = editor.html();
    console.log(html)
}