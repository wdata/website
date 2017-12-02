$(document).ready(function(){
    $("#begin").datetimepicker({
        format: "yyyy-mm-dd hh:mm:ss",
        //minView:'month',
        startDate:(new Date()),
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
    }).on("click",function(){
        $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
    }).on('changeDate',function(){
        if($(this).val()){
            $(this).siblings('.error').hide();
            $(this).removeClass('error').addClass('valid')
        }
    });
    $("#end").datetimepicker({
        format: "yyyy-mm-dd hh:mm:ss",
        //minView:'month',
        startDate:(new Date()),
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
    }).on("click",function(){
        $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
    }).on('changeDate',function(){
        if($(this).val()){
            $(this).siblings('.error').hide();
            $(this).removeClass('error').addClass('valid')
        }
    });
    var advertise_id=sessionStorage.getItem("advertise_id");
    load(advertise_id);
});



//富文本编辑器
var wangEditor = window.wangEditor;
var editor = new wangEditor('#editor_id');  //ID元素
editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
// 自定义菜单配置
editor.customConfig.menus = [
    'head',  // 标题
    'bold',  // 粗体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    'quote',  // 引用
    // 'emoticon',  // 表情
    'image',  // 插入图片
    'table',  // 表格
    'video',  // 插入视频
    'code',  // 插入代码
    'undo',  // 撤销
    'redo'  // 重复
];
// 上传图片
//    editor.config.uploadImgUrl = '/upload';
//    editor.config.uploadParams = {
//        // token1: 'abcde',
//        // token2: '12345'
//    };
// onchange 事件
editor.customConfig.onchange = function (html) {
    // html 即变化之后的内容
    console.log(editor.txt.html())
};
editor.create();   //开启（初始化），需要放在最后

$(".w-e-toolbar ,.w-e-menu").css("z-index",1001);
$(".w-e-text-container").css("z-index",1000);  //原级别太高为10001会影响提示框的效果


function load(id){
    $.ajax({
        type:'get',
        url:  DMBserver_notice_url +'/web/api/notices/'+id+'.json',
        data: {},
        dataType:'json',
        success:function(data){
            if(data.code === 0){
                //添加数据
                $("#edit_id").val(id);
                $("#title").val(data.data.title);  //标题
                $(".abs").attr("src",unite_img_url + data.data.icon);  //图片
                // $("#fileName").val(data.data.icon);
                editor.txt.html(data.data.content);  //设置富文本编辑器内容
                $("#content").val(data.data.content); //内容

                $("#begin").val(data.data.beginTime);  //指定发送时间
                $("#end").val(data.data.endTime);  //结束时间
            }else{
                returnMessage(2,'暂无数据');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });

}
function editAjax(){
    if($("#newForm").valid()){

        //将富文本编辑器内容复制给input[name=content
        // 读取 html
        $("#content").val(editor.txt.html());

        var form = new FormData($("#newForm")[0]);
        $.ajax({
            type:'post',
            url:  DMBserver_notice_url + '/web/api/notices/update.json',
            data:form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){
                    returnMessage(1,'修改公告成功！');
                }else{
                    returnMessage(2,'修改失败data.code为：' + data.code);
                }
            },
            beforeSend:function(xhr){
                $('.opering-mask').show().find('.con').text('正在处理中，处理结束后该弹窗消失！');
            },
            complete:function(){
                $('.opering-mask').hide();
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });
    }
}