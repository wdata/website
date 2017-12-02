var activity_id=sessionStorage.getItem('activity_id');//活动ID
var firmId=null;
$(document).ready(function(){
    $.ajax({
        type:'get',
        url: DMBServer_url + '/web/api/activity/'+activity_id+'.json',
        data:{},
        dataType:'json',
        success:function(data){
            console.log(data);
            if(data.code === 0){
                $("#title").html(data.data.title);
                $("#content").html(data.data.content);
                $("#createTime").html(new Date(data.data.createTime).toDateString());
                $("#begin").html(new Date(data.data.begin).toDateString()+'-'+new Date(data.data.end).toDateString());
                $('#signTime').html(new Date(data.data.entryBegin).toDateString()+'-'+new Date(data.data.entryEnd).toDateString());
                $('#collect').html(data.data.collects);
                $('#comment').html(data.data.comments);
                $('#signNum').html(data.data.entrys);
                if(data.data.entrys>0) { $('#signNum').siblings('a').show(); } else { $('#signNum').siblings('a').hide(); }
                $('#nice').html(data.data.upvotes);
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
    $.ajax({
        type:'get',
        url:DMBServer_url+'/web/api/users/entry.json',
        data:{'id':activity_id},
        success:function(data){
            console.info(data)
            if(data.data){
                var code="";
                $.each(data.data,function(index,item){
                    console.info(item.name)
                    code+=`
                        <div class="list fl">
                            <img src=${"http://192.168.1.42:8888/file-server/api/images/"+item.photo} alt="" >
                            <div class="tc">${item.name}</div>
                        </div>
                    `
                })
                $('.showDetail_modal .modal-body').html(code)
            }
        }
    })
});
