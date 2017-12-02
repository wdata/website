/**
 * Created by Administrator on 2017/6/26.
 */
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
editor.customConfig.onchange = function (html) {
    // html 即变化之后的内容
    console.log(editor.txt.html())
};
editor.create();   //开启（初始化），需要放在最后
$(".w-e-toolbar ,.w-e-menu").css("z-index",1001);
$(".w-e-text-container").css("z-index",1000);  //原级别太高为10001会影响提示框的效果



console.log(sessionStorage.getItem("modify_Id"));
var modify_Id = sessionStorage.getItem("modify_Id");



//修改 -- 函数 ******************************************数据详情*****************************************************
$.ajax({
    type:'get',
    url:  DMBServer_url +  '/web/api/news/'+ modify_Id +'.json',
    data: {},
    dataType:'json',
    success:function(data){
        if(data.code === 0){

            //添加数据
            $("#position").val(data.data.position);   //频道位置
            $("#name").val(data.data.name);  //频道名
            $("#sort").val(data.data.sort);  //排序值
            $("#icon").val(data.data.icon);
            $("#urlDiZhi").val(data.data.url);  //url
            $("#remark").val(data.data.remark); //描述


            $("#edit-id").val(data.data.id);  //ID
            data.data.type === 1 ? $("#type option").eq(0).attr("selected"):$("#type option").eq(1).attr("selected");
            $(".abs").attr("src",unite_img_url + data.data.image);  //图片
            $("#content").html(data.data.content);  //内容
            editor.txt.html(data.data.content);
            $("#title").val(data.data.title);  //标题




        }else{
            //data.code === -1
            returnMessage(2,'暂无数据');
        }
    },
    error:function(data){
        //报错提醒框
        returnMessage(2,'报错：' +  data.status);
    }
});

//****************************************************修改上传*****************************************************
function determine(){
    //修改,调用修改ajax

    //内容
    $("#content").val(editor.txt.html());

    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    $.ajax({
        type:'POST',
        url: DMBServer_url + '/web/api/news/update.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0){

                returnMessage(1,'修改成功');

            }else{
                //data.code === -1
                returnMessage(2,'修改失败data.code为：' + data.code);
            }
        },
        beforeSend:function(){
            $('.opering-mask').show().find('.con').text('正在处理中，处理结束后该弹窗消失！');
        },
        complete:function(){
            $('.opering-mask').hide()
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}