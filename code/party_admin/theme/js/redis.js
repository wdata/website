
var _order='asc',_size=10,_page= 1,_count=-1;
function getRedisList(){
    console.log('click');
    var _redis_key = $('#redis_key').val().replace(/(^\s*)|(\s*$)/g,"");
    var _redis_prefix = $('#redis_prefix').val();
    console.log(_redis_prefix);
    var _th1 = _redis_prefix=='aas:account:sid'?'sid缓存key':_redis_prefix=='aas:account:uid'?'uid缓存key':_redis_prefix=='aas:resources'?'resource缓存key':'缓存key';
    var _th2 = _redis_prefix=='aas:account:sid'?'sid缓存值':_redis_prefix=='aas:account:uid'?'uid缓存值':_redis_prefix=='aas:resources'?'resource缓存值':'缓存值';
    var _none = _redis_prefix=='aas:account:profile'?'':'undis';
    $.ajax({
        type:"get",
        url:server_url+'/crm/sys/redis/query.json',
        dataType:'json',
        data:{
            "redis_key":_redis_key,
            "redis_prefix":_redis_prefix,
            "order":_order,//数据库查询时的排序方式
            "size":_size,//分页数据大小
            "page":_page//当前页码
            //"count":_count//默认值(负数)
        },
        success:function(res){
            console.log(res);
            if(res.items===null)return false;
            var thead = `
                <tr>
                    <th><input type="checkbox" onclick="checkAll('tab',this)"></th>
                    <th>序号</th>
                    <th>${_th1}</th>
                    <th>${_th2}</th>
                    <th class="${_none}">xsessionid</th>
                </tr>
            `;
            $('#tab thead').html(thead);
            var tbody = '';
            $.each(res.items,function(index,item){

                tbody += `
                    <tr>
                        <td><input type="checkbox" value="${item.id}"></td>
                        <td>${index+1}</td>
                        <td>${item.id}</td>
                        <td>${item.username||item.value}</td>
                        <td class="${_none}">${item.xsessionid||''}</td>
                    </tr>
                `;
            });
            $('#tab tbody').html(tbody);
            $('#tab tfoot').addClass('undis');

            //显示数据从第n条到第m条：
            $('.start_num').text(res.page*res.size+1-res.size);
            $('.end_num').text(res.page*res.size+res.items.length-res.size);
            $('.sum_num').text(res.count);
            //分页：
            if(res.pageCount>0){
                initPagination("#myPagination",res.pageCount,7,_page,function(num,type){
                    //			分页的ID容器 ，总页数 ， 最多显示几个分页 ，当前页 ，回调
                    if(type==='change'){
                        _page = num;
                        getRedisList();
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
getRedisList();

function isDelete(){
    var redis = [];
    var check = $('#tab tbody').find('[type="checkbox"]');
    $.each(check,function(index,item){
        if($(item).is(':checked')){
            redis.push($(item).val());
        }
    });
    if(redis.length>0) {
        BootstrapDialog.show({
            'type': 'type-warning',
            'title': '返回信息',
            'message': '确定要删除所选缓存吗？',
            'buttons': [{
                label: '确定',
                cssClass: 'btn-warning',
                action: function (dialog) {
                    dialog.close();
                    deleteRedis(redis);
                }
            }]
        });
    }

}
function deleteRedis(redis){
    var _redis_prefix = $('#redis_prefix').val();
    $.ajax({
        type:"post",
        url:server_url+'/crm/sys/redis/del.json',
        dataType:'json',
        data:{
            "ids":redis.join(','),
            "r_prefix":_redis_prefix
        },
        success:function(res){
            console.log(res);
            if(res.statusCode==='200') {
                $('#tab thead [type="checkbox"]').prop('checked', false);
                BootstrapDialog.show({
                    'type': 'type-success',
                    'title': '返回信息',
                    'message': res.message,
                    'buttons': [{
                        label: '确定',
                        cssClass: 'btn-success',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
                getRedisList();
            }

        },
        error:function(res){
            console.log(res)
        }
    })




}














$('#scroll').xb_scroll();
//条件搜索
$('#ncsubmit').click(function(){
    getRedisList();
});

//改变每页显示数量
function sizeChange(val){
    _size = val;
    getRedisList();
}