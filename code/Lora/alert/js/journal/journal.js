/*列表内容展示与查询*/
var listSize=10;  //每页显示数
var listInit={'pageSize':listSize,'pageNum':1};
var flag=false;
dateChoose('#datetimeStart','#datetimeEnd');
function pageListCon(page,elem){
	var pageCount,vpage;
	$.ajax({
		type: "POST",
        url:'/web/accountCtr/getLogList',
        dataType: 'json',
        data:{'jsonStr':JSON.stringify(elem)},
		success:function(e){
			if(e.code=200 && e.data!=null){
				var oData=e.data;
				var code="";
				if(oData.totalElements>0){
					$.each(oData.content,function(index,item){
						var status=item.onlineStatus=="normal"?'正常':item.onlineStatus=="alarm"?'报警':item.onlineStatus=="fault"?"故障":"离线";
						code+=`
						 		<tr>
									<td>${index+1}</td>
									<td data-id=${item.id}>${tdCheck(item.loginName)}</td>
									<td>${tdCheck(item.userName)}</td>
									<td>${tdCheck(item.ip)}</td>
									<td>${tdCheck(item.createTime)}</td>
									<td>${tdCheck(item.menuName)}</td>
									<td>${tdCheck(item.method)}</td>
								</tr>
							`
					})
					pageCount=oData.totalPages;
					$('.pageing .total span').text(pageCount)
					if(pageCount>1){
						flag=true;
						$('.pageing').show();	
						initPagination('#pagination',pageCount,1,page,function(num,type){
							if(type=='change'){
								elem.pageNum=num;
						    	pageListCon(num,elem); 
							}
						})	
					}else{
						$('.pageing').hide();
						if(flag){
							pageListCon(1,elem,url,'post')
							flag=false;
							$('.pageing').hide();	
						}
					}
					$('#log_table .list').html(code);	
				}else{
					code=`<td colspan="18" class="tc">当前条件下无数据展示</td>`;
					$('.pageing').hide();
					$('#log_table .list').html(code);
				} 
			}else{
				$('#log_table .list').html(`<td colspan="18" class="tc">当前条件下无数据展示</td>`);
				$('.pageing').hide();
			}
		},
		error:function(data){
			returnMessage(2,data.status);
		}
	})
}
//搜索
pageListCon(1,listInit)
function searchList(){
	var search_elem={
		'pageNum':1,'pageSize':listSize,
		"loginName":$('.L_company_name22').val(),
		"method":$('.L_company_name33').val(),
		'menuName': $('.L_company_name44').val(),
		'startTime': $('#datetimeStart').val(),
		'endTime': $('#datetimeEnd').val(),
	};
	pageListCon(1,search_elem);
}

//Enter
function searchKey(e){
	if(e.keyCode==13){
		searchList();
	}
}
	