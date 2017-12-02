
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




/*
function showOrgList(){
    topWin.myLayer = layer.open({
        type:1,
        resize:false,
        title:'<h4 class="text-center" style="line-height: 42px;">接收对象</h4>',
        content:`
            <div class="table-responsive">
                    <table class="table table-striped table-condensed table-hover orgList" id="orgList">
                        <thead>
                        <tr>
                            <th class="text-left" style="padding: 5px 0;"><label><input type="checkbox" onclick="checkAll('#orgList',this)"><span>全选/非全选</span></label></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        <tr class="text-left"><td><label><input type="checkbox"><span>小道科技</span></label></td></tr>
                        </tbody>
                    </table>
                </div>
            `,
        area: ['360px', '450px'],
        btn:['确定','取消'],
        yes:function(index, layero){

        },
        btn2:function(index, layero){

        }
    });
}*/
