//判断上传文件类型
function checkType(fileInput){
    if(fileInput.files.length>0){
        var file = fileInput.files[0];
        var fileName = fileInput.files[0].name.toLocaleString();
        var maxSize = 20971520;//20Mb的字节大小：20*1024*1024=20971520;
        if(fileInput.files[0].size>maxSize){
            fileInput.value = '';$('.file_name').text('');
            parent.layer.msg('仅支持20M以内的 .doc , .docx, .pdf, .xls, .xlsx, .ppt, .pptx, .zip, .rar 类型文件!',{time: 2000});
            return false;
        }
        if(!/(\.zip$)|(\.rar$)/.test(fileName)){
            switch (fileInput.files[0].type){
                case 'application/msword':break;
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':break;
                case 'application/pdf':break;
                case 'application/vnd.ms-excel,application/x-excel':break;
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':break;
                case 'application/vnd.ms-powerpoint':break;
                case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':break;
                default:
                    fileInput.value = '';$('.file_name').text('');
                    parent.layer.msg('仅支持20M以内的 .doc , .docx, .pdf, .xls, .xlsx, .ppt, .pptx, .zip, .rar 类型文件!',{time: 2000});
                    return false;
                //break;
            }
        }
    }
}

function stateTimeInit(){//初始化开始时间
    WdatePicker({el:'dateStart',dateFmt:'yyyy-MM-dd HH:mm:ss',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'%y-%M-%d',maxDate:'#F{$dp.$D(\'dateEnd\')||\'2099-12-31\'}'});
}
function endTimeInit(){//初始化结束时间
    WdatePicker({el:'dateEnd',dateFmt:'yyyy-MM-dd',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'#F{$dp.$D(\'dateStart\')||\'%y-%M-%d\'}'});
}





$('.dropdown').on('hide.bs.dropdown',function(e){
    console.log(e)
    //return false;

});

//切换通知类型：
$('input[name=informType]').change(function(){
    var orgBtnCon = $('.orgBtnCon');
    var xslData = $('.xslData');
    var text_con = $('.text-con');
    text_con.toggleClass('hidden');
    orgBtnCon.toggleClass('hidden');
    xslData.toggleClass('hidden');
});


//批量导入.xlf表格：
$('#xlf').change(function(){
    if(this.files.length>0){
        switch (this.files[0].type){
            case 'application/vnd.ms-excel,application/x-excel':break;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':break;
            default:
                this.value = '';
                $('.xlf_name').text('请选择.xls格式文件');
                parent.layer.msg(' 仅支持 .xls, .xlsx 类型文件! ',{time: 2000});
                return false;
        }
        $('.xlf_name').text(this.files[0].name);
    }else {
        $('.xlf_name').text('请选择.xls格式文件');
    }
});


//附件：
$('#file').change(function(){
    console.log(this.files);
    if(this.files.length>0){
        $('.file_name').text(this.files[0].name);
    }else {
        $('.file_name').text('');
    }
});