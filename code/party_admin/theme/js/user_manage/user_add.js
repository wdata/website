/*日期初始化*/
$(".form_datetime").datetimepicker({
	format: 'yyyy-mm-dd',
    language:'zh-CN',
    autoclose: 1,
    minView: "month", 
});

/*职务树获取设置*/
function tree(data){
	var setting = {
            check : {
                enable : true,
                chkStyle: "checkbox",
				chkboxType: { "Y": "p", "N": "s" },
				radioType:'all'
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
/*所属公司列表*/
$.ajax({
	type:'get',
	url:'/crm/user/org/data.json',
	dataType:'json',
	success:function(data){
		console.info(data);
		var code="";
		var $this=data.data;
		if($this){
			for(var i=0;i<data.data.length;i++){
				code+=`
					<option value=${$this[i].orgId}>${$this[i].name}</option>
					`
			};
			$('#company_select').append(code);	
		}
	},
	error:function(data){
		returnMessage(2,'返回数据错误'+data.status);
	}
})

/*部门职务获取*/
function orgChoose(old_data,old_orgid){
	if($('#company_select option:selected').val()==old_orgid){
		tree(old_data); 
		$("#org_modal").modal();
	}else{
		$.ajax({
			type:'get',
			url:'/crm/user/deptposi/data.json',
			dataType:'json',
			data:{'orgId':$('#company_select option:selected').val()},
			success:function(data){
				tree(data.data)
	            $("#org_modal").modal();
			}
		});
	}
}

var user_id=sessionStorage.getItem("id");

$('.modify_hide').show();
	$('#add_user_form').attr('action','/crm/user/user/savedata.json');
	$('#add_user_form input[name=username]').removeAttr('readonly');
	$('#org_get').click(function(){
		console.info($('#company_select').val())
		if($('#company_select').val()){
			orgChoose();
		}else{
			returnMessage(2,'请先选择一个单位！')
		}
		
	})
	/*添加用户提交*/
	function userSubmit(){
		if($("#add_user_form").valid()){
			$("#add_user_form").ajaxSubmit({
				beforeSend:function(xhr){
					$('.opering-mask').show().find('.con').text('正在处理中，处理结束后该弹窗消失！')
				},
	            complete:function(){
	            	$('.opering-mask').hide()
	            },
	            success:function(res){ 				
				  	console.log(res);
	                if(res.code===0){
	                    returnMessage(1,res.message);
	                }else{
	                	returnMessage(2,'操作失败！');	
	                }
	            },
	            error:function(res){
	                returnMessage(2,'操作失败！');	
	            },
	            url: server_url+'/crm/user/user/savedata.json',                
	            type:'post',
	            dataType: 'json',         
	            clearForm: true          
			});
		}
	}

/*角色获取 $('#company_select option:selected').val()*/
$("#add_user_form").validate({
	onfocusout: function(element) { $(element).valid(); }
})
function getRole(id){
	$.ajax({
		type:'get',
		url:'/crm/user/role/data.json',
		dataType:'json',
		data:{'orgId':id},
		success:function(data){
			console.info(data.data);
			var code="";
			for(var i=0;i<data.data.length;i++){
				code+=`
					<div class="check-group"><input type="checkbox" id=${data.data[i].id} value><label for=${data.data[i].id}>${data.data[i].name}</label></div>
				`
			}
			$('#role_group').html(code);
		}
	})
}
function setRole(id,chooseIds){
	$.ajax({
		type:'get',
		url:'/crm/user/role/data.json',
		dataType:'json',
		data:{'orgId':id},
		success:function(data){
			console.info(data.data);
			var code="";
			var _this=data.data;
			for(var i=0;i<_this.length;i++){
				code+=`
						<div class="check-group"><input type="checkbox" id=${_this[i].id}><label for=${_this[i].id}>${_this[i].name}</label></div>
					`		
			}
			$('#role_group').html(code);
			$('#role_group .check-group').each(function(){
				for(var j=0;j<chooseIds.length;j++){
					if(chooseIds[j]==$(this).find('input').attr('id')){
						$(this).find('input').prop('checked',true);
					}
				}
				
			})
		}
	})
}

var cur_org_id;
$('#company_select').change(function(){
	$('#org_value').val('')
	console.info($(this).val())
	if($(this).val()){
		console.info($(this).val())
		$('.role-groups').show();
		getRole($(this).val());
		cur_org_id=$(this).val()
	}
})
/*新增角色*/
function addRolesMask(){
	$('#roles_modal').modal();
	clearForm('#addRole_form');
}
function saveRole(){
	addRole(cur_org_id)
}

function addRole(id){
	if($('#addRole_form').valid()){
		$.ajax({
			type:'post',
			url:'/crm/user/user/addRoledata.json',
			dataType:'json',
			data:{'id':$('#role_id').val(),'roleName':$('#role_name').val(),'orgId':id,'type':1},
			success:function(data){
				$('#roles_modal').modal('hide');
				if(data.code==0){
					returnMessage(1,"添加成功");
					getRole(id);
				}else{
					returnMessage(2,'添加失败');
				}
			}
		})	
	}
}


/*添加部门职务*/
function chooseIds(){
	var zTree = $.fn.zTree.getZTreeObj("orgTree");
    var $r = zTree.getCheckedNodes();
    var $idx ='';
    for (var i = 0; i < $r.length; i++) {
        $idx += ($idx == '') ? $r[i].id : ',' + $r[i].id;
    }
    $('#org_value').val($idx);
   	$("#org_modal").modal('hide');
}

$('#role_group').on('change','input[type=checkbox]',function(){
    var arr=[];
    $('#role_group input[type=checkbox]:checked').each(function(){
    	arr.push($(this).attr('id'));
    })
    $('#role_value').val(arr.join(','));
})



/*添加单位跳转*/
function newAdd(){
	sessionStorage.setItem('canEdit',0);
	location.href = 'org_control/org_add.html';
}


/*出生日期开始*/
function YYYYMMDDstart(){   
   MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];   

   //先给年下拉框赋内容   
   var y  = new Date().getFullYear();   
   for (var i = (y-60); i < (y+1); i++) //以今年为准，前30年，后30年   
           document.reg_testdate.YYYY.options.add(new Option(" "+ i +" 年", i));   

   //赋月份的下拉框   
   for (var i = 1; i < 13; i++)   
           document.reg_testdate.MM.options.add(new Option(" " + i + " 月", i));   

   document.reg_testdate.YYYY.value = y;   
   document.reg_testdate.MM.value = new Date().getMonth() + 1;   
   var n = MonHead[new Date().getMonth()];   
   if (new Date().getMonth() ==1 && IsPinYear(YYYYvalue)) n++;   
        writeDay(n); //赋日期下拉框Author:meizz   
   document.reg_testdate.DD.value = new Date().getDate(); 
   $('input[name=birth]').val(y+'-'+(new Date().getMonth() + 1)+'-'+new Date().getDate())  
}   
if(document.attachEvent)   
   window.attachEvent("onload", YYYYMMDDstart);   
else   
   window.addEventListener('load', YYYYMMDDstart, false);   
function YYYYDD(str) //年发生变化时日期发生变化(主要是判断闰平年)   
{   
		$('.select[name=MM] option').first().prop('selected',true);
		var MMvalue = document.reg_testdate.MM.options[document.reg_testdate.MM.selectedIndex].value;   
		if (MMvalue == ""){ var e = document.reg_testdate.DD; optionsClear(e); return;}   
		var n = MonHead[MMvalue - 1];   
		if (MMvalue ==2 && IsPinYear(str)) n++;   
			writeDay(n) ; 

}   
function MMDD(str)   //月发生变化时日期联动   
{   
    var YYYYvalue = document.reg_testdate.YYYY.options[document.reg_testdate.YYYY.selectedIndex].value;   
    if (YYYYvalue == ""){ var e = document.reg_testdate.DD; optionsClear(e); return;}   
    var n = MonHead[str - 1];   
    if (str ==2 && IsPinYear(YYYYvalue)) n++;   
   	writeDay(n)   
}   
function writeDay(n)   //据条件写日期的下拉框   
{   
       var e = document.reg_testdate.DD; optionsClear(e);   
       for (var i=1; i<(n+1); i++)   
            e.options.add(new Option(" "+ i + " 日", i));   
}   
function IsPinYear(year)//判断是否闰平年   
{     return(0 == year%4 && (year%100 !=0 || year%400 == 0));}   
function optionsClear(e)   
{   
    e.options.length = 1;   
}   

function birthGet(_this){
	$('input[name=birth]').val($('select[name="YYYY"]').val()+'-'+$('select[name="MM"]').val()+'-'+_this.value)
}


/*出生日期结束*/






















