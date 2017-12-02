var num=1;
$(function(){
	sessionStorage.clear();
});
function changeVercode(_this){
	num=1;
	var radom=(new Date()).getTime();
	$(_this).attr('src','/vercode.json?fresh='+radom);
}
function login(){
	if(num==1){
		num++;
		var name = $('.L_yong_name').find('input').val();
		var prd = $('.L_yong_prd').find('input').val();
		var number = $('.L_yan_zheng').find('input').val();
		if($("#login").valid()){
			$.ajax({
				url:'/web/loginCtr/loginByIdenCode',
				type:'POST',
				dataType: 'json',
				data:{
					loginName:name,
					password:prd,
					idenCode:number
				},
				success:function(res){
					if(res.code == 200){
						console.log(res);
						var code = res.data.userDTO.name;
						var client = res.data.userDTO.userId;
						var role=res.data.userDTO.role.roleName;
						var roleType=res.data.userDTO.role.roleType;
						sessionStorage.setItem('companyID',res.data.userDTO.company.id);
						sessionStorage.setItem('suc',code);
						sessionStorage.setItem('clt',client);
						sessionStorage.setItem('login_role',role);
						sessionStorage.setItem('roleType',roleType);
						sessionStorage.setItem('userid',res.data.userDTO.userId);
						//sessionStorage.setItem('userType',res.data.userDTO.userType);
						sessionStorage.setItem('systemSetting',res.data.userDTO.systemSetting);
						var changePwd=res.data.userDTO.changePwd?true:false;
						sessionStorage.setItem('changePwd',changePwd);
						window.location.href = "../../index.html";
					}else if(res.code == 400){
						var radom=(new Date()).getTime();
						alertMsg('type-danger',res.message,'btn-danger',function(dialog){
							num=1;
							$('#imgCode').attr('src','/vercode.json?fresh='+radom);
							dialog.close();
						});
					}else {
						alertMsg('type-danger',res.message,'btn-danger',function(dialog){//失败
							num=1;
							dialog.close();
						});
					}
				},
				error: function(res) {
					returnMessage(1,res.status);
				}
			});
		}
	}
}
//键盘Enter键 登录：
function EnterUp(e){
	var keynum;
	var keychar;
	keynum = window.event ? e.keyCode : e.which;
	keychar = String.fromCharCode(keynum);
	if(keynum==13){
		if($('.L_yong_name').find('input').val()!==''&&$('.L_yong_prd').find('input').val()!==''&&$('.L_yan_zheng').find('input').val()!==''){
			login();
		}
		return true;
	}
}
