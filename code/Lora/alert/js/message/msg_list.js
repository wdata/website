var userId=1;
var listSize=10;  //每页显示数
var flag=false;
var isEdit=null,isAdd=null;
$(document).ready(function(){
	isShow("1001200010001","1001200010002");
	isAdd?$(".oper").show():$(".oper").hide();
	console.log(isEdit);
});
/*日期初始化*/
dateChoose('#datetimeStart','#datetimeEnd');
/*列表内容展示与查询*/
function pageListCon(page,elem){
	var pageCount,vpage;
	$.ajax({
		type:'post',
		url:server_url+'/web/notice/searchNotices',
		dataType:'json',
		data:elem,
		headers: {
	    	'Authorization': '3324'
	  	},
		success:function(data){
			if(data.code==200){
				var oData=data.data;
				var code="";
				if(oData.totalElements>0){
					$.each(oData.content,function(index,item){
						var groups='',roles='',btn='';
						$.each(item.groups,function(index,date){
							groups+=date.groupName+"  ";
						});
						$.each(item.roles,function(index,date){
							roles+=date.name+"  ";
						});
						if(isEdit){//未发送的才能修改&&!item.send
							btn = `<button style="border:none;background-color: #fff" data-tit="修改消息通知" href="html/message/msg_edit.html" onClick="edit_msg(this,'${item.id}')" class="edit">修改</button>`;
						}else{
							btn ='-';
						}
						code+=`
							<tr>
								<td><input type="checkbox" data-id=${item.id}><i></i></td>
								<td>${index+1}</td>
								<td>${tdCheck(item.title)}</td>
								<td>${tdCheck(item.content)}</td>
								<td>${dateDeal(item.createTime)}</td>
								<td>${dateDeal(item.sendTime)}</td>
								<td>${tdCheck(groups)}</td>
								<td>${tdCheck(roles)}</td>
								<td>${tdCheck(item.companyName)}</td>
								<td>
									${btn}
								</td>
							</tr>
						`;
					});
					pageCount=oData.totalPages;
					$('.pageing .total span').text(pageCount);
					if(pageCount>1){
						flag=true;
						$('.pageing').show();	
						initPagination('#pagination',pageCount,1,page,function(num,type){
							if(type=='change'){
								elem.currentPage=num;
						    	pageListCon(num,elem); 
							}
						})	
					}else{
						$('.pageing').hide();
						if(flag){
							pageListCon(1,elem)
							flag=false;
							$('.pageing').hide();	
						}
					}	
				}else{
					code=`<td colspan="12" class="tc">当前条件下无数据展示</td>`;
					$('.pageing').hide();
				} 
				$('#main_table .list').html(code);
			}else{
				$('.pageing').hide();
				$('#main_table .list').html(`<td colspan="12" class="tc">当前条件下无数据展示</td>`);
			}
		},
		error:function(data){

		}
	})
}
pageListCon(1,{'currentPage':1,'pageSize':listSize});
//搜索
function searchList(){
	var search_elem={
		'currentPage':1,'pageSize':listSize,
		'searchKey':$('.search-tab-box input[name=name]').val(),
		"searchStartTime":$('#datetimeStart').val(),
		'searchEndTime':$('#datetimeEnd').val(),
		'companyId':$('#company_sel').val()
	};
	pageListCon(1,search_elem);
}
/*下拉框获取 company*/
$(function(){
    (function(){
		company(function(data){
            if(data.code==200){
                var code="";
                var oData=data.data.company;
                $.each(oData,function(index,item){
                    code+=`
                        <option value=${item.id}>${item.companyName}</option>
                    `
                });
                $('#company_sel').append(code);
            }
            
        })
    })();
});
function edit_msg(_this,id){
	session('msg_id',id);
	openTab(_this);
}

//批量删除
//弹出删除模态框
var pitch = [];
function batchDelete() {
	pitch = [];
	$('table tbody input[type=checkbox]:checked').each(function() {
		pitch.push($(this).attr('data-id'));
	});
	console.log(pitch);

	if(pitch == '') {
		returnMessage(2, '请先选择要删除的消息');
	} else {
		msgShow('type-danger','请确认是否需要执行删除操作？','btn-danger','type-default',function(dialog){
			deleteList();
			dialog.close();
		});
	}
}

function deleteList(){
	$.ajax({
		type:'post',
		url:server_url+'/web/notice/deleteNotice',
		dataType:'json',
		contentType:"application/json; charset=utf-8",
		data:JSON.stringify({"ids":pitch}),
		success:function(data){
			if(data.code==200){
				returnMessage(1, data.message);
				searchList();
			} else {
				returnMessage(2, data.message)
			}
		},
		error: function (data) {
			returnMessage(2,data.message);
		}
	});
}
function recall(){
	pitch = [];
	$('table tbody input[type=checkbox]:checked').each(function() {
		pitch.push($(this).attr('data-id'));
	});
	console.log(pitch);

	if(pitch == '') {
		returnMessage(2, '请先选择要撤回的消息');
	} else {
		msgShow('type-danger','请确认是否需要执行撤回操作？','btn-danger','type-default',function(dialog){
			recallList();
			dialog.close();
		});
	}
}
function recallList(){
	$.ajax({
		type:'post',
		url:server_url+'/web/notice/withdrawNotice',
		dataType:'json',
		contentType:"application/json; charset=utf-8",
		data:JSON.stringify({"ids":pitch}),
		success:function(data){
			if(data.code==200){
				returnMessage(1, data.message);
				searchList();
			} else {
				returnMessage(2, data.message)
			}
		},
		error: function (data) {
			returnMessage(2,data.message);
		}
	})
}

//Enter
function searchKey(e){
	if(e.keyCode==13){
		searchList();
	}
}