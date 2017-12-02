/*分组数据初始化*/
function initTree(){
	$.ajax({
		type:'get',
		url:'/crm/sys/params/paramsGroupZtree.json',
		dataType:'json',
		success:function(data){
			var code="";
			var secCode="";
			var secArr=[];
			for(var i=0;i<data.length;i++){
				if(data[i].pId==0){
					code+=`
					<div class="list">
		                <div class="tit diction_show" data-id=${data[i].id}>${data[i].name}<i class="fa fa-chevron-down fr"></i></div>
		            </div>
				`;
					for(var j=i;j<data.length;j++){
						if(data[j].pId==data[i].id){
							secCode+=`
		                    <li class="diction_show" data-id=${data[j].id}>${data[j].name}</li>
						`
						}
					}
				}
				secArr.push(secCode);
			}
			$('.group-con').html(code);
			for(var i=0;i<secArr.length;i++){
				//console.info(secArr[i]);
				$('.group-con .list').eq(i).append('<ul></ul>').find('ul').html(secArr[i])
			}
		}
	});
}
initTree();
/*分组切换*/
$('.group-con').on('click','.list .tit i',function(event){
	event.stopPropagation();
	$(this).parent().siblings('ul').slideToggle();
	$(this).parents().siblings().find('ul').slideUp();
});
/*点击分组*/
var pageNum=10;
var cur_group;    //当前分组
var flag=true;
function pageListCon(page,size,seires){
	var pageCount,vpage;
	$.ajax({
		type:'get',
		url:'/crm/mongo/dictionEntity.json',
		dataType:'json',
		data:{'filters[series].eq':seires,'filters[label].like':$('.search-box input[name=name]').val(),'filters[key].like':$('.search-box input[name=value]').val(),'page':page,'size':size,'count':-2},
		success:function(data){
			var code="";
			console.info(data)
			for(var i=0;i<data.rows.length;i++){
				code+=`
				<tr>
					<td><input type="checkbox" data-value="${data.rows[i].key}" data-series="${data.rows[i].series}"
							data-label="${data.rows[i].label}" data-description="${data.rows[i].description}" value=${data.rows[i].id}></td>
                    <td>${i+1}</td>
                    <td>${data.rows[i].series}</td>
                    <td>${data.rows[i].key}</td>
                    <td>${data.rows[i].label}</td>
                    <td>${data.rows[i].description}</td>
                </tr>
                `
			}
			$('#diction_tab tbody,.con-table .clone-table tbody').html(code);
			$('.table-footer .start-num').text();
			pageCount=data.pageCount;
			vpage=pageCount>10?10:pageCount;
			if(pageCount>1){
				$('#pagination').show();
				flag=true;
				initPagination('#pagination',pageCount,vpage,page,function(num,type){
					if(type=='change'){
				    	pageListCon(num,size,seires); 
					}
				})
			}else{
				if(flag){
					pageListCon(1,size,seires);	
					flag=false;
					$('#pagination').hide();
				}
			}
			//显示展示数据
			$('.sum_num').text(data.total);
			$('.start_num').text((page-1)*size+1);
			$('.end_num').text((page*size)>data.total?data.total:(page*size));
		}
	});
}
pageListCon(1,pageNum,'')
$('.group-con').on('click','.diction_show',function(){
	$('.diction_show').removeClass('active');
	$(this).addClass('active');
	if($(this).hasClass('tit')){
		pageListCon(1,10,'');
		cur_group="";
	}else{
		pageListCon(1,10,$(this).text());
		cur_group=$(this).text();
	}
});
$('#diction_table_wrap').xb_scroll();

//搜索
function searh(){
	pageListCon(1,pageNum,cur_group);
}

/*分页下拉*/
$('.dropdown-menu li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    $(this).parent().siblings('button').find('.page-size').text($(this).text());
    console.info(parseInt($(this).text()))
    pageListCon(1,parseInt($(this).text()),cur_group);
});
/*添加分组表格内容设置*/
function setGroupTab(series,key,label,description){
}

/*添加分组*/
function addGroup(){
	$('#group_add').modal(true);
}
function saveGroup(){
		//console.info($('#group_add_form input[name=group]').val());
		$.ajax({
			type:'post',
			url:'/crm/mongo/dictionEntity.json',
			dataType:'json',
			data:{
				'series':$('#group_add_form input[name=group]').val().replace(/(^\s*)|(\s*$)/g,""),
				'key':$('#group_add_form input[name=key]').val().replace(/(^\s*)|(\s*$)/g,""),
				'label':$('#group_add_form input[name=name]').val().replace(/(^\s*)|(\s*$)/g,""),
				'description':$('#group_add_form input[name=info]').val().replace(/(^\s*)|(\s*$)/g,"")
			},
			success:function(data){
				console.log(data);
				successMsg(data.code,0,data.message);
				initTree();
				$("#group_add_form input[type=text]").val('');
			},
			error:function(data){
				console.log(data)
				returnMessage(2,data.message);
			}
		})		
}

