var pageNum = 10;//每次条数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var flag = null;
var data = true;
var pitch = [];  //需要删除的设备

//  创建添加和修改，隐藏添加按钮
var isAdd = null , isEdit = null;
$(function(){
	//添加权限码验证
    // 安全管理员列表	html/responsibility/people_biao/people_biao.html	100090001
    // 添加安全管理员		1000900010001
    // 修改安全管理员		1000900010002
    // 删除安全管理员		1000900010003
    isShow("1000900010001","1000900010002");
	isAdd?$(".oper").show():$(".oper").hide();

	//获取设备组下拉框
	facilityGroup('L_xuan_she_all');
	load(paGe,{"size":pageNum,"page":paGe,"roleType":'security_manager'});

	$(document).on('click','.security-tbody',function(){
		var usid = $(this).parent().parent().attr("id");
		console.log(usid)
		$.ajax({
			type: "POST",
	        url:'/web/securityCtr/getSecuritOrDetail',
	        dataType: 'json',
	        data:{"uId":usid},
	        success:function(e){
	        	console.log(e)
	        	var user = JSON.stringify(e);
	        	data = false;
	  			sessionStorage.setItem('row',user);
	  			sessionStorage.setItem('datas',data);
	  			$(".L_system_statistics",window.parent.document).attr("src","html/responsibility/responsibility_people/responsibility_people.html");
	        },
	        error:function(){}
		});
   	});
	/*$('.btn_enable').click(function(){
		var array = [];
		$('.supervise_surface  input:checked').each(function(){
			array.push($(this).val());
		});
		var supervise = JSON.stringify(array);
		$.ajax({
			type: "POST",
	        url:'/web/securityCtr/updateSecurityOr',
	        dataType: 'json',
	        data:{id:supervise,"user.enable":1},
	        success:function(e){
	        	console.log(e)
	        	$.ajax({
					type: "POST",
			        url:'/web/securityCtr/getSecurityMangerList',
			        dataType: 'json',
			        data:{size:'10',page:1,roleType:'security_manager'},
			        success:function(e){
			        	
			        	var numall = e.data.totalPages;
			        	$('.all_pagination').html(numall)
			        	console.log(numall)
			        	$('.total').find('span').html(numall);
			        	initPagination("#pagination",numall,1,1,function(num){
					 		$.ajax({
								type: "post",
					            url:'/web/securityCtr/getSecurityMangerList',
					            dataType: 'json',
					            data:{size:'10',page:num,roleType:'security_manager'},
					            success:function(e){
					            	
					            	$('.L_describe_operation').find('tbody').html('');
					            	var a= 1;
					            	for(var i = 0; i<e.data.content.length; i++){
					            		var r = a++;
					            		if(e.data.content[i].enable != false){
					            				var company = "<tr id="+e.data.content[i].id+"><td class='supervise_surface'><input type='checkbox' value="+e.data.content[i].id+" name=''></td><td>"+r+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].email+"</td><td>"+e.data.content[i].address+"</td><td>"+e.data.content[i].groupName+"</td><td>"+e.data.content[i].companyName+"</td><td>启用</td><td style='color: #4395ff; cursor:pointer;'><a class='btn-primary security-tbody' onclick='openTab(this)' data-tit='修改安全管理人员'>修改</a></td></tr>";
					            		}else{
					            				var company = "<tr id="+e.data.content[i].id+"><td class='supervise_surface'><input type='checkbox' value="+e.data.content[i].id+" name=''></td><td>"+r+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].email+"</td><td>"+e.data.content[i].address+"</td><td>"+e.data.content[i].groupName+"</td><td>"+e.data.content[i].companyName+"</td><td>禁用</td><td style='color: #4395ff; cursor:pointer;'><a class='btn-primary security-tbody' onclick='openTab(this)' data-tit='修改安全管理人员'>修改</a></td></tr>";
					            		};
					            		$('.L_describe_operation').find('tbody').append(company);		  
				            		}
				            		if(isEdit == false){
						            	$('.security-tbody').remove();
						            }
					            },
					            error:function(){}
							});
						});
			        },
			        error:function(){}
			    });
	        },
	        error:function(){}
	    });
	});
	$('.btn_disable').click(function(){
		var array = [];
		$('.supervise_surface  input:checked').each(function(){
			array.push($(this).val());
		});
		var supervise = JSON.stringify(array);
		$.ajax({
			type: "POST",
	        url:'/web/securityCtr/updateSecurityOr',
	        dataType: 'json',
	        data:{id:supervise,"user.enable":0},
	        success:function(e){
	        	console.log(e)
	        	$.ajax({
					type: "POST",
			        url:'/web/securityCtr/getSecurityMangerList',
			        dataType: 'json',
			        data:{size:'10',page:1,roleType:'security_manager'},
			        success:function(e){
			        	
			        	var numall = e.data.totalPages;
			        	$('.all_pagination').html(numall)
			        	console.log(numall)
			        	$('.total').find('span').html(numall);
			        	initPagination("#pagination",numall,1,1,function(num){
					 		$.ajax({
								type: "post",
					            url:'/web/securityCtr/getSecurityMangerList',
					            dataType: 'json',
					            data:{size:'10',page:num,roleType:'security_manager'},
					            success:function(e){
					            	
					            	$('.L_describe_operation').find('tbody').html('');
					            	var a= 1;
					            	for(var i = 0; i<e.data.content.length; i++){
					            		var r = a++;
					            		if(e.data.content[i].enable != false){
					            				var company = "<tr id="+e.data.content[i].id+"><td class='supervise_surface'><input type='checkbox' value="+e.data.content[i].id+" name=''></td><td>"+r+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].email+"</td><td>"+e.data.content[i].address+"</td><td>"+e.data.content[i].groupName+"</td><td>"+e.data.content[i].companyName+"</td><td>启用</td><td style='color: #4395ff; cursor:pointer;'><a class='btn-primary security-tbody' onclick='openTab(this)' data-tit='修改安全管理人员'>修改</a></td></tr>";
					            		}else{
					            				var company = "<tr id="+e.data.content[i].id+"><td class='supervise_surface'><input type='checkbox' value="+e.data.content[i].id+" name=''></td><td>"+r+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].email+"</td><td>"+e.data.content[i].address+"</td><td>"+e.data.content[i].groupName+"</td><td>"+e.data.content[i].companyName+"</td><td>禁用</td><td style='color: #4395ff; cursor:pointer;'><a class='btn-primary security-tbody' onclick='openTab(this)' data-tit='修改安全管理人员'>修改</a></td></tr>";
					            		};
					            		$('.L_describe_operation').find('tbody').append(company);		  
				            		}
				            		if(isEdit == false){
						            	$('.security-tbody').remove();
						            }
					            },
					            error:function(){}
							});
						});
			        },
			        error:function(){}
			    });
	        },
	        error:function(){}
	    });
	});*/
});
//加载列表
function load(page,date){
	var pageCount;   //初始的
	$.ajax({
		type: "POST",
		url:'/web/securityCtr/getSecurityMangerList',
		dataType: 'json',
		data:date,
		success:function(e){
			if(e.code==200){
				$("#main_table tbody").empty();
				if(e.data!=null){
					for(var i = 0; i<e.data.content.length; i++) {
					    var edit = "-";
                        if(isEdit){
					        edit = "<a class='security-tbody' onclick='openTab(this)' data-tit='修改安全管理人员'>修改</a>";
                        }
						if (e.data.content[i].enable != false) {
							var company = "<tr id=" + e.data.content[i].id + "><td class='supervise_surface'><input type='checkbox' value=" + e.data.content[i].id + " name='test' class='check-box'><i></i></td><td>" +(i+1) + "</td><td>" + tdCheck(e.data.content[i].loginName) + "</td><td>" + tdCheck(e.data.content[i].name) + "</td><td>" + tdCheck(e.data.content[i].telNumber) + "</td><td>" + tdCheck(e.data.content[i].email) + "</td><td>" + tdCheck(e.data.content[i].address) + "</td><td>" + tdCheck(e.data.content[i].groupName) + "</td><td>" + tdCheck(e.data.content[i].companyName) + "</td><td>启用</td><td style='color: #4395ff; cursor:pointer;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>"+ edit +"</td></tr>";
						} else {
							var company = "<tr id=" + e.data.content[i].id + "><td class='supervise_surface'><input type='checkbox' value=" + e.data.content[i].id + " name=''><i></i></td><td>" + (i+1) + "</td><td>" + tdCheck(e.data.content[i].loginName) + "</td><td>" + tdCheck(e.data.content[i].name) + "</td><td>" + tdCheck(e.data.content[i].telNumber) + "</td><td>" + tdCheck(e.data.content[i].email) + "</td><td>" + tdCheck(e.data.content[i].address) + "</td><td>" + tdCheck(e.data.content[i].groupName) + "</td><td>" + tdCheck(e.data.content[i].companyName) + "</td><td>禁用</td><td style='color: #4395ff; cursor:pointer;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>"+ edit +"</td></tr>";

						}
						$('#main_table tbody').append(company);
					}

					pageCount = e.data.totalPages;//总页数
					$(".total .num").text(pageCount);
					if(pageCount>1){
						$('.pages').removeClass("undis");
						$(".total").removeClass("hide");
						flag = true;
						initPagination('#pagination',pageCount,1,page,function(num,type){
							if(type === 'change'){
								paGe = num;
								date.page=paGe;
								load(paGe,date);
							}
						});
					}else{
						$('.pages').addClass("undis");
						if(flag) {
							paGe = 1;
							date.page=paGe;
							load(paGe,date);
							flag = false;
						}
					}
				}else{
					$('.pages').addClass("undis");
					$("#main_table tbody").html('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
				}
			}else if(e.code==204){
				//无数据提醒框
				$('.pages').addClass("undis");
				$("#main_table tbody").html('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
			}else{
				$('.pages').addClass("undis");
				returnMessage(2,data.message);
			}
		},
		error:function(){}
	});
}
//搜索
function searchList(){
	var name = $('.L_search_neme1').val();
	var deviceGroupId = $('#L_xuan_she_all').val();
	var enable = $('.L_status_all_xuan1').val();
	load(1,{"size":pageNum,"page":1,"roleType":'security_manager',"dgId":deviceGroupId,"name":name,"enable":enable});
}
//添加
function state(_this){
	data = true;
	sessionStorage.setItem('datas',data);
	openTab(_this);
}
//批量删除
function peopleDelete() {
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
    url:server_url+'/web/securityCtr/deleteSecurityOr',
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