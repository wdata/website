/**
 * Created by Administrator on 2017/6/23.
 */
//必填初始化
blurCheck($("#addForm"));
blurCheck($("#editForm"));

$("#graph").hide();
var pageNum = 10;//每次页数
var paGe = 0;   //第几页  修改时，出现在被修改页面
var keyword = [];  //搜索内容
var orgId = 1 ; //组织ID
var flag = null;
var name = "珠海市国家税务局党委";  //记录点击名

label(paGe,pageNum,orgId);  //开始时显示所有人员

var setting = {
    data : {
        simpleData : {
            enable : true,
            idKey: "id",
            pIdKey: "pid",
            rootPId: 0
        }
    },
    callback: {
        onClick: treeClick
    }
};

zTree();   //刷新数据

function zTree(){
    $.ajax({
        type:'get',
        url:  DMBServer_url + '/web/api/organizations.json',
        // data: {
        //     firmId:100
        // },
        dataType:'json',
        success:function(data){
            if(data.code === 0){

                $.fn.zTree.init($("#treeDemo"), setting, data.data);

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

function treeClick(event, treeId, treeNode){
    orgId = treeNode.id;
    name = treeNode.name;
    paGe = 0; //回到0
    label(paGe,pageNum,orgId,keyword);
    graphAjax();   //刷新统计图
}

//根据ID显示用户列表
function label(page,size,orgId,keyword){
    var pageCount,vpage;   //初始的
    //开始时显示数据
    var dataObject = {
        page:page,
        size:size,
        orgId:orgId,
        keyword:keyword
    };
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/users.json',
        data:dataObject,
        dataType:'json',
        success:function(data){
            const list = $(".list");  //将选择器赋值给常量
            list.empty();  //清空
            if(data.code === 0){
                var listData = '';
                $.each(data.data.items,function(index,val){
                    //阶段 0:群众,10:积极份子,20:重点对象,30预备党员,100党员
                    var type = '';
                    switch(val.type){
                        case 0:type = '群众';
                            break;
                        case 10:type = '积极份子';
                            break;
                        case 20:type = '重点对象';
                            break;
                        case 30:type = '预备党员';
                            break;
                        case 100:type = '党员';
                            break;
                    }
                    var jobs = '';
                    if(val.jobs){
                        $.each(val.jobs,function(x,y){
                            jobs += y.name + ' ';
                        })
                    }
                    var joinPartyDate = val.joinPartyDate?val.joinPartyDate:" ";
                    listData += '<tr> <td><input onclick="checkDown(this)" type="checkbox"  data-id="'+ val.id +'"></td> <td>'+ val.name +'</td> <td>'+ jobs +'</td> <td>'+ val.phone +'</td> <td>'+ type +'</td> <td>'+ joinPartyDate +'</td> <td>'+ val.organName +'</td> <td>'+ val.changeDate +'</td> <td class="caozhuo"> <button class="btn bg-info text-muted btn-dialog-tab" href="party/member/member/member_edit.html" onclick="details($(this))">修改</button> <a onclick="deteleAlone(this)" >删除</a> </td> </td> </tr>'

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
                            label(paGe,pageNum,orgId,keyword);
                        }
                    });
                }else{
                    if(flag){
                        paGe = 0;
                        label(paGe,pageNum,orgId,keyword);
                        flag = false;
                        $('.pages').hide();
                    }
                }
            }else{
                //无数据提醒框
                // returnMessage(2,'暂无数据！');
                $('.pages').hide();
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
    label(paGe,pageNum,orgId,keyword);
    $(_this).siblings('input').val(num);
}
//******************************************  搜索  **************************************************
function search(){
    keyword = $("#account").val();
    paGe = 0;
    label(paGe,pageNum,orgId,keyword);
}
//******************************************  修改个人详情  **************************************************
function details(self){
    session("modify_Id",$(self).parent().siblings("td").find("input[type=checkbox]").attr("data-id"));   //将频道ID存入临时存储：channel_xiuGai_Id
}

//******************************************  导出  **************************************************
function Export(_this){
    $("#orgId").val(orgId);
    var form = $("#searchForm").serialize();  //将form序列化
    $(_this).attr({"href":DMBServer_url + "/web/api/users/export.json?" + form});
}
//******************************************  导入  **************************************************
function Import(_this){

    //判断格式
    var name = _this.value;
    var postfix = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if(postfix!=='xls' && postfix!=='xlsx'){
        returnMessage(2,'请选择xls和xlsx的格式文件上传！');
        _this.value==' ';
        return false;
    }else{

        var form = new FormData($("#Import")[0]);
        $.ajax({
            type:'post',
            url:  DMBServer_url + '/web/api/users/import.json',
            data: form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){

                    returnMessage(1,'导入成功：'+ data.data.successCount + " ； 导入失败数：" + data.data.failCount);
                    label(paGe,pageNum,orgId,keyword);
                    importDetails(data);
                }else{
                    //data.code === -1
                    returnMessage(2,'data.code为-1');
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
        $(_this).val("");   //清空数据，以防noChange内容不变时，不执行函数
    }
}
//******************************************  导入模板下载  **************************************************
function templateExport(_this){
    $(_this).attr({"href":DMBServer_url + "/web/api/download/users.xls" });
}

//******************************************删除**************************************************
//删除点击事件  参数：tr下第一个th中input的属性ID
function deteleAlone(wo){
    var self = wo;
    confirmMsg("是否删除记录",function(dialog){
        var id = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
        dialog.close();  //关闭确定提示框
        deteleRmake(id);      //调用删除函数，删除数组内的党费记录
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

//----------------删除函数 参数：党费记录ID----------------
function deteleRmake(id){
    $.ajax({
        type:'post',
        url: DMBServer_url + '/web/api/user/delete.json',
        data:{
            ids:id    //党费记录ID,数组
        },
        dataType:'json',
        traditional:true,
        success:function(data){
            if(data.code === 0){
                //删除成功
                returnMessage(1,'删除成功！');
                label(paGe,pageNum,orgId,keyword);
            }else{
                //无数据提醒框
                returnMessage(2,'删除失败！');
            }
            $("#lebel_tab thead th:first input").removeAttr("checked");
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//******************************************添加组织**************************************************
//------------------取消---------------------
function cancel(){
    //隐藏添加标签框
    $(".new-label").removeClass("show").removeClass("in");
    $("#addForm").addClass("hidden");  //隐藏
    $("#editForm").addClass("hidden");  //隐藏
}
//------------------确定---------------------
function addOrg(){
    $(".new-label").addClass("show").addClass("in");
    $("#addForm").removeClass("hidden");          //出现添加框
    superior(0,$("#addPid"));
}
//------------------根据支部和党组选择不同变化---------------------
function radioModify(_this){
    var sum = $(_this).val();
    superior(sum,$("#addPid"));
}
//---------------根据党组和支部变化获取上级组织列表  组织类型 0：支部 1：党组
function superior(type,element){
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/branchs.json',
        data:{
            // firmId:100,
            type:type
        },
        dataType:'json',
        success:function(data){
            element.empty();     //清空
            if(data.code === 0){
                var listData = null;
                $.each(data.data,function(index,val){
                    listData += '<option value="'+ val.id +'">'+ val.name +'</option>';
                });
                element.append(listData);
            }else{
                //无数据提醒框
                returnMessage(2,'暂无数据！');
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
//-------------------------------------- 添加确定---------------------------------------------------
function addModify(){
    // $(".firmId").val(100);   //添加公司ID
    var form = new FormData($("#addForm")[0]);       //需要是JS对象
    $.ajax({
        type:'post',
        url:  DMBServer_url + '/web/api/organization/add.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0){

                returnMessage(1,'添加成功');
                //清空数据
                $(".name").text("");
                zTree();

            }else{
                returnMessage(2,data.message);
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

//******************************************编辑组织**************************************************
function editOrg(){

    if(!(orgId === 1)){
        $(".new-label").addClass("show").addClass("in");
        $("#editForm").removeClass("hidden");          //出现添加框
        $(".editId").val(orgId);  //获取ID

        //根据组织详情获取组织名和上级组织
        $.ajax({
            type:'get',
            url: DMBServer_url + '/web/api/organization/'+ orgId +'.json',
            data:{},
            dataType:'json',
            success:function(data){
                if(data.code === 0){

                    $("#editForm input[name=name]").val(data.data.name);
                    var type = data.data.type;
                    var pNmme = data.data.pNmme;

                    $.ajax({
                        type:'get',
                        url: DMBServer_url + '/web/api/branchs.json',
                        data:{
                            // firmId:100,
                            type:type
                        },
                        dataType:'json',
                        success:function(data){
                            $("#editPid").empty();     //清空
                            if(data.code === 0){
                                var listData = null;
                                $.each(data.data,function(index,val){
                                    if(pNmme === val.name){
                                        listData += '<option selected value="'+ val.id +'">'+ val.name +'</option>';
                                    }else{
                                        listData += '<option value="'+ val.id +'">'+ val.name +'</option>';
                                    }
                                });
                                $("#editPid").append(listData);
                            }else{
                                //无数据提醒框
                                returnMessage(2,data.message);
                            }
                        },
                        error:function(data){
                            //报错提醒框
                            returnMessage(2,'报错：' +  data.status);
                        }
                    });

                }else{
                    //无数据提醒框
                    returnMessage(2,'暂无数据！');
                }
            },
            error:function(data){
                //报错提醒框
                returnMessage(2,'报错：' +  data.status);
            }
        });

    }else{
        returnMessage(2,"请选择组织");
    }
}
function editModify(){
    // $(".firmId").val(100);   //添加公司ID
    var form = new FormData($("#editForm")[0]);       //需要是JS对象
    $.ajax({
        type:'post',
        url:  DMBServer_url + '/web/api/organization/update.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0){

                returnMessage(1,'添加成功');
                //清空数据
                $(".name").text("");
                zTree();

            }else{
                //data.code === -1
                returnMessage(2,data.message);
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

//******************************************删除组织**************************************************
function remove(){
    if(!(orgId === 1)){
        confirmMsg("是否删除该组织",function(dialog){
            dialog.close();  //关闭确定提示框
            $.ajax({
                type:'post',
                url:  DMBServer_url + '/web/api/organization/delete.json',
                data: {
                    id:orgId
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){

                        returnMessage(1,'删除成功');
                        zTree();

                    }else{
                        returnMessage(2,data.message);
                    }
                },
                error:function(data){
                    //报错提醒框
                    returnMessage(2,'报错：' +  data.status);
                }
            });
        });
    }
}
//******************************************查看统计信息**************************************************
function viewGraph(){
    $("#user").hide();
    $("#graph").show();

    graphAjax();
}

function graphAjax(){

    $("#graph .graph-header-top span").text(name);

    var sexElement = echarts.init(document.getElementById('sex'));
    var partyAgeElement = echarts.init(document.getElementById('partyAge'));
    var ageElement = echarts.init(document.getElementById('age'));
    var degreeElement = echarts.init(document.getElementById('degree'));


    $.ajax({
        type:'get',
        url:  DMBServer_url + '/web/api/users/analyse.json',
        data: {
            orgId:orgId
        },
        dataType:'json',
        success:function(data){
            if(data.code === 0){

                //性别
                var sex = {title:{text:"性别比例",x:"center"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",left:"left",data:["男","女","未知"]},series:[{name:"性别",type:"pie",radius:"55%",center:["50%","60%"],data:[{value:data.data.sex.man,name:"男"},{value:data.data.sex.woman,name:"女"},{value:data.data.sex.unknow,name:"未知"},],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]};
                sexElement.setOption(sex);
                sexElement.resize();

                //党龄
                var partyAge = {title:{text:"党龄结构",x:"center"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",left:"left",data:["5年及以下","5年~10年","10年~15年","15年~20年","20年及以上","未知"]},series:[{name:"党龄",type:"pie",radius:"55%",center:["50%","60%"],data:[{value:data.data.partyAge.lt5,name:"5年及以下"},{value:data.data.partyAge.gt5lt10,name:"5年~10年"},{value:data.data.partyAge.gt10lt15,name:"10年~15年"},{value:data.data.partyAge.gt15lt20,name:"15年~20年"},{value:data.data.partyAge.gt20,name:"20年及以上"},{value:data.data.partyAge.unknow,name:"未知"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]};
                partyAgeElement.setOption(partyAge);
                partyAgeElement.resize();

                //年龄
                var age = {title:{text:"年龄结构",x:"center"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",left:"left",data:["30岁及以下","30岁~40岁","40岁~50岁","50岁~60岁","60岁及以上","未知"]},series:[{name:"年龄",type:"pie",radius:"55%",center:["50%","60%"],data:[{value:data.data.age.lt30,name:"30岁及以下"},{value:data.data.age.gt30lt40,name:"30岁~40岁"},{value:data.data.age.gt40lt50,name:"40岁~50岁"},{value:data.data.age.gt50lt60,name:"50岁~60岁"},{value:data.data.age.gt60,name:"60岁及以上"},{value:data.data.age.unknow,name:"未知"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]};
                ageElement.setOption(age);
                ageElement.resize();

                //学历
                var degree = {title:{text:"学历人员比例",x:"center"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",left:"left",data:["小学","中学","中专","高中","专科","本科","硕士","博士","未知"]},series:[{name:"学历",type:"pie",radius:"55%",center:["50%","60%"],data:[{value:data.data.degree.primary,name:"小学"},{value:data.data.degree.junior,name:"中学"},{value:data.data.degree.technical,name:"中专"},{value:data.data.degree.senior,name:"高中"},{value:data.data.degree.diploma,name:"专科"},{value:data.data.degree.undergraduate,name:"本科"},{value:data.data.degree.master,name:"硕士"},{value:data.data.degree.doctor,name:"博士"},{value:data.data.degree.unknow,name:"未知"}],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]};
                degreeElement.setOption(degree);
                degreeElement.resize()
            }else{
                // returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });
}
//返回
function returnUser(){
    $("#user").show();
    $("#graph").hide();
}
/*  导入成功导入失败
 ---------------------------------------------------------------------------------------------------------*/
function importDetails(data){
    var pageCount,vpage;   //初始的
    var html,sum = 1;
    var import_list = $(".import_list");
    import_list.empty();
    $.each(data.data.failList,function(index,val){
        //阶段 0:群众,10:积极份子,20:重点对象,30预备党员,100党员
        var type = '';
        switch(val.type){
            case 0:type = '群众';
                break;
            case 10:type = '积极份子';
                break;
            case 20:type = '重点对象';
                break;
            case 30:type = '预备党员';
                break;
            case 100:type = '党员';
                break;
        }
        var joinPartyDate = val.joinPartyDate?val.joinPartyDate:" ";
        html += '<tr> <td>'+ sum +'</td> <td>'+ val.name +'</td> <td>'+ val.phone +'</td> <td>'+ type +'</td> <td>'+ (new Date(joinPartyDate)).toLocaleString() +'</td> <td>'+ val.degree +'</td> </tr>'
        // <tr>
        // <td>姓名</td>
        // <td>职位</td>
        // <td>联系电话</td>
        // <td>政治面貌</td>
        // <td>入党时间</td>
        // <td>所在组织</td>
        // <td>转入本支部时间</td>
        // </tr>
        sum++;
    });
    import_list.append(html);

    // 显示弹出框
    $("#importModal").addClass("show in");
}
function importDown(){
    // 关闭弹出框
    $("#importModal").removeClass("show in");
}