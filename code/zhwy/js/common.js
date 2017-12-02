//封装ajax
var Util = function () {};
Util.prototype.get = function(url,data,callBack){//转义
    var tmpUrl = "" + url;
    //data = JSON.stringify(data);
    $.ajax({
        timeout:6000,
        type: "GET",
        url: tmpUrl,
        dataType: "json",
        data: data,
        //headers: {'Content-Type': 'application/json; charset=UTF-8','Accept':'application/json'},
        beforeSend:function(XHR){
          parent.loadLayer = parent.layer.load();
        },
        complete:function(XHR,TS){
          parent.layer.close(parent.loadLayer);
        },
        success: function (res) {
            callBack(res);
        },
        error: function (res) {
            console.log(JSON.stringify(res));
        }
    });
};
Util.prototype.post = function(url,data,callBack){//转义
    var tmpUrl = "" + url;
    data = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: tmpUrl,
        dataType: "json",
        data: data,
        headers: {'Content-Type': 'application/json; charset=UTF-8','Accept':'application/json'},
        success: function (res) {
            callBack(res);
        },
        error: function (res) {
            console.log(JSON.stringify(res));
        }
    });
};
Util.prototype.post2 = function(url,data,callBack){//未转义
    var tmpUrl = "" + url;
    //data = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: tmpUrl,
        dataType: "json",
        data: data,
        processData: false,
        contentType: false,
        beforeSend:function(XHR){
            parent.loadLayer = parent.layer.load();
        },
        complete:function(XHR,TS){
            parent.layer.close(parent.loadLayer);
        },
        //headers: {'Content-Type': 'multipart/form-data; charset=UTF-8','Accept':'application/json'},
        success: function (res) {
            callBack(res);
        },
        error: function (res) {
            console.log(JSON.stringify(res));
        }
    });
};
Util.prototype.trim = function (str) {
    if(str== null){
        str = "";
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

//日期格式
Date.prototype.toStr = function() {
    var YYYY = this.getFullYear();
    var MM = (this.getMonth() + 1)<10?'0'+(this.getMonth() + 1):(this.getMonth() + 1);
    var DD = this.getDate()<10?'0'+this.getDate():this.getDate();
    var hh = this.getHours()<10?'0'+this.getHours():this.getHours();
    var mm = this.getMinutes()<10?'0'+this.getMinutes():this.getMinutes();
    var ss = this.getSeconds()<10?'0'+this.getSeconds():this.getSeconds();
    return  YYYY+ "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss ;
};

//包含文件上传的ajax
function postFile(url,data,callBack){
    var tmpUrl = "" + url;
    //data = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: tmpUrl,
        dataType: "json",
        data: data,
        processData: false,
        contentType: false,
        //headers: {'Content-Type': 'multipart/form-data; charset=UTF-8','Accept':'application/json'},
        success: function (res) {
            callBack(res);
        },
        error: function (res) {
            console.log(JSON.stringify(res));
        }
    });
}


//全选函数
function checkAll(selector,_this){
    if(_this.checked){
        $(selector+" tbody :checkbox").prop("checked", true);
    }else{
        $(selector+" tbody :checkbox").prop("checked", false);
    }
}

//导航链接跳转
function goPage(page,_this){
    var win_top = window.top;
    $(win_top.document).find('#iframe').attr('src',page);

    /*if(_this){
        $('.sec-ul a').removeClass('activate');
        $(_this).addClass('activate');
    }*/
}

//日期格式化成2017-01-02格式：
Date.prototype.toDateStr = function() {
    return this.getFullYear()+"-"+((this.getMonth()+ 1)<10?('0'+(this.getMonth()+ 1)):(this.getMonth()+ 1))+"-"+(this.getDate()<10?('0'+this.getDate()):this.getDate());
};
function stateTimeInit(){//初始化开始时间
    WdatePicker({el:'dateStart',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'2017-01-01',maxDate:'#F{$dp.$D(\'dateEnd\')||\'%y-%M-%d\'}'});
}
function endTimeInit(){//初始化结束时间
    WdatePicker({el:'dateEnd',onpicked:function(dp){timeIsChange(dp.cal.getDateStr());},skin:'twoer',minDate:'#F{$dp.$D(\'dateStart\')||\'2017-01-01\'}',maxDate:'%y-%M-%d'});
}
function timeIsChange(time){
    console.log(time);
}



//选择区域(首页/列表页)
// function addrToggle(){
//     $(".select-addr-con").slideToggle("fast",function(){});
// }
// //选择区域(新增/编辑页)
// function addrToggleAdd(){
//     $(".select-addr-con-add").slideToggle("fast",function(){});
// }



//顶级window对象
//var topWin = window.top;
//var layer = topWin.layer;







//File对象转换为dataURL、Blob对象转换为dataURL
function readBlobAsDataURL(blob, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {callback(e.target.result);};
    reader.readAsDataURL(blob);
}

//dataURL转换为Blob对象
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//把canvas的图片转成blob对象：
function canvasToBlob(canvas){
    if(canvas.width||canvas.height)return dataURLtoBlob(canvas.toDataURL('image/png'));
}

