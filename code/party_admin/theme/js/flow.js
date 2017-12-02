/*日期初始化*/
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


var _page = 1;
var _size =18;
var _count = -2;
var _order = 'asc';
var _offset = _page*_size-_size;
function getFlowList(){
    $('#tab tfoot').removeClass('undis');
    var _eq = $('#flowId').val().replace(/(^\s*)|(\s*$)/g,"");//流水号ID
    var _method = $('#flowMethod').val();//流水号类型
    var _dateGt =   $('#datetimeStart').val()==='' ?'': 'date('+$('#datetimeStart').val()+')';//查询的开始时间
    var _dateLt = $('#datetimeEnd').val()==='' ?'': 'date('+$('#datetimeEnd').val()+')';//查询的结束时间
    console.log(_dateGt);
    console.log(_dateLt);
    $.ajax({
        type:"get",
        url:server_url+'/crm/mongo/flow.json',
        dataType:'json',
        data:{
            "total":-2,
            "filters[flowNumber].type":'',//可选
            "filters[flowNumber].eq":_eq,
            "filters[date].gt":_dateGt,
            "filters[date].lt":_dateLt,
            "filters[method].eq":_method,
            "order":_order,//数据库查询时的排序方式
            "limit":_size,//数据库查询时分页数据大小
            "offset":_offset,//数据库查询时，数据的偏移量，limit*page-limit
            "size":_size,//分页数据大小
            "page":_page,//当前页码
            "count":_count//默认值(负数)
        },
        success:function(res){
            console.log(res);
            $('#tab tfoot').addClass('undis');
            if(res.rows.length===0){
                $('.table-footer').addClass('undis');
                $('#tab tbody').html('<tr class="tc"><td colspan="7">未查到相关数据。</td></tr>');
                return false;
            }
            $('.table-footer').removeClass('undis');
            var html = '';
            var _actionType='';
            var _date='';
            $.each(res.rows,function(index,item){
                _date = new Date(item.date).toLocaleString();
                if (item.actionType == '1') {
                    _actionType = "登录";
                } else if (item.actionType == '2') {
                    _actionType = "登出";
                } else if (item.actionType == '3') {
                    _actionType = "注册";
                } else if (item.actionType == '4') {
                    _actionType = "修改密码";
                } else if (item.actionType == '5') {
                    _actionType = "更新用户信息";
                } else {
                    _actionType = "-";
                }
                html += `
                    <tr>
                        <!--<td><input type="checkbox" data-id=""></td>-->
                        <td>${index+1}</td>
                        <td>${item.account||'-'}</td>
                        <td>${item.flowNumber}</td>
                        <td>${item.clientId||'-'}</td>
                        <td>${item.uri||'-'}</td>
                        <td>${_actionType}</td>
                        <td>${_date}</td>

                    </tr>
                `;
            });
            $('#tab tbody').html(html);
            //显示数据从第n条到第m条：
            $('.start_num').text(res.page*res.size+1-res.size);
            $('.end_num').text(res.page*res.size+res.rows.length-res.size);
            $('.sum_num').text(res.total);
            //分页：
            $('#changePage').val(_page);
            if(res.pageCount>0){
                initPagination("#myPagination",res.pageCount,7,_page,function(num,type){
                    //			分页的ID容器 ，总页数 ， 最多显示几个分页 ，当前页 ，回调
                    if(type==='change'){
                        _page = num;
                        getFlowList();
                    }
                });

            }else {

            }
        },
        error:function(res){
            console.log(res);
        }
    });
}
$('#scroll').xb_scroll();
getFlowList();

//改变每页显示数量
function sizeChange(_this){
    _size = $(_this).data().size;
    getFlowList();
}


//点击搜索按钮：
$('#ncsubmit').click(function(){
    getFlowList();
});

//页码跳转
function goChangePage(){
    var page = parseInt($('#changePage').val().replace(/(^\s*)|(\s*$)/g,""));
    _page = page<=0?1:page;
    getFlowList();
}
































