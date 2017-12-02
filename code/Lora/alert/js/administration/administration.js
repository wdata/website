var isAdd=null,isEdit=null;
var pitch = [];  //需要删除的设备
isShow('1001400010001','1001400010002');
isAdd?$(".oper").show():$(".oper").hide();
$(function(){
	var data=true;

	$('.append_create').click(function(){
		data = true;
		sessionStorage.setItem('dataone',data);
		//$(".L_system_statistics",window.parent.document).attr("src","html/system/account_number/account_number.html");
	});
	$(document).on('click','.role_append',function(){
		var usid = $(this).parent().parent().attr("id");
		var usclass = $(this).parent().attr("id");
		sessionStorage.setItem('id',usid);
		sessionStorage.setItem('class',usclass);
		$.ajax({
			type: "POST",
	        url:'/web/accountCtr/getAccountInfo',
	        dataType: 'json',
	        data:{id:usid},
	        success:function(e){
	        	data = false;
	        	var rlgou = JSON.stringify(e);
	        	sessionStorage.setItem('rlgou',rlgou);
	        	sessionStorage.setItem('dataone',data);
	        	openTab('.role_append');
	        },
			error:function(data){
				returnMessage(2,data.status);
			}
		});
	});
});

/*列表内容展示与查询*/
var listSize=10;  //每页显示数
var listInit={'size':listSize,'page':1};
var flag=false;
function pageListCon(page,elem){
	var pageCount,vpage;
	$.ajax({
		type: "POST",
        url:'/web/accountCtr/getCountListByCondition',
        dataType: 'json',
        data:elem,
		success:function(e){
			console.info(e);
			if(e.code=200 && e.data!=null){
				var oData=e.data;
				var code="";
				if(oData.totalElements>0){
					var company="";
					var a=1;
					$('.L_describe_operation4').find('tbody').html('');
			            	for(var i = 0; i<e.data.content.length; i++){
								var is_edit='';
								if(isEdit){
									is_edit="<span class='role_append' data-tit='修改用户' href='html/system/account_number/account_number.html'>编辑</span>";
								}else{
									is_edit="-";
								}
			            		if(e.data.content[i].enable != false){
			            			company += "<tr id="+e.data.content[i].id+"><td><input type='checkbox' name='test' class='check-box' data-id="+e.data.content[i].id+"><i></i></td><td>"+(i+1)+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+new Date(e.data.content[i].createTime).toLocaleString()+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].roleName+"</td><td>启用</td><td id="+e.data.content[i].telNumber+" style='cursor:pointer;color:#4395ff'>"+is_edit+"</td></tr>";
				            	}else{
				            		company += "<tr id="+e.data.content[i].id+"><td>"+(i+1)+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+new Date(e.data.content[i].createTime).toLocaleString()+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].roleName+"</td><td>禁用</td><td id="+e.data.content[i].telNumber+" style='cursor:pointer;color:#4395ff'>"+is_edit+"</td></tr>";
				            		
			            		}
			            		//$('.L_describe_operation4').find('tbody').append(company);
			            		if(isEdit == false){
					            	$('.role_append').remove();
					            }		            	
			            	}
	            	$('#main_table .list').html(company);
					pageCount=oData.totalPages;
					$('.pageing .total span').text(pageCount)
					if(pageCount>1){
						flag=true;
						$('.pageing').show();	
						initPagination('#pagination',pageCount,1,page,function(num,type){
							if(type=='change'){
								elem.page=num;
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
				}else{
					code=`<td colspan="18" class="tc">当前条件下无数据展示</td>`;
					$('.pageing').hide();
					$('#main_table .list').html(code);
				} 
			}else{
				$('#main_table .list').html(`<td colspan="18" class="tc">当前条件下无数据展示</td>`);
				$('.pageing').hide();
			}
		},
		error:function(data){
			returnMessage(2,data.status);
		}
	})
}
//pageListCon(1,listInit,server_url+'/web/device/searchDeviceMaintences.json','post');
//搜索
pageListCon(1,listInit)
function searchList(){
	var search_elem={
		'page':1,'size':listSize,"companyType":'building_user',
		"inputStr":$('.L_company_name').val(),
		'enable': $('.L_status_chuan').val()
	};
	pageListCon(1,search_elem);
}
//批量删除
function administrationDelete() {
  pitch = [];
    $('table tbody input[type=checkbox]:checked').each(function() {
        pitch.push($(this).attr('data-id'));
    });
    console.log(pitch);

    if(pitch == '') {
        returnMessage(2, '请先选择要删除的消息');
    } else {
        msgShow('type-danger','请确认是否需要执行删除操作？','btn-danger','type-default',function(dialog){
            deleteDevice();
            dialog.close();
        });
    }
}
function deleteDevice() {
  $.ajax({
    type:'post',
    url:'/web/accountCtr/deleteAccount',
    dataType:'json',
    contentType:"application/json; charset=utf-8",
    data:JSON.stringify({"ids":pitch}),
    success:function(data){
      $('#delete_hint').modal('hide')
      if(data.code==200){
        returnMessage(1, data.message);
        searchList();
      } else {
        returnMessage(2, data.message);
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