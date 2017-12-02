

/*列表内容展示与查询*/
var listSize=10;  //每页显示数
var listInit={'page':1,'size':listSize,"companyType":'building_user'};
var flag=false;
var data=true;
var pitch = [];  //需要删除的设备

var isAdd=null,isEdit=null;
$(document).ready(function(){
	isShow('1000800010001','1000800010002');
	isAdd?$(".oper").show():$(".oper").hide();
	//获取设备类型
	$.ajax({
		type: "POST",
		url:'/web/managementCtr/getDeviceTypeList',
		dataType: 'json',
		success:function(e){
			if(e.code==200){
				for(var i = 0; i<e.data.length; i++){
					var a = $('<option value='+e.data[i].id+'>'+e.data[i].name+'</option>');
					$('.all_device').append(a);
				}
			}else{
				returnMessage(2,e.message);
			}
		},
		error:function(data){
			returnMessage(2,'报错：' +  data.status);

		}
	});
	pageListCon(1,listInit);
});
function pageListCon(page,elem){
	var pageCount,vpage;
	$.ajax({
		type: "POST",
        url:'/web/managementCtr/getUserCompanyList',
        dataType: 'json',
        data:elem,
		success:function(e){
			if(e.code=200 && e.data!=null){
				var oData=e.data;
				var code="";
				if(oData.totalElements>0){
					var company="";
					for(var i = 0; i<e.data.content.length; i++){
						var is_edit='';
						if(isEdit){
							is_edit="<span href='html/use_company/new_company/new_company.html' onclick=\"change(this,'"+e.data.content[i].id+"')\" data-tit='修改使用单位'>修改</span>";
						}else{
							is_edit='-';
						}
	            		if(e.data.content[i].enable != false){
	            			company += "<tr id="+e.data.content[i].id+"><td class='che_maintain'><input type='checkbox' value="+e.data.content[i].id+" name='test' class='check-box'><i></i></td><td>"+(i+1)+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].companyName+"</td><td>"+e.data.content[i].parentCompany+"</td><td>"+e.data.content[i].deviceType+"</td><td>"+e.data.content[i].contact+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].email+"</td><td>"+e.data.content[i].address+"</td><td>启用</td><td style='color: #4395ff; cursor:pointer;'>"+is_edit+"</td></tr>";
	            		}else{
	            			company += "<tr id="+e.data.content[i].id+"><td class='che_maintain'><input type='checkbox' value="+e.data.content[i].id+" name='test' class='check-box'><i></i></td><td>"+(i+1)+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].companyName+"</td><td>"+e.data.content[i].parentCompany+"</td><td>"+e.data.content[i].deviceType+"</td><td>"+e.data.content[i].contact+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].email+"</td><td>"+e.data.content[i].address+"</td><td>禁用</td><td style='color: #4395ff; cursor:pointer;'>"+is_edit+"</td></tr>";
	            		}
	            	}
	            	$('#main_table .list').html(company);
					pageCount=oData.totalPages;
					$('.pageing .total span').text(pageCount);
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
							pageListCon(1,elem,url,'post');
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
			}
		}
	})
}
//搜索
function searchList(){
	var search_elem={
		'page':1,'size':listSize,"companyType":'building_user',
		"inputStr":$('.L_company_name').val(),
		"deviceType":$('.all_device').val(),
		"enable":$('.L_status_chuan').val()
	};
	pageListCon(1,search_elem);
}
//修改
function change(_this,usid){
	$.ajax({
		type: "POST",
		url:'/web/managementCtr/getManagementDetail',
		dataType: 'json',
		data:{companyId:usid},
		success:function(e){
			var user = JSON.stringify(e);
			data = false;
			sessionStorage.setItem('apply',user);
			sessionStorage.setItem('datas',data);
			openTab(_this);
		},
		error:function(data){
			returnMessage(2,'报错：' +  data.status);
		}
	});
}
//添加
function state(_this){
	data = true;
	sessionStorage.setItem('datas',data);
	openTab(_this);
}
//批量删除
function operateDelete() {
  pitch = [];
	$('table tbody input[type=checkbox]:checked').each(function() {
		pitch.push($(this).val());
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
    url:server_url+'/web/managementCtr/deleteManagementInfo',
    dataType:'json',
    contentType:"application/json; charset=utf-8",
    data:JSON.stringify({
      "ids":pitch
    }),
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