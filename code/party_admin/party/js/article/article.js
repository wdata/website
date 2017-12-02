/**
 * Created by Administrator on 2017/6/26.
 */
/*日期初始化*/
$("#datetimeStart").datetimepicker({
    format: "yyyy-mm-dd",
    minView:'month',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
}).on("click",function(){
    $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
});
$("#datetimeEnd").datetimepicker({
    format: "yyyy-mm-dd",
    minView:'month',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
    //pickerPosition: "bottom-left"
}).on("click",function(){
    $("#datetimeEnd").datetimepicker("setStartDate",$("#datetimeStart").val())
});

// getComp("#company_select");

var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var keyword = [];  //搜索内容
var flag = null;
$(document).ready(function(){
    label(paGe,pageNum);
});
function label(page,size,keyword){
    var pageCount,vpage;   //初始的
    //开始时显示数据
    var dataObject = {
        page:page,
        size:size
    };
    //如果有keyword，则说明是搜索
    if(keyword){
        dataObject["keyword"] = keyword[0];
        dataObject["begin"] = keyword[1];
        dataObject["end"] = keyword[2];
        dataObject["type"] = keyword[3];
        // dataObject["firmId"] = keyword[4];
    }

    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/newsList.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            const list = $(".list");  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 0){
                var listData = '';
                $.each(data.data.items,function(index,val){
                    var type = val.type===1?"本局党建动态":"党建每日读";  //位置,1:首页，2频道页
                    listData += '<tr> <td><input onclick="checkDown(this)" type="checkbox"  data-id="'+ val.id +'"></td> <td>'+ (index + 1 + page * 10) +'</td> <td>'+ val.title +'</td> <td>'+ type +'</td> <td>'+ val.author +'</td> <td>'+ val.createTime +'</td> <td>'+ val.companyName +'</td> <td>'+ val.views +'</td> <td>'+ val.collects +'</td> <td class="caozhuo"> <button onclick="view(this)" class="btn btn-info btn-dialog btn-dialog-tab" href="party/article/article/article_view.html" >查看</button> <button class="btn btn-info btn-dialog btn-dialog-tab" href="party/article/article/article_edit.html" onclick="modifylick(this)" >修改</button> <a onclick="deteleAlone(this)" >删除</a> </td> </tr>';
                });
                list.append(listData);

                //分页
                pageCount = data.data.pageCount;
                vpage = pageCount>10?10:pageCount;
                if(pageCount>1){
                    $('.pages').show();
                    flag = true;
                    initPagination('#pagination',pageCount,vpage,page + 1,function(num,type){
                        if(type === 'change'){
                            paGe = num - 1;
                            label(paGe,pageNum,keyword);
                        }
                    });
                }else{
                    if(flag){
                        paGe = 0;
                        label(paGe,pageNum,keyword);
                        flag = false;
                        $('.pages').hide();
                    }
                }
            }else{
                //无数据提醒框
                // returnMessage(2,'暂无数据！');
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}

/*跳转到第几页*/
function pageTo(_this){
    var max=parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
    var val=parseInt($(_this).siblings('input').val());
    var num=(val>0?val:1)>max?max:(val>0?val:1);
    paGe = num - 1;
    label(paGe,pageNum);
    $(_this).siblings('input').val(num);
}


//******************************************修改 ---  跳转至添加页面**************************************************
function modifylick(self){
    session("modify_Id",$(self).parent().siblings("td").find("input[type=checkbox]").attr("data-id"));   //将频道ID存入临时存储：modify_Id
}
//******************************************查看---查看页面**************************************************
function view(self){
    session("view_Id",$(self).parent().siblings("td").find("input[type=checkbox]").attr("data-id"));   //将频道ID存入临时存储：view_Id
}

//******************************************删除**************************************************
//删除点击事件  参数：tr下第一个th中input的属性ID
function deteleAlone(wo){
    var self = wo;
    confirmMsg("是否删除文章",function(dialog){
        var id = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
        dialog.close();  //关闭确定提示框
        deteleRmake(id);      //调用删除函数，删除数组内的频道
    });
}
//选择多个删除
function deteleAll(){
    var dataID = $('#lebel_tab tbody input[type=checkbox]:checked');   //单选按钮
    var id = [];
    $.each(dataID,function(index,val){
        id.push($(val).attr("data-id"));   //获取id
    });
    if(!(id.length === 0)){
        confirmMsg("是否删除记录",function(dialog){
            dialog.close();  //关闭确定提示框
            deteleRmake(id);        //调用删除函数，删除数组内的党费记录
        });
    }else{
        returnMessage(2,'请选择至少一条数据进行删除！');
    }
}


//******************************************  搜索  **************************************************
function search(){
    keyword = [];
    $.each($('.input-sm .form-control'),function(index,val){
        keyword.push($(val).val());
    });
    if(keyword.length >= 1){
        paGe = 0;   //如果在1以上页面，则返回1页面并搜索内容
        //调用党费记录列表
        label(paGe,pageNum,keyword);
    }else{
        //无内容，不搜索，并且提示
        returnMessage(3,'请输入搜索内容！');
    }
}

//-----------------------------------------删除函数 参数：频道ID-------------------------------------------------------
function deteleRmake(id){
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/news/delete.json',
        data:{
            ids:id    //频道ID,数组
        },
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                //删除成功
                returnMessage(1,'删除成功！');
                label(paGe,pageNum);
            }else{
                //无数据提醒框
                returnMessage(2,'修改失败！');
            }
            $("#lebel_tab thead th:first input").removeAttr("checked");
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}