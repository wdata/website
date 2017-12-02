
/*列表内容展示与查询*/
var pageNum=2;  //每页显示数
var flag=true;	//判断字段
function pageListCon(page,size){
	var pageCount,vpage;
	$('#pagination').html(' ');
	$.ajax({
		type:'get',
		url:'/dmb/iva/ivaVideoCtrl/queryIcon.json',
		dataType:'json',
		data:{'page':page,'size':size,'title':'','subTitle':'','organization':'','begin':'','end':''},
		success:function(data){
			console.info(data);
			var code="";
			for(var i=0;i<data.entity.length;i++){
				code+=`
					<tr>
						<td><input type="checkbox" name="iva-videoId"></td>
		                <td>${i+1}</td>
		                <td>${data.entity[i].imgId}</td>
		                <td><img src=${data.entity[i].image} width="60" height="60" /></td>
		                <td>${data.entity[i].title}</td>
					</tr>
				`;
			}
			$('#ivaList-table tbody').html(code);
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


/*添加iva图片*/
function addImg(){
	if(!$('#addpicture input[type=file]').val()){
		returnMessage('请上传图片');
	}else{
		$("#imgUpload").ajaxSubmit(function(){
    		$('#addpicture').modal('hide')
   	 	6});
	}
    
}




















































