
var pageNum = 10;//每次条数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var flag = null;
var data=true;
var pitch = [];  //需要删除的设备

//  创建添加和修改，隐藏添加按钮
var isAdd = null , isEdit = null , GTPassword = null;
$(document).ready(function(){
    // 安全巡检员列表	html/security_personnel/inspection_biao/inspection_biao.html	100100001
    // 添加安全巡检员		1001000010001
    // 修改安全巡检员		1001000010002
    // 删除安全巡检员		1001000010003
    // 获取密码安全巡检员	1001000010004
    isShow("1001000010001","1001000010002","","","","","1001000010004");
	isAdd?$(".oper").show():$(".oper").hide();
	load(paGe,{"size":pageNum,"page":paGe});
});
//加载列表
function load(page,date){
	var pageCount;   //初始的
	if(date!=undefined) {
		$.ajax({
			type: "POST",
			url: '/web/securityCtr/getSafetyInspectionList',
			dataType: 'json',
			data: date,
			success: function (e) {
				if(e.code === 200) {
					$("#waring_list tbody").empty();
					if(e.data!=null){
						var company='';
						for(var i = 0; i<e.data.content.length; i++){
                            var edit = "-" , password = "-";
							if(isEdit){
                                edit = "<span href='html/security_personnel/join_inspection/join_inspection.html' onclick=\"change(this,'"+e.data.content[i].id+"')\" data-tit='修改新巡检人员'>修改</span>";
							}
							if(GTPassword){
                                password = "<span onclick=\"getPassword(\'"+e.data.content[i].id+"\')\">获取密码</span>";
							}
							if(e.data.content[i].enable != false){
								company+="<tr id="+e.data.content[i].id+"><td class='supervise_surface'><input type='checkbox' value="+e.data.content[i].id+" name='test' class='L_second_checkbox check-box'><i></i></td><td>"+(i+1)+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].email+"</td><td>"+tdCheck(e.data.content[i].address)+"</td><td>"+tdCheck(e.data.content[i].securityManager)+"</td></td><td>"+e.data.content[i].companyName+"</td><td>启用</td><td style='color: #4395ff; cursor:pointer;white-space:nowrap; overflow:hidden; text-overflow:ellipsis'>"+ edit +"&nbsp;"+ password +"</td></tr>";
							}else{
								company+= "<tr id="+e.data.content[i].id+"><td class='supervise_surface'><input type='checkbox' value="+e.data.content[i].id+" name='test' class='L_second_checkbox check-box'><i></i></td><td>"+(i+1)+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].email+"</td><td>"+tdCheck(e.data.content[i].address)+"</td><td>"+tdCheck(e.data.content[i].securityManager)+"</td><td>"+e.data.content[i].companyName+"</td><td>禁用</td><td style='color: #4395ff; cursor:pointer;white-space:nowrap; overflow:hidden; text-overflow:ellipsis'>"+ edit +"&nbsp;"+ password +"</td></tr>";
							}
						}
						$("#waring_list tbody").html(company);

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
						$("#waring_list tbody").html('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
					}
				}else if(data.code==204){
					//无数据提醒框
					$('.pages').addClass("undis");
					$("#waring_list tbody").html('<tr><td style="text-align: center" colspan="15">当前条件下无数据展示！！！</td></tr>');
				}else{
					$('.pages').addClass("undis");
					returnMessage(2,data.message);
				}
			},
			error: function (data) {
				returnMessage(2, '报错：' + data.status);
			}
		});
	}
}
//批量删除
function inspectionDelete() {
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
//搜索
function searchList(){
	var name = $('.L_search_neme1').val();
	var enable = $('.L_status_all_xuan1').val();
	load(1,{"size":pageNum,"page":1,"enable":enable,"name":name});
}
//添加
function state(_this){
	data = true;
	sessionStorage.setItem('datas',data);
	openTab(_this);
}
//修改
function change(_this,usid){
	$.ajax({
		type: "POST",
		url:'/web/securityCtr/getSecuritOrDetail',
		dataType: 'json',
		data:{uId:usid},
		beforeSend:function(){
			$('.opering-mask').show();
		},
		complete:function(){
			$('.opering-mask').hide();
		},
		success:function(e){
			var user = JSON.stringify(e);
			data = false;
			sessionStorage.setItem('inspect',user);
			sessionStorage.setItem('datas',data);
			openTab(_this);
		},
		error:function(data){
			returnMessage(2, '报错：' + data.status);
		}
	});
}
//获取密码操作
function getPassword(usid){
	$.ajax({
			type: "POST",
			url:'/web/securityCtr/getSecurityOrPassWord',
			dataType: 'json',
			data:{"uId":usid},
			success:function(e){
				if(e.code== 200){
					returnMessage(1,"密码已发送成功！！")
				}else{
					returnMessage(2,"密码发送失败");
				}
			},
			error:function(data){
				returnMessage(2, '报错：' + data.status);
			}
		});
}
function deleteDevice(idsId) {
  $.ajax({
    type:'post',
    url:'/web/securityCtr/deletePatrolInfo',
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