//判断图片的上传文件类型+绘制在canvas上：
var imgInput = '';
function checkImgType(fileInput,$con,dimension,setOptions){
    //fileInput：file的input框。 $con：canvas父容器。 dimension：是否判断尺寸大小。
    //-----------------setOptions应传参数：--------------------//
    // maxWidth：最大限制宽度。maxHeight：最大限制高度。fileSize：文件最大限制大小MB单位。
    //设置默认值：
    var $con = $con||$('.imgCanvas_con');//默认容器
    var setOptions = setOptions||{};
    var maxWidth = setOptions.maxWidth||750;//默认最大宽度限制为750
    var maxHeight = setOptions.maxHeight||150;//默认最大高度限制为150
    var fileSize = setOptions.fileSize||5;//默认最大文件大小限制为5MB

    imgInput = fileInput;
    //若文件为空则不往下继续执行
    if(!fileInput.files[0]){imgInput = '';return false;}

    //判断是否为指定格式的文件：
    switch (fileInput.files[0].type){
        case 'image/jpeg':break; case 'image/bmp':break; case 'image/gif':break; case 'image/png':break;
        default:
            fileInput.value = '';
            layer.msg('仅支持'+fileSize+'M以内的 .jpg, .jpeg, .bmp, .gif, .png 类型文件!',{time: 2000});
            return false;
    }

    //判断文件size大小：
    var maxSize = fileSize*1024*1024;//5Mb的字节大小：5*1024*1024=20971520;
    if(fileInput.files[0].size>maxSize){
        fileInput.value = '';
        layer.msg('仅支持'+fileSize+'M以内的 .jpg, .jpeg, .bmp, .gif, .png 类型文件!',{time: 2000});
        return false;
    }

    //在canvas上显示图片
    readBlobAsDataURL(fileInput.files[0], function (dataurl){
        //创建image对象：
        var image = new Image();
        image.src = dataurl;
        image.onload = function(){
            var imgWidth = this.width,imgHeight = this.height;//图片的尺寸

            if(dimension) {//判断图片尺寸的大小
                $con.css({maxWidth:maxWidth,maxHeight:maxHeight,position:'relative'});//设置父容器的最大的宽、高
                if (imgWidth > maxWidth || imgHeight > maxHeight) {
                    fileInput.value = '';
                    parent.layer.msg('图片尺寸不能超过'+maxWidth+'*'+maxHeight+'!',{time: 2000});
                    return false;
                }
            }

            //获取画布上下文：
            var canvas = $con.find('canvas')[0];
            if(canvas){var ctx = canvas.getContext('2d');}
            //设置宽高：
            $con.css({width:imgWidth,height:imgHeight});
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            //操作画布：
            ctx.clearRect(0, 0, imgWidth, imgHeight);
            ctx.drawImage(image, 0, 0);
            $('#edit_img').addClass('hidden');
            //显示文件名称与删除按钮：
            $('.file_name').text(fileInput.files[0].name);
            $con.css('display','block');
        };
    });
}

//删除图片预览：
function imgCanvas_remove(_this){
    $('#edit_img').addClass('hidden');
    $(_this).parent().css('display','none');
    var canvas = $(_this).parent().find('canvas')[0];
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;canvas.height = 0;
    $('.file_name').text('');
    $(imgInput).val('');
}

//获取一个image的src路径进行绘制
function drawImageInCanvas(src){

    var canvas = $('#imgCanvas')[0];
    if(canvas){var ctx = canvas.getContext('2d');}
    var image = new Image();
    image.src = src;
    image.onload = function() {
        var imgWidth = this.width, imgHeight = this.height;//图片的尺寸
        $('#imgCanvas').parent().css({width:imgWidth,height:imgHeight});
         /*canvas.width = imgWidth;
        canvas.height = imgHeight;
        //操作画布：
        ctx.clearRect(0, 0, imgWidth, imgHeight);
        ctx.drawImage(dataUrl, 0, 0);*/

        $('#imgCanvas').parent().find('img').attr('src',src);



        //显示文件名称与删除按钮：
        $('#imgCanvas').parent().css('display','block');
    };

}









// sessionStorage 的存取：name可为string或者object
function setSession(name,value){
    var obj = {};
    if(sessionStorage.getItem("obj")){
        obj = JSON.parse(sessionStorage.getItem("obj"));
    }
    //判断name类型：
    if(typeof name ==='string'){
        obj[name] = value || '';
    }else if(typeof name ==='object'){
        $.each(name,function(k,v){obj[k] = v || '';});
    }
    sessionStorage.setItem("obj",JSON.stringify(obj));
}

function getSession(name){
    var value = '';
    if(sessionStorage.getItem("obj")){
        value = JSON.parse(sessionStorage.getItem("obj"))[name];
    }
    return value;
}






//选择接收对象
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
}



//分页组件
var pagination = $("#pagination");
if(pagination[0]){
    pagination.jqPaginator({
        totalPages: 1,
        visiblePages: 9,
        currentPage: 1,
        first: '<li class="first"><a href="javascript:void(0);">首页<\/a><\/li>',
        prev: '<li class="prev"><a href="javascript:void(0);">上一页<\/a><\/li>',
        next: '<li class="next"><a href="javascript:void(0);">下一页<\/a><\/li>',
        last: '<li class="last"><a href="javascript:void(0);">末页<\/a><\/li>',
        page: '<li class="page"><a href="javascript:void(0);">{{page}}<\/a><\/li>',
        onPageChange: function (n) {
            console.log("当前第" + n + "页");
        }
    });
}



//检查ajax是否为空值
function val(v){
    if(v===null||v===undefined ||v==='null'){
        return '-';
    }else {
        return v;
    }
}


//提示信息：
function alertMsg(msg,time){var t=time||2000;parent.layer.msg(msg,{time:t});}



//死数据  待删：


setSession('userId',1977);
setSession('userId',1978);//??3
setSession('userId',1979);
setSession('userId',1980);
setSession('userId',1982);







//http://192.168.1.133:8442/cas-server/login?service=http://192.168.1.241:7000&clientId=llt
//http://liushilei.free.ngrok.cc/cas-server/login?service=http://nodewx.free.ngrok.cc&clientId=llt
