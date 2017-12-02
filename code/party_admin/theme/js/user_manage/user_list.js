/*日期初始化*/
$("#datetimeStart").datetimepicker({
    format: "yyyy-mm-dd hh:ii:ss",
    //minView:'month',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
}).on("click",function(){
    $("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val())
});
$("#datetimeEnd").datetimepicker({
    format: "yyyy-mm-dd hh:ii:ss",
    //minView:'month',
    autoclose: true,
    todayBtn: true,
    changeMonth: true,
    changeYear: true,
    language: 'zh-CN',
    clearBtn: true
    //pickerPosition: "bottom-left"
}).on("click",function(){
    $("#datetimeEnd").datetimepicker("setStartDate",$("#datetimeStart").val())
});

/*列表内容展示与查询*/
var pageNum=10;  //每页显示数
var flag=true;	//判断字段
function pageListCon(page,size){
	var pageCount,vpage;
	$('#pagination').html(' ');
	//console.info($('.start-time input').val());
	//console.info($('#regist_select option:selected').attr('value'));  
	//<!-- <button class="btn bg-info btn-dialog-tab" href="user_manage/user_add.html" onclick="allot_role(this)">添加新用户</button> -->
	$.ajax({
		type:'get',
		url:'/crm/user/user/data.json',
		dataType:'json',
		data:{'page':page,'size':size,
			'username':$('.search-tab-box input[name=account]').val(),
			'name':$('.search-tab-box input[name=name]').val(),
			'status':$('#status_select option:selected').attr('value'),
			'orgId':$('#company_select option:selected').attr('value'),
			'registration':$('#regist_select option:selected').attr('value'),
			'begin':$('.start-time input').val(),
			'end':$('.end-time input').val(),
		},
		success:function(data){
			console.info(data);
			var code="";
			var $this=data.data;
			var rolesArr=[];
			if($this.items.length>0){
				for(var i=0;i<$this.items.length;i++){
					var curArr=$this.items[i].roles;
					code+=`
							<tr>
								<td><input type="checkbox" data-id=${$this.items[i].id}></td>
								<td>${i+1}</td>
								<td class="account">${noTd($this.items[i].username)}</td>
								<td class="naName">${noTd($this.items[i].name)}</td>
								<td class="phone">${noTd($this.items[i].phone)}</td>
								<td>${dateCheck($this.items[i].createTime)}</td>
								<td>${$this.items[i].registration==1?'手机号码':($this.items[i].registration==2?'微信':'后台')}</td>
								<td>${$this.items[i].regisorg==1?"APP":($this.items[i].regisorg==2?'WEB后台':'-')}</td>orgName
								<td>${noTd($this.items[i].regisaddress)}</td>
								<td class="org">${noTd($this.items[i].orgName)}</td>
								<td data-roles=${$this.items[i].rolesName}><span class="edit" onclick="checkDetail(${$this.items[i].id})" data-sex=${$this.items[i].sex} 
								data-depart=${$this.items[i].deptname} data-signature=${$this.items[i].signature} >查看</span></td>
								<td>${$this.items[i].status==1?'正常':'禁用'}</td>
								<td>
									<span class="oper-status ${$this.items[i].status==1?'opened':'closed'}">${$this.items[i].status==1?'已开启':'已关闭'}</span>
									<button href="/crm/sys/auth/user_control/user_edit.html" class="btn btn-primary btn-dialog-tab" onclick="modifyData(this)">修改</ button>
								</td>
							</tr>
						`;			
					}
					$('#userlist_tab tbody').html(code);
					pageCount=$this.pageCount;
					vpage=pageCount>10?10:pageCount;
					if(pageCount>1){
						$('.pages').show();
						initPagination('#pagination',pageCount,vpage,page,function(num,type){
							if(type=='change'){
						    	pageListCon(num,pageNum); 
							}
						})
					}else{
						$('.pages').hide();
						if(flag){
							pageListCon(1,pageNum);	
							flag=false;
						}
					}
				$('#userlist_tab').siblings('p.no-data').hide();
			}else{
				$('#userlist_tab').siblings('p.no-data').show();
				$('#userlist_tab tbody').html('');
				noData('#userlist_tab');
				$('.pages').hide();
			}
		},
		error:function(data){
			//returnMessage(2,'返回数据错误'+data.status);
		}
	})
}

/*跳转到第几页*/
function pageTo(_this){
	var max=parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
    var val=parseInt($(_this).siblings('input').val());
    var num=(val>0?val:1)>max?max:(val>0?val:1);
    pageListCon(num,pageNum)
    $(_this).siblings('input').val(num);
}

/*页面数据获取*/
pageListCon(1,pageNum)

$('.search-tab-box .btn-primary').click(function(){
	pageListCon(1,pageNum)
})

/*所属公司列表/user/org/data*/
$.ajax({
	type:'get',
	url:'/crm/user/org/data.json',
	dataType:'json',
	success:function(data){
		console.info(data);
		var $this=data.data;
		var code="";
		for(var i=0;i<$this.length;i++){
			code+=`
				<option value=${$this[i].orgId}>${$this[i].name}</option>
				`
		};
		$('#company_select').append(code);
	},
	error:function(data){
		//returnMessage(2,'返回数据错误'+data.status);
	}
})

function tree(data){
	var setting = {
            check : {
                enable : false,
            },
            data : {
                simpleData : {
                    enable : true,
                    idKey : "id",
                    pIdKey : "pId",
                    rootPId : ""
                }
            },
        };
    var zNodes =data;
    $.fn.zTree.init($("#orgTree"), setting, zNodes);
}


function checkDetail(_this){
	$.ajax({
		type:'get',
		url:'/crm/user/user/upuserdata.json',
		data:{'id':_this},
		dataType:'json',
		success:function(data){
			console.info(data);
			var _this=data.data;
			if(_this){
				$('.detail_account').text(noVal(_this.username));
				$('.detail_name').text(noVal(_this.name));
				$('.detail_phone').text(noVal(_this.phone));
				$('.detail_sex').text(_this.sex==0?'男':'女');
				$('.detail_signature').text(noVal(_this.signature));
				//$('.detail_company').text(noVal(_this.orgName));
				$('.detail_email').text(noVal(_this.email));
				$('.detail_depart').text(noVal(_this.deptname));
				$('.detail_role').text(noVal(_this.rolesName));
				$('#check_modal').modal();
				var zNodes=_this.orgtree;
				tree(_this.orgtree)
				console.info(zNodes)
			}
		}
	})
}

/*删除*/
function deleteUser(){
    if($('#userlist_tab .list input[type=checkbox]:checked').length!=0){
		confirmMsg('你确认删除吗？',function(dialog){
			$.ajax({
				type:'post',
				url:'/crm/user/user/deletedata.json',
				dataType:'json',
				data:{'ids':idx($('#userlist_tab tbody input[type=checkbox]:checked'))},
				success:function(data){
					dialog.close();
					successMsg(data.code,0,"删除成功");
					pageListCon(1,pageNum);
				}
			})	
        })  
	}else{
		returnMessage(2,'请选择要删除的用户！')
	}
}

/*启用禁用操作 0禁用1正常2拉黑*/
$('#userlist_tab').on('click','.oper-status',function(){
	var flag;
	if($(this).hasClass('opened')){
		flag=0;
	}else{
		flag=1;
	}
	$.ajax({
		type:'post',
		url:'/crm//user/user/updatestatusdata.json',
		data:{'id':$(this).parent().siblings().find('input[type=checkbox]').attr('data-id'),'status':flag},
		dataType:'json',
		success:function(data){
			successMsg(data.code,0,"操作成功");
			pageListCon(1,pageNum);
		},
	})
})

/*修改*/
function modifyData(_this){
	sessionStorage.setItem('id',$(_this).parent().siblings().find('input[type=checkbox]').attr('data-id'));
}

/*添加用户*/
function addUser(){
	sessionStorage.setItem('id','');
}









































