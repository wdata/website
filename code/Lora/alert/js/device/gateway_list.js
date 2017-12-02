var listSize=10;  //每页显示数
var listInit={'currentPage':1,'pageSize':listSize,'userId':userId};
var flag=false;
var pitch = [];  //需要删除的设备
//权限
var isAdd = null,isEdit = null;
isShow("1001500010001","1001500010002");
// 网关列表	html/device/gateway_list.html	100020002
// 添加网关		1001500010001
// 修改网关		1001500010002
// 删除网关		1001500010003
//	添加设备
isAdd?$(".oper").show():$(".oper").hide();


//省市级+设备组
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
        }
    }
})
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
			if(data.code=200 && data.data !=null){
				var oData=data.data;
				var code="";
				if(oData.totalElements>0){
					$.each(oData.content,function(index,item){
						var edit = `<td>-</td>`;
						if(isEdit){
	                        edit = `<td style="color: #4395ff; cursor:pointer;"><a href="gateway_edit.html" onclick="modifyElem('${item.id}')">修改</a></td>`;
	                    }
						code+=`
						 		<tr>
									<td><input type="checkbox" name="test" class="check-box" data-id=${item.id}><i></i></td>
									<td>${index+1}</td>
									<td>${tdCheck(item.gatewayName)}</td>
									<td>${tdCheck(item.gatewayEui)}</td>
									<td>${tdCheck(item.groupName)}</td>
									<td>${tdCheck(item.mergerName)}</td>
									<td>${tdCheck(item.patrol)}</td>
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
				$('#main_table .list').html(code);
			}else{
				$('#main_table .list').html(`<td colspan="12" class="tc">当前条件下无数据展示</td>`);
				$('.pageing').hide();
			}
		},
		error: function (data) {
			returnMessage(2,data.status);
		}
	})
}
pageListCon(1,listInit,server_url+'/web/gateway/getGatewaysByTreeId','post');
//搜索
var list_id;
function searchList(){
	var search_elem={
		'currentPage':1,'pageSize':listSize,'userId':userId,
		'gatewayName':$('#search_box input[name=name]').val(),
		'id':list_id
	};
	pageListCon(1,search_elem,server_url+'/web/gateway/getGatewaysByTreeId','post');
}
//选择设备组获取网关列表
function getList(){
	list_id=$('#group').val()?$('#group').val():$('#country').val()?$('#country').val():$('#city').val()?$('#city').val():$('#province').val();
	pageListCon(1,{'currentPage':1,'pageSize':listSize,'userId':userId,'id':list_id},server_url+'/web/gateway/getGatewaysByTreeId','post');
}
//批量删除
function gatewayDelete() {
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
function detail(id){
	$('#detail_modal').modal();
	$.ajax({
		type:'post',
		url:server_url+"/web/device/getDeviceInfo.json",
		dataType:'json',
		data:{'id':id,'userId':userId},
		success:function(data){
			console.info(data);//
			if(data.code===200){
				$('.detail-box .detail-01').text(data.data.deviceName);
				$('.detail-box .detail-02').text(data.data.id);
				$('.detail-box .detail-03').text(data.data.mergerName);
				$('.detail-box .detail-05').text(data.data.owner);
				$('.detail-box .detail-06').text(data.data.companyName);
				$('.detail-box .detail-07').text(data.data.deviceName);
				$('.detail-box .detail-08').text(data.data.deviceName);
				$('.detail-box .detail-09').text(data.data.securityManager);
				$('.detail-box .detail-10').text(data.data.securityPatrol);
				$('.detail-box .detail-11').text(data.data.longitude);
				$('.detail-box .detail-12').text(data.data.latitude);
			}
		},
		error: function (data) {
			returnMessage(2,data.status);
		}
	})
}
//左边树
var zTree;
var setting = {
    view: {
        dblClickExpand: false,
        showLine: true,
        selectedMulti: false
        //expandSpeed: ($.browser.msie && parseInt($.browser.version)<=6)?"":"fast"
    },
    data: {
        simpleData: {
            enable:true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: ""
        }
    },
    callback: {
        //onClick: zTreeClick
    }
};
//$.fn.zTree.init($("#zTree"), setting, data);

//修改跳转
function modifyElem(_this){
	sessionStorage.setItem('gateway_id',_this);
}
function deleteDevice() {
  $.ajax({
    type:'post',
    url:server_url+'/web/gateway/deleteGateway',
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

