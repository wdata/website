/*操作消息弹窗*/
function returnMessage(message){
    alertMsg(message,function(dialog){
        dialog.close();
    })
}

/*分页点击函数    ../../theme/video/video.mp4*/
var pageNum=1;  //每页显示数
var flag=true;	//判断字段
var itemsArr=[];  
function pageListCon(page,size){
	var pageCount,vpage;
	$('.direct-list ul').html(' ')
	$.ajax({
		type:'get',
		url:'/dmb/api/v1/live/auditlist.json',
		dataType:'json',
		data:{'page':page,'size':size,'nickname':$('.input-nickname').val()},
		success:function(data){
			console.info(data);
			var code="";
			for(var i=0;i<data.entity.items.length;i++){
				code+=`
					<li class="directlis-li">
                    	<div class="direct-pic-box" class="directlis-link"> 
	                        <video src="${data.entity.items[i].videoUrl}"  onclick="vertifyAlert(this)" autoplay data-id=${data.entity.items[i].liveId} data-reasult=${data.entity.items[i].auditResult} data-title=${data.entity.items[i].liveId}></video>liveTitle
	                        <div class="word">${data.entity.items[i].liveName}</div>
                    	</div>
                    </li>
				`;
			}
			$('.direct-list ul').append(code);
			pageCount=data.entity.pageCount;
			vpage=pageCount>10?10:pageCount;
			if(pageCount>1){
				$('.pages').show();
				initPagination('#pagination',pageCount,vpage,page,function(num,type){
					if(type=='change'){
				    	pageListCon(num,pageNum); 
					}
				})
			}else{
				if(flag){
					pageListCon(1,pageNum);	
					flag=false;
					$('.pages').hide();
				}
				
			}
		}
	})
}

/*跳转到第几页*/
function pageTo(_this){
	pageListCon(parseInt($(_this).siblings('input').val()),pageNum)
}

/*页面数据获取*/
pageListCon(1,pageNum)

/*搜索查询*/
$('.search-nickname').click(function(){
	pageListCon(1,pageNum)
})

/*点击视频弹出*/
function vertifyAlert(_this){
	$('#checkResult .live-tit').text($(_this).attr('data-tit'));
	$('#checkResult .live-id').text($(_this).attr('data-id'));
	$('#checkResult .live-reasult').text($(_this).attr('data-reasult'));
	$('#checkResult').modal();
}

/*关停操作*/
function closeLive(){
	$('#checkResult').modal('hide');
	$.ajax({
		type:'post',
		url:'/dmb/api/v1/live/audit.json',
		dataType:'json',
		data:{'status':1,'id':parseInt($('#checkResult .live-id').text())},
		success:function(data){
			if(data.code==200){
				returnMessage(data.message);
			}
		},
		error:function(data){
			returnMessage('返回数据错误'+data.code)
		}
	})

}















































































