var pageNum =10;//每次条数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var flag = null;
var data=true;
var pitch = [];  //需要删除的设备

var isAdd=null,isEdit=null;
$(document).ready(function() {
	isShow('1000700010001','1000700010002');
	isAdd?$(".oper").show():$(".oper").hide();
	$.ajax({
		type: "POST",
		url: '/web/managementCtr/getDeviceTypeList',
		dataType: 'json',
		success: function (e) {
			for (var i = 0; i < e.data.length; i++) {
				var a = $('<option value=' + e.data[i].id + '>' + e.data[i].name + '</option>');
				$('.all_device1').append(a);
			}
			if (isAdd == false) {
				$('.append_create').remove();
			}
		},
		error: function (date) {
			returnMessage(2, '报错：' + date.status);
		}
	});
	load(paGe, {"size": pageNum, "page": paGe, "companyType": 'operating_company'});
});
//加载列表
function load(page,date){
	var pageCount;   //初始的
	$.ajax({
		type: "POST",
		url:'/web/managementCtr/getOperatingUnitsList',
		dataType: 'json',
		data:date,
		success:function(e){
		if(e.code==200){
			$("#waring_list tbody").empty();
			if(e.data.content.length!=0){
				for(var i = 0; i<e.data.content.length; i++){
					var is_edit='';
					if(isEdit){
						is_edit="<span  href='html/operate/append_operate/append_operate.html' onclick='change(this,\""+e.data.content[i].id+"\")' data-tit='修改运营商'>修改</span>";
					}else{
						is_edit='-';
					}
					if(e.data.content[i].enable != false){
						var company = $("<tr id="+e.data.content[i].id+"><td class='che_maintain1'><input type='checkbox' value="+e.data.content[i].id+" name='test' class='check-box'><i></i></td><td>"+(i+1)+"</td><td>"+tdCheck(e.data.content[i].loginName)+"</td><td>"+tdCheck(e.data.content[i].companyName)+"</td><td>"+tdCheck(e.data.content[i].deviceType)+"</td><td>"+tdCheck(e.data.content[i].contact)+"</td><td>"+tdCheck(e.data.content[i].telNumber)+"</td><td>"+tdCheck(e.data.content[i].email)+"</td><td>"+tdCheck(e.data.content[i].address)+"</td><td>启用</td><td style='color: #4395ff; cursor:pointer;'>"+is_edit+"</td></tr>")
					}else{
						var company = $("<tr id="+e.data.content[i].id+"><td class='che_maintain1'><input type='checkbox' value="+e.data.content[i].id+" name='test' class='check-box'><i></i></td><td>"+(i+1)+"</td><td>"+tdCheck(e.data.content[i].loginName)+"</td><td>"+tdCheck(e.data.content[i].companyName)+"</td><td>"+tdCheck(e.data.content[i].deviceType)+"</td><td>"+tdCheck(e.data.content[i].contact)+"</td><td>"+tdCheck(e.data.content[i].telNumber)+"</td><td>"+tdCheck(e.data.content[i].email)+"</td><td>"+tdCheck(e.data.content[i].address)+"</td><td>禁用</td><td style='color: #4395ff; cursor:pointer;'>"+is_edit+"</td></tr>")
					}
					$('#waring_list tbody').append(company);
				}
				if(isEdit == false){
					$('.modify_create1').remove();
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
		error:function(data){
			returnMessage(2, '报错：' + data.status);
		}
	});
}
//搜索
function searchList(){
		var companyName = $('.L_company_name1').val();
		var deviceType = $('.all_device1').val();
		var enable = $('.L_status_chuan1').val();
	load(1,{"size":pageNum,"page":1,"companyType":'operating_company',"inputStr":companyName,"deviceType":deviceType,"enable":enable});
}
//添加
function state(_this){
	data = true;
	sessionStorage.setItem('datas', data);
	openTab(_this);
}
//修改
function change(_this,usid){
	$.ajax({
		type: "POST",
		url: '/web/managementCtr/getManagementDetail',
		dataType: 'json',
		data: {companyId: usid},
		success: function (e) {
			var user = JSON.stringify(e);
			data = false;
			sessionStorage.setItem('circulate', user);
			sessionStorage.setItem('datas', data);
			openTab(_this);
		},
		error: function (data) {
			returnMessage(2, '报错：' + data.status);
		}
	});
}
//批量删除
function operateDelete() {
  	pitch = [];
	$('table tbody input[type=checkbox]:checked').each(function() {
		pitch.push($(this).val());
	});
	//console.log(pitch);

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