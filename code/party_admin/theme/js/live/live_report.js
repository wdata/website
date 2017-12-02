/*分页点击函数*/
var pageNum=2;  //每页显示数
var flag=true;	//判断字段
function pageListCon(page,size){
	var pageCount,vpage;
	$.ajax({
		type:'get',
		url:'/dmb/api/v1/live/topofflist.json',
		dataType:'json',
		data:{'page':page,'size':size,'nickname':$('.input-nickname').val()},
		success:function(data){
			var date=new Date(data.entity.items[0].liveTime);
			var code="";
			for(var i=0;i<data.entity.items.length;i++){
				code+=`
					 <tr>
                       <td><input type="checkbox"></td>
                       <td>${i+1}</td>
                       <td>${data.entity.items[i].liveId}</td>
                       <td>${data.entity.items[i].liveUserId}</td>
                       <td>${data.entity.items[i].liveName}</td>
                       <td>${data.entity.items[i].company}</td>
                       <td>${date}</td>
                       <td>${data.entity.items[i].liveTitle}</td>
                       <td>9999</td>
                       <td>99</td>
                       <td>
                           <a href="#" data-toggle="modal" data-target="#look">查看</a>
                       </td>
                       <td>${data.entity.items[i].isClose==1?"未关停":"已关停"}</td>
                       <td>
                       		<span class="oper-status ${data.entity.items[i].isClose==1?'opened':'closed'}">${data.entity.items[i].isClose==1?"未忽略":"已忽略"}</span>
                           <span class="oper-status ${data.entity.items[i].isClose==1?'opened':'closed'}">${data.entity.items[i].isClose==1?"未关停":"已关停"}</span>
                       </td>
                   </tr> 
				`;
			}
			$('#report-table tbody').html(code);
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

//提示弹框
function returnMessage(message){
    alertMsg(message,function(dialog){
        dialog.close();
    })
}