//var userId=1;
var listSize=10;  //每页显示数
var listInit={'currentPage':1,'pageSize':listSize};
var flag=false;
var page=1;

//权限
var Details = null,isKoriyasu = null;
isShow("","","","","1001700040001","1001700040002");

// 维保设备列表	html/device/mainten_list.html	100020004
// 维保处理		1001700040001
// 维保处理详细		1001700040002
// 维保删除		1001700040003
// 维保导出		1001700040004
//	添加设备
dateChoose('#datetimeStart','#datetimeEnd');
$('.long_time').datetimepicker({
        format: "yyyy-mm-dd hh:ii:ss",
        autoclose: true,
        todayBtn: true,
        changeMonth: true,
        changeYear: true,
        language: 'zh-CN',
        clearBtn: true
    })
/*列表内容展示与查询*/
function pageListCon(page,elem,url,type){
	var pageCount,vpage;
	$.ajax({
		type:type,
		url:url,
		dataType:'json',
		data:elem,
		success:function(data){
			if(data.code=200 && data.data!=null){
				var oData=data.data;
				var code="";
				if(oData.totalElements>0){
					$.each(oData.content,function(index,item){
						var n=item.currentStatus;
						var status=item.onlineStatus=="normal"?'正常':item.onlineStatus=="alarm"?'报警':item.onlineStatus=="fault"?"故障":"离线";
						var dealStatus=n=="alarm"?'报警中':n=="receive"?'已接警':n=="processing"?"处理中":n=='declare'?'故障申报':n=="applyfor"?'申请维保':'完成';
						var bool=false;    //判断是否可以查看
						if(item.currentStatus==='complete'){	
							bool=true;
						}
                        //	处理\
						if(bool){
                        	var AKoriyasu = `<td>-</td>`;
						}else{
							console.log('-----------------------------');
							console.log(isKoriyasu);
							if(isKoriyasu){
								AKoriyasu = `<td><span class="edit ${bool?'gray':' '}" onClick="detail(2,'${item.id}',this)">处理</span></td>`;
							}else{
								AKoriyasu = `<td>-</td>`;
							}
						}
						//	查看
                        var ADetails = `<td>-</td>`;
							if(Details){
								ADetails = `<td><span class="edit ${bool?' ':'gray'}" onClick="detail(1,'${item.id}',this)">查看</span></td>`;
							}
						code+=`
								<tr>
									<td><input type="checkbox" data-id=${item.id}><i></i></td>
									<td>${index+1}</td>serialNumber
									<td>${tdCheck(item.deviceName)}</td>groupName
									<td>${tdCheck(item.serialNumber)}</td>
									<td>${tdCheck(item.gatewayNum)}</td>
									<td>${tdCheck(item.groupName)}</td>
									<td>${tdCheck(status)}</td>
									<td>${tdCheck(item.warningDesc)}</td>
									<td>${dateDeal(item.startTime)}</td>
									<td>${tdCheck(item.solutionDesc)}</td>
									<td>${tdCheck(item.mergerName)}</td>
									<td>${tdCheck(item.manager)}</td>
									<td>${tdCheck(item.patrol)}</td>
									<td>${tdCheck(item.companyName)}</td>
									${ADetails}
									<td>${tdCheck(dealStatus)}</td>
									${AKoriyasu}
								</tr>	
							`;
					})
					pageCount=oData.totalPages;
					$('.pageing .total span').text(pageCount);
					if(pageCount>1){
						flag=true;
						$('.pageing').show();	
						initPagination('#pagination',pageCount,1,page,function(num,type){
							if(type=='change'){
								page=num;
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
					code=`<td colspan="18" class="tc">当前条件下无数据展示</td>`;
					$('.pageing').hide();
				} 
				$('#main_table .list').html(code);
			}else{
				$('#main_table .list').html(`<td colspan="18" class="tc">当前条件下无数据展示</td>`);
			}
		},
		error: function (data) {
			returnMessage(2,data.status);
		}
	})
}
pageListCon(1,listInit,server_url+'/web/device/searchDeviceMaintences.json','post');
//获取设备组下拉
(function getDevicegSel(){
    getSelect({'type':2,'userId':userId},function(data){
        if(data.code==200){
            var code=`<option value="">全部</option>`;
            $.each(data.data,function(index,item){
                code+=`
                    <option value=${item.id}>${item.groupName}</option>
                `
            })
        }
        $('#deviceg_sel').html(code);
    })
})()
//搜索
function searchList(){
	var search_elem={
		'currentPage':1,'pageSize':listSize,
		'deviceName':$('.search-tab-box input[name=name]').val(),
		'warningDesc':$('.search-tab-box input[name=desc]').val(),
		'groupId':$('#deviceg_sel').val(),
		'onlineStatus':$('#status_sel').val(),
		'solutionStatus':$('#state_sel').val(),
		'searchStartTime':$('.search-tab-box input[name=startTime]').val(),
		'searchEndTime':$('.search-tab-box input[name=endTime]').val()
	};
	pageListCon(1,search_elem,server_url+'/web/device/searchDeviceMaintences.json','post');
}
//多文件上传显示
function multiImgUpload(_this){
	if(_this.value==='')return false;
    var $file = $(_this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    var dataURL;
    if(fileObj && fileObj.files && fileObj.files[0]) {
        dataURL = windowURL.createObjectURL(fileObj.files[0]);
        var code = `<div class="img-w"><img src=${dataURL} alt=""></div>`;
        var new_file=`<input type="file" name="file" class="img-file" onchange="_imgSizeCheck(this)">`;
        $(code).insertBefore($(_this).parent());
        $(_this).parent().append(new_file);
        $(_this).hide();
    }
    return true;
}
//查看详细
var cur_id;
function detail(type,id,_this){
	if(!$(_this).hasClass('gray')){
		if(type==1){
			$('#detail_modal').modal();
		}else{
			$(".fig-con").html('<div class="file-w">+<input type="file" name="file" class="img-file" onchange="_imgSizeCheck(this)"></div><div class="clear"></div>');
			$('#main_form')[0].reset();
			$('#deal_modal').modal();
		}
		$.ajax({
			type:'post',
			url:server_url+"/web/device/getDeviceMaintenceInfo.json",
			dataType:'json',
			data:{'id':id,'userId':userId},
			success:function(data){
				var oData=data.data;
				if(data.code===200){
					$('.detail-01').text(oData.warningDesc);
					$('.detail-02').text(dateDeal(oData.startTime));
					$('.detail-03').text(oData.mergerName);
					$('.detail-04').text(oData.solutionDesc);
					$('.detail-05').text(oData.trustees);
					$('.detail-06').text(dateDeal(oData.endTime));
					var img_code="";
					$.each(oData.urls,function(index,item){
						img_code+='<div class="img-w"><img src="'+item+'"></div>';
					})
					$('#detail_modal .fig-con').html(img_code);
					$('#trustees').val(oData.trustees);
				}
			},
			error: function (data) {
				returnMessage(2,data.status);
			}
		})	
	}
	cur_id=id;
}
//处理保存
blurCheck('#main_form');
function dealOper(){
	if($('.figture-wrap .img-w').length===0) { returnMessage(2,'请上传故障处理描述图片！'); return false; }
	if($("#main_form").valid()&&$("#endTime").val()!=''){
		$('#deal_modal').modal('hide');
		$('.img-file').each(function(){if($(this).css('display')!='none'){$(this).remove();}});
		var file_elem=new FormData($('#main_form')[0]);
		$.ajax({
		type:'post',
		url:server_url+'/file/uploadFile',
		contentType:false,
		processData:false,
		data:file_elem,
		success:function(data){
			if(data.code===200){
				var arrId=[],arrUrl=[];
				$.each(data.data,function(index,item){
					arrId.push(item.id);
				});
				var elem=new FormData();
				elem.append('ids',arrId);
				elem.append('id',cur_id);
				elem.append('endTime',$('#endTime').val());
				elem.append('solutionDesc',$('#main_form textarea').val());
				elem.append('trustees',$('#trustees').val());
				$.ajax({
					type:'post',
					url:server_url+'/web/device/handleDeviceMaintence',
					contentType:false,
					processData:false,
					data:elem,
					success:function(data){
						if(data.code==200){
							returnMessage(1,"处理信息上传成功");
							pageListCon(1,listInit,server_url+'/web/device/searchDeviceMaintences.json','post')
						}else{
							returnMessage(2,data.message);
						}
					},
					error: function (data) {
						returnMessage(2,data.status);
					}
				})
			}else{
				returnMessage(2,data.message);
			}
		},
		error: function (data) {
			returnMessage(2,data.status);
		}
	})
	}else{
		$(".form_datetime_input>.cred").show();
	}
}
//导出Excel表格
function exportExcel(_this){
    $(_this).attr("href",server_url+"/web/excel/exportExcel?currentPage="+page+"&tag=1&pageSize="+listSize+
    	"&deviceName="+$('.search-tab-box input[name=name]').val()+
    	"&warningDesc="+$('.search-tab-box input[name=desc]').val()+
    	"&groupId="+$('#deviceg_sel').val()+
    	"&onlineStatus="+$('#status_sel').val()+
    	'&solutionStatus='+$('#state_sel').val()+
    	'&searchStartTime='+$('.search-tab-box input[name=startTime]').val()+
    	'&searchEndTime='+$('.search-tab-box input[name=endTime]').val()
    	);
}
/*效果图上传图片大小格式验证*/
function _imgSizeCheck(_this){
	var fileSize = 0;
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
	var name=_this.value;
	var postfix=name.substring(name.lastIndexOf(".") + 1).toLowerCase();
	if(isIE && !_this.files) {
		var filePath = _this.value;
		var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
		var file = fileSystem.GetFile(filePath);
		fileSize = file.Size;
	} else {
		fileSize = _this.files[0].size;
	}
	var size = fileSize / 1024;
	if(size > 2000) {
		returnMessage(2,'附件不能大于2M！');
		_this.value==' ';
		$(_this).attr('src','');
		return false;
	}else{
		if(postfix!='jpg' && postfix!='jpeg'&& postfix!='png'&& postfix!='bmp'){
			returnMessage(2,'请选择jpg，jpeg，png，bmp的格式文件上传！');
			_this.value==' ';
			$(_this).attr('src',' ');
			return false;
		}else{
			multiImgUpload(_this);
		}
	}
}



//Enter
function searchKey(e){
	if(e.keyCode==13){
		searchList();
	}
}

