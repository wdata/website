var listSize=10;  //每页显示数
var flag=false;
var pitch = [];  //需要删除的设备

//权限
var isAdd = null,isEdit = null,isExport = null;
isShow("1000200010001","1000200010002","1000200010004");
// 设备列表	html/device/device_list.html	100020001
// 添加设备		1000200010001
// 修改设备		1000200010002
// 删除设备		1000200010003
// 导出设备		1000200010004
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
	    	'Authorization': '3324'
	  	},
		success:function(data){
			if(data.code=200 && data.data!=null){
				var oData=data.data;
				var code="";
				if(oData.totalElements>0){
					$.each(oData.content,function(index,item){
						//	查看
						/*var Export = `<td>-</td>`;
                        if(isExport){
                            Export = `<td><span class="edit" onclick="detail('${item.id}')">查看</span></td>`;
                        }*/
						var Export =isExport? `<span class="edit" onclick="detail('${item.id}')">查看</span>`:'-';
                        //	修改
						/*var edit = `<td>-</td>`;
                        if(isEdit){
                        	edit = `<td class=" ${isEdit?'':'undis'}"><span class="edit" href="html/device/device_edit.html" onClick="session('device_id','${item.id}');openTab(this);" data-tit="设备修改">修改</span></td>`;
						}*/
						var edit =isEdit?`<span class="edit" href="html/device/device_edit.html" onClick="session('device_id','${item.id}');openTab(this);" data-tit="设备修改">修改</span>`:'-';
						var status=item.onlineStatus=="normal"?'正常':item.onlineStatus=="alarm"?'报警':item.onlineStatus=="fault"?"故障":"离线";
						var createTime = tdCheck(new Date(item.createTime).toLocaleString());
						code+=`
						 		<tr>
									<td><input type="checkbox" name="test" class="check-box" data-id=${item.id}><i></i></td>
									<td>${index+1}</td>
									<td>${tdCheck(item.deviceName)}</td>
									<td>${tdCheck(item.serialNumber)}</td>
									<td>${tdCheck(item.gatewayNum)}</td>
									<td>${tdCheck(item.groupName)}</td>
									<td>${tdCheck(status)}</td>
									<td>${createTime}</td>
									<td>${tdCheck(item.mergerName)}</td>
									<td>${tdCheck(item.manager)}</td>
									<td>${tdCheck(item.patrol)}</td>
									<td>${tdCheck(item.companyName)}</td>
									<td>${Export}</td>
									<td>${edit}</td>
								</tr>
							`;
					});
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
				$('#main_table .list').html(code);
			}else{
				$('#main_table .list').html(`<td colspan="18" class="tc">当前条件下无数据展示</td>`);
				$('.pageing').hide();
			}
		}
	})
}
pageListCon(1,{'currentPage':1,'pageSize':listSize,'groupId':''},server_url+'/web/device/getDevicesByTreeId.json','post');
//搜索
var list_id;
function searchList(){
	var search_elem={
		'currentPage':1,'pageSize':listSize,
		'deviceName':$('.search-tab-box input[name=name]').val(),
		"onlineStatus":$('.search-tab-box .status_select').val(),
		'id':list_id,
	};
	pageListCon(1,search_elem,server_url+'/web/device/getDevicesByTreeId.json','post');
}
//选择设备组获取网关列表
function getList(){
	list_id=$('#group').val()?$('#group').val():$('#country').val()?$('#country').val():$('#city').val()?$('#city').val():$('#province').val()
	pageListCon(1,{'currentPage':1,'pageSize':listSize,'userId':userId,'id':list_id},server_url+'/web/device/getDevicesByTreeId','post');
}
//批量删除
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
			deleteDevice();
			dialog.close();
		});
	}
}
//查看详细
function setAxisWay(x,y){
    var _width=$('#house_img').width();
    var _height=$('#house_img').height();
    $('#house_pointer').css({'left':x*_width/100,'top':y*_height/100});
}
function detail(id){
	$('#detail_modal').modal();
	$.ajax({
		type:'post',
		url:server_url+"/web/device/getDeviceInfo.json",
		dataType:'json',
		data:{'id':id},
		success:function(data){
			if(data.code===200){
				$('.detail-box .detail-01').text(data.data.deviceName);
				$('.detail-box .detail-02').text(data.data.serialNumber);
				$('.detail-box .detail-03').text(data.data.mergerName);
				//$('.detail-box .detail-04').text(data.data.address);
				$('.detail-box .detail-05').text(data.data.owner);
				$('.detail-box .detail-18').text(data.data.phone);
				$('.detail-box .detail-06').text(data.data.companyName);
				$('.detail-box .detail-07').text(data.data.groupName);
				$('.detail-box .detail-08').text(data.data.gatewayName);
				$('.detail-box .detail-09').text(data.data.manager);
				$('.detail-box .detail-10').text(data.data.patrol);
				$('.detail-box .detail-11').text(data.data.longitude);
				$('.detail-box .detail-12').text(data.data.latitude);
				$('.detail-box .detail-13').text(data.data.floorMax);
				$('.detail-box .detail-14').text(data.data.floor);
				$('.detail-box .detail-15').text(data.data.planeX+"%");
				$('.detail-box .detail-16').text(data.data.planeY+"%");
				$('.detail-box .detail-17 img').attr('src',data.data.showUrl);
				$('.detail-box .detail-19 img').attr('src',data.data.effectUrl);
				setAxisWay(data.data.planeX,data.data.planeY);
			}else{
				returnMessage(2, data.message)
			}
		},
		error: function (data) {
			returnMessage(2,data.status);
		}
	})
}
//省市级+设备组   
var areaData;
$.ajax({
	type:'post',
	url:server_url+'/public/getRegion',
    dataType:'json',
    success:function(data){
        if(data.code===200){
            areaData=data.data;
            var prov_code=`<option value="">请选择省市</option>`;
            $.each(areaData,function(index,item){
                prov_code+=`<option value=${item.id}>${item.name}</option>`;
            })
            $('#province').html(prov_code);
        }else{
			returnMessage(2, data.message)
		}
    },
	error: function (data) {
		returnMessage(2,data.status);
	}
});
function getCitySel(){
    var city_code=`<option value="">请选择城市</option>`;
    $.each(areaData,function(index,item){
        if(item.id==$('#province').val()){
            $.each(areaData[index].citys,function(index,item){
                city_code+=`<option value=${item.id}>${item.name}</option>`;
            })
        }
    })
    $('#city').show().html(city_code);
    $('#country').html(`<option value="">请选择地区</option>`);
    $('#group').hide();
}
function getCountrySel(){
    var country_code=`<option value="">请选择地区</option>`;
    $.each(areaData,function(index,item){
        if(item.id==$('#province').val()){
            var cur_prov=areaData[index].citys;
            $.each(cur_prov,function(index,item){
                if(item.id===$('#city').val()){
                    $.each(cur_prov[index].countys,function(index,item){
                        country_code+=`<option value=${item.id}>${item.name}</option>`; 
                    })
                }
               
            })
        }
    })
    $('#country').show().html(country_code);
    $('#group').hide();
}   
function getGroupSel(){
    $.ajax({
    	type:'post',
    	url:server_url+'/web/common/getRegionGroup',
    	dataType:'json',
    	data:{id:$('#country').val()},
    	success:function(data){
    		if(data.code==200&& data.data!=null){
    			var group_code=`<option value="">请选择设备组</option>`;
    			$.each(data.data,function(index,item){
    				group_code+=`<option value=${item.id}>${item.groupName}</option>`
    			})
    			$('#group').show().html(group_code);
    		}else{
    			$('#group').hide();
    		}
    		
    	},
		error: function (data) {
			returnMessage(2,data.status);
		}
    })
}
function deleteDevice() {
  $.ajax({
    type:'post',
    url:server_url+'/web/device/deleteDevice',
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

//导入设备
function checkFileType(_this){
	if(_this.value==''){
		return false;
	}
	var file = _this.files[0];
	//if(!/application\/(vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)/.test(file.type)){
	if(!/application\/vnd.ms-excel/.test(file.type)){
		returnMessage(2,'请选择需要导入的 Excel 文件！');
		_this.value='';
		return false;
	}
}
function uploadFile(){
	var $deviceFile = $('#deviceFile');
	if($deviceFile.val()==''){
		returnMessage(2,'请选择需要导入的 Excel 文件！');
		return false;
	}
	var formData = new FormData();
	formData.append('file',$deviceFile[0].files[0]);
	$.ajax({
		type:'post',
		url:server_url+'/web/device/importDevice',
		dataType:'json',
		contentType:false,
		processData:false,
		data:formData,
		success:function(res){
			if(res.code==200){
				alertMsg('type-success','导入成功','btn-success',function(dialog){//成功
					window.location.reload();
					dialog.close();
				});
			} else {
				returnMessage(2, res.message)
			}
			$('#importDeviceModal').modal('hide');
		},
		error: function (res) {
			returnMessage(2,res.message);
			$('#importDeviceModal').modal('hide');
		}
	});
}

//Enter
function searchKey(e){
	if(e.keyCode==13){
		searchList();
	}
}