//删除分组
function deleteGroup(){
	if($('ul .diction_show').hasClass('active')){
		var arr=[];
		$('#diction_tab input[type=checkbox]').each(function(){
			arr.push($(this).attr('value'));
		})
		confirmMsg('你确定删除该分组吗？',function(dialog){
			$.ajax({
				type:'post',
				url:'/crm/mongo/dictionEntity.json',
				dataType:'json',
				data:{'id':arr.join(','),'_method':'DELETE'},
				success:function(data){
					dialog.close();
					successMsg(data.code,0,data.message);
					initTree();
				}
			})	
		})
	}else{
		returnMessage(2,'请选择一个分组')
	}
}

//添加新参数
function newArguments(){
	if($('ul .diction_show').hasClass('active')){
		$('#arguments').modal(true);
		$('#arguments .modal-title').html('参数管理-添加分组参数');
		$('#arguments [name=group]').val(cur_group);
		$('#saveBtn').click(function(){
			addArgument();
		});	
	}else{
		returnMessage(2,'请选择要添加参数的分组！')
	}
	
}

//参数add:
function addArgument(){
	$.ajax({
		type:'post',
		url:'/crm/mongo/dictionEntity.json',
		dataType:'json',
		data:{
			'series':cur_group,
			'key':$('#arguments input[name=key]').val().replace(/(^\s*)|(\s*$)/g,""),
			'label':$('#arguments input[name=name]').val().replace(/(^\s*)|(\s*$)/g,""),
			'description':$('#arguments input[name=info]').val().replace(/(^\s*)|(\s*$)/g,"")
		},
		success:function(data){
			console.log(data);
			successMsg(data.code,0,data.message);
			pageListCon(1,10,cur_group);
			$("#arguments input[type=text]").val('');
		},
		error:function(data){
			console.log(data);
			returnMessage(2,data.message);
		}
	})
}
//修改参数
function editArguments(){
	var Argument = [];
	var check = $('#diction_tab tbody :checked');
	//console.log(check);
	$.each(check,function(index,item){
		if($(item).is(':checked')){
			Argument.push(item);
		}
	});
	if(Argument.length>1||Argument.length===0){
		BootstrapDialog.show({
			'type': 'type-warning',
			'title': '返回信息',
			'message': '每次只能选定一个进行修改！',
			'buttons': [{
				label: '确定',
				cssClass: 'btn-warning',
				action: function (dialog) {
					dialog.close();
					$('#diction_tab thead [type="checkbox"]').prop('checked',false);
				}
			}]
		});
		return false;
	}

	$('#arguments').modal(true);
	$('#arguments .modal-title').html('参数管理-修改分组参数');
	$('#arguments [name=group]').val($(Argument).data('series'));
	$('#arguments [name=key]').val($(Argument).data('value'));
	$('#arguments [name=name]').val($(Argument).data('label'));
	$('#arguments [name=info]').val($(Argument).data('description'));
	$('#arguments .a_key').addClass('undis');
	$('#saveBtn').click(function(){
		updateArgument();
	});
}
//参数update:
function updateArgument(){
	$.ajax({
		type:'PUT',
		url:'/crm/mongo/dictionEntity/'+$('#diction_tab .list').find('input[type=checkbox]:checked').attr('value')+'.json',
		dataType:'json',
		data:{
			'series':$('#arguments input[name=group]').val(),
			'key':$('#arguments input[name=key]').val().replace(/(^\s*)|(\s*$)/g,""),
			'label':$('#arguments input[name=name]').val().replace(/(^\s*)|(\s*$)/g,""),
			'description':$('#arguments input[name=info]').val().replace(/(^\s*)|(\s*$)/g,"")
		},
		success:function(data){
			console.log(data);
			successMsg(data.code,0,data.message);
			pageListCon(1,pageNum,cur_group);
			$("#arguments input[type=text]").val('');
			$('#arguments .a_key').removeClass('undis');
			$("#arguments input[type=text]").val('');
		},
		error:function(data){
			console.log(data);
			returnMessage(2,"操作出错"+data.status);
			$('#arguments .a_key').removeClass('undis');
		}
	})
}

//删除参数
function deleteArgument(){
	var Argument = [];
	var check = $('#diction_tab tbody :checked');
	//console.log(check);
	$.each(check,function(index,item){
		if($(item).is(':checked')){
			Argument.push($(item).data('series')+'|'+$(item).data('value'));
		}
	});
	if(Argument.length>0) {
		BootstrapDialog.show({
			'type': 'type-warning',
			'title': '返回信息',
			'message': '确定要删除所选用户吗？',
			'buttons': [{
				label: '确定',
				cssClass: 'btn-warning',
				action: function (dialog) {
					dialog.close();
					removeArgument(Argument);
					$('#diction_tab thead [type="checkbox"]').prop('checked',false);
				}
			}]
		});
	}
	console.dir(Argument);
}
//参数remove
function removeArgument(Argument){
	$.ajax({
		type:'post',
		url:'/crm/mongo/dictionEntity.json',
		dataType:'json',
		data:{
			'id':Argument.join(','),
			'_method':'DELETE'
		},
		success:function(data){
			console.log(data);
			successMsg(data.code,0,data.message);
			pageListCon(1,10,cur_group);
		},
		error:function(data){
			console.log(data);
			returnMessage(2,data.message);
		}
	})
}













































