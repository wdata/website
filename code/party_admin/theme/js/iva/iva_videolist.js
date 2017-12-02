
/*日期*/
$(".form_datetime").datetimepicker({
    format: "yyyy-mm-d",
    autoclose:true,
    minView:'month',
    changeMonth: true,
  	changeYear: true,
   	language: 'zh-CN'  
});

/*公司下拉菜单*/
$.ajax({
	type:'get',
	url:''
})

/*列表内容展示与查询*/
var pageNum=2;  //每页显示数
var flag=true;	//判断字段
function pageListCon(page,size){
	var pageCount,vpage;
	$('#pagination').html(' ');
	$.ajax({
		type:'get',
		url:'/dmb/iva/ivaVideoCtrl/queryIva?size=10&page=1',
		dataType:'json',
		data:{'page':page,'size':size,'title':,'subTitle':,'organization':,'begin':,'end':''},
		success:function(data){
			console.info(data.entity);
			var date=new Date(data.entity.items[0].liveTime);
			var code="";
			for(var i=0;i<data.entity.items.length;i++){
				code+=`
					<li class="picture-box">
		                <a href="javascript:;" class="pic-box-content">
		                    <img src=${data.entity.items[i].imgUrl} alt="">
		                    <input type="checkbox" class="pic-checkbox" data-id=${data.entity.items[i].liveId}>
		                    <div class="liv-nickname">
		                        <span class="live-title">${data.entity.items[i].liveName}</span>
		                       	<i class='fa ${data.entity.items[i].liveGender==0?"fa-male":"fa-female"}'></i>
		                    </div>
		                    <p class="live-date">${date.toLocaleString()}</p>
		                </a>
		            </li> 
				`;
			}
			$('#live-pic-list ul').html(code);
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










































