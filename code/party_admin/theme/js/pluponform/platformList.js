var _size = 10,_page = 1;var _type='16',_subType='64';
var _timeout = 5000;//ajax超时设置
//获取平台列表
function getPlatformList(){
    var _name = $('#platformName').val();
    var _unit = $('#unit').val();
    $.ajax({
        type:"get",
        url:server_url+'/plat/api/platform/list.json',
        dataType:'json',
        data:{
            "sort":'begin',
            "dir":'desc',
            "filters[type].eq":_type,
            "filters[subType].eq":_subType,
            "filters[name].like":_name,
             /*"filters[flowNumber].eq":_eq,
            "filters[method].eq":_method,
            "filters[date].gt":_dateGt,
            "filters[date].lt":_dateLt,*/
            "size":_size,//分页数据大小
            "page":_page//当前页码
        },
        timeout:_timeout,
        success:function(res){
            console.dir(res.data);
            if(res.data==null){
                $('#platformList tbody').html("<tr class='tc'><td colspan='12'>"+res.message+"</td></tr>");
                $('#pa_table tbody').html("<tr class='tc'><div><td colspan='12'>"+''+"</div></td></tr>");
                return false;
            }
            var arr = res.data.items;
            var html = '';
            var _date='';
            $.each(arr,function(index,item){
                _date = new Date(item.begin).toLocaleString();
                html += `
                    <tr class="tc">
                        <td><div><label style=""><input type="checkbox" value="${item.id}" name="checkbox"></label></div></td>
                        <td><div>${index+1}</div></td>
                        <td><div>${item.id}</div></td>
                        <td><div>${item.name}</div></td>
                        <td><div>${item.extension.versionCode}</div></td>
                        <td><div>${item.extension.locationId}</div></td>
                        <td class="td"><div class="desc_con">${item.desc}</div></td>
                        <td><div>${item.extension.orgName||'-'}</div></td>
                        <td><div>${item.parentName||'-'}</div></td>
                        <td>
                            <div>
                                <a onclick="pfDetails(${item.parentId||''})" class="${item.parentName?'':'undis'}">${item.parentName?(item.parentName+'详情'):'-'}</a>
                                <span class="${item.parentName?'undis':''}">-</span>
                            </div>
                        </td>
                        <td><div>${_date}</div></td>
                        <td><div><a class="appG" target="_blank" onclick="setS(${item.id})" href="../app/appList.html">应用管理</a></div></td>
                    </tr>

                `;
            });
            $('#platformList tbody').html(html);
            $('#pa_table tbody').html(html);
            //显示数据从第n条到第m条：
            $('.start_num').text(res.data.page*res.data.size+1-res.data.size);
            $('.end_num').text(res.data.page*res.data.size+res.data.items.length-res.data.size);
            $('.sum_num').text(res.data.count);
            //分页：
            $('#changePage').val(_page);
            console.log(res.data.pageCount);
            if(res.data.pageCount>0){
                initPagination("#myPagination",res.data.pageCount,7,_page,function(num,type){
                    //			分页的ID容器 ，总页数 ， 最多显示几个分页 ，当前页 ，回调
                    if(type==='change'){
                        _page = num;
                        getPlatformList();
                    }
                });

            }
        },
        error:function(res){
            console.log(res);
            returnMessage(5,'获取平台列表数据失败，请稍后重试！');
        }
    });
}

getPlatformList();
//绑定org_id
function setS(id){
    sessionStorage.setItem('pf_id',id);
    sessionStorage.setItem('has_pf_id',true);
    return true;
}

//查看上级单位详情
function pfDetails(id){
    if(id==='')return false;
    sessionStorage.setItem('pf_id',id);
    sessionStorage.setItem('pf_id_bool',true);
    window.open('details.html');
}


var delArr=[];
//单个删除
/*function delPlatform(id){
    BootstrapDialog.show({
        'type': 'type-warning',
        'title': '返回信息',
        'message': '确定要删除所选平台吗？',
        'buttons': [{
            label: '确定',
            cssClass: 'btn-warning',
            action: function (dialog) {
                delArr.push(id);
                del();
                dialog.close();
            }
        }]
    });
}*/
//多个删除
function dels(){
    var arr = [];
    var check = document.getElementsByName('checkbox');
    check.forEach(function(item,index){
        if($(item).is(':checked')){
            arr.push($(item).val());
        }
    });
    if(arr.length>0) {
        BootstrapDialog.show({
            'type': 'type-warning',
            'title': '返回信息',
            'message': '确定要删除所选平台吗？',
            'buttons': [{
                label: '确定',
                cssClass: 'btn-warning',
                action: function (dialog) {
                    delArr = arr;
                    del();
                    dialog.close();
                }
            }]
        });
    }
}
function del(){
    if(delArr.length<1)return false;
    $.ajax({
        type:"post",
        url:server_url+'/plat/api/platform/sc.json',
        dataType:'json',
        data:{
            "ids":delArr.join(',')
        },
        timeout:_timeout,
        success:function(res){
            console.log(res);
            if(res.data==null){
                successMsg(res.code,0,res.message);
            }else{
                returnMessage(2,res.message);
            }
            getPlatformList();
            delArr=[];
        },
        error:function(res){
            delArr=[];
            console.log(res);
            returnMessage(5,'操作失败，请稍后重试！');
        }




    })
}
//点击搜索按钮：
$('#search_btn').click(function(){
    getPlatformList();
});
//页面跳转
function goChangePage(page){
    _page = parseInt($('#changePage').val());
    getPlatformList();
}
//改变页面显示的数据数量：
$('.dropdown-menu li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    $(this).parent().siblings('button').find('.page-size').text($(this).text());
    if(parseInt($(this).text())===_size){
        return false;
    }else {
        _size=parseInt($(this).text());
        getPlatformList();
    }
});

//页码跳转
function goChangePage(){
    var page = parseInt($('#changePage').val().replace(/(^\s*)|(\s*$)/g,""));
    _page = page<=0?1:page;
    getPlatformList();
}

//初始化日期插件
$("#datetimeStart").datetimepicker({
    format: "yyyy-mm-dd hh:ii:ss",
    //minView:'month',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN'
    //pickerPosition: "bottom-left"
}).on("click",function(){
    $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
});
$("#datetimeEnd").datetimepicker({
    format: "yyyy-mm-dd hh:ii:ss",
    //minView:'month',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN'
    //pickerPosition: "bottom-left"
}).on("click",function(){
    $("#datetimeEnd").datetimepicker("setStartDate",$("#datetimeStart").val())
});
//表格滚动条
$('.table_con').xb_scroll();

