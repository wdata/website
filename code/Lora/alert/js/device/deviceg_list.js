var listSize=10;  //每页显示数
var listInit={'currentPage':1,'pageSize':listSize,'userId':userId};
var flag=false;
var pitch = [];  //需要删除的设备

//权限
var isAdd = null,isEdit = null;
isShow("1001600010001","1001600010002");
// 设备组列表	html/device/deviceg_list.html	100020003
// 添加设备组		1001600010001
// 修改设备组		1001600010002
// 删除设备组		1001600010003
// 导出设备组		1001600010004
//	添加设备
isAdd?$(".oper").show():$(".oper").hide();



/*列表内容展示与查询*/
function pageListCon(page,elem,url,type){
	var pageCount,vpage;
	$.ajax({
		type:type,
		url:url,
		dataType:'json',
		data:elem,
		headers: {
	    	'Authorization': '3324',
	  	},
		success:function(data){
			console.info(data);
			if(data.code=200){
				var oData=data.data;
				var code="";
				if(oData.totalElements>0){
					$.each(oData.content,function(index,item){
                        //	修改
                        var edit = `<td>-</td>`;
                        if(isEdit){
                            edit = `<td><a class="edit " href="deviceg_edit.html" onclick='modify("${item.id}"),openTab(this)' data-tit="设备组修改">修改</a></td>`;
                        }
						var status=item.onlineStatus=="normal"?'正常':item.onlineStatus=="alarm"?'报警':item.onlineStatus=="fault"?"故障":"离线";
						code+=`
						 		<tr>
									<td><input type="checkbox" name="test" class="check-box" value=${item.id}><i></i></td>
									<td>${index+1}</td>
									<td>${tdCheck(item.groupName)}</td>
									<td>${tdCheck(item.parent)}</td>
									<td>${dateDeal(item.createTime)}</td>
									<td>${tdCheck(item.groupDesc)}</td>
									<td>${tdCheck(item.companyName)}</td>
									${edit}
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
								elem.currentPage=num;
						    	pageListCon(num,elem,url,'post'); 
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
					code=`<td colspan="12" class="tc">当前条件下无数据展示</td>`;
					$('.pageing').hide();
				} 
				$('#main_table tbody').html(code);
			}
		},
		error: function (data) {
			returnMessage(2,data.status);
		}
	})
}
pageListCon(1,listInit,server_url+'/web/device/searchDeviceGroups','post');
//搜索
function searchList(){
	var search_elem={
		'currentPage':1,'pageSize':listSize,'userId':userId,
		'groupName':$('.search-tab-box input[name=name]').val(),
	};
	pageListCon(1,search_elem,server_url+'/web/device/searchDeviceGroups','post');
}
//修改跳转
function modify(_this){
	sessionStorage.setItem('deviceg_id',_this);
}
//批量删除
function devicegDelete() {
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
    url:server_url+'/web/device/deleteDeviceGroup',
    dataType:'json',
    contentType:"application/json; charset=utf-8",
    data:JSON.stringify({"ids":pitch}),
    success:function(data){
      $('#delete_hint').modal('hide')
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

