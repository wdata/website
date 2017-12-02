$(function(){
	initPagination("#user_pagination",10,1,1,function(num){
	});

	$.ajax({
		type: "POST",
        url:'/web/webDutyCtr/findDutyList',
        dataType: 'json',
        data:{size:'10',page:1,roleType:'security_manager'},
        success:function(e){
        	console.log(e);
   //      	for(var j = 0; j<e.data.deviceGroups.length; j++){
   //      		var option = $('<option value = '+e.data.deviceGroups[j].id+'>'+e.data.deviceGroups[j].groupName+'</option>');
   //      		$('.L_xuan_she_all').append(option);
   //      	}
   //      	var numall = e.data.securityPage.totalElements;
   //      	console.log(numall)
   //      	$('.total').find('span').html(numall);
   //      	initPagination("#user_pagination",numall,1,1,function(num){
		 // 		$.ajax({
			// 		type: "post",
		 //            url:'/dutyCtr/dutyList',
		 //            dataType: 'json',
		 //            data:{size:'10',page:num,roleType:'security_manager'},
		 //            success:function(e){
		 //            	$('.L_describe_operation').find('tbody').html('');
		 //            	for(var i = 0; i<e.data.securityPage.content.length; i++){
		 //            		for(var k=0;k<e.data.securityPage.content[i].deviceGroups.length;k++){
		 //            			if(e.data.securityPage.content[i].status != false){
		 //            				var company = $("<tr><td><input type='checkbox' name=''></td><td>"+e.data.securityPage.content[i].id+"</td><td>"+e.data.securityPage.content[i].loginName+"</td><td>"+e.data.securityPage.content[i].name+"</td><td>"+e.data.securityPage.content[i].telNumber+"</td><td>"+e.data.securityPage.content[i].email+"</td><td>"+e.data.securityPage.content[i].address+"</td><td>"+e.data.securityPage.content[i].deviceGroups[k].groupName+"</td><td>在线</td><td>"+e.data.securityPage.content[i].company.companyName+"</td><td>启用</td><td style='color: #4395ff; cursor:pointer;'><span>修改</span></td></tr>");
			//             		}else{
			//             			var company = $("<tr><td><input type='checkbox' name=''></td><td>"+e.data.securityPage.content[i].id+"</td><td>"+e.data.securityPage.content[i].loginName+"</td><td>"+e.data.securityPage.content[i].name+"</td><td>"+e.data.securityPage.content[i].telNumber+"</td><td>"+e.data.securityPage.content[i].email+"</td><td>"+e.data.securityPage.content[i].address+"</td><td>"+e.data.securityPage.content[i].deviceGroups[k].groupName+"</td><td>在线</td><td>"+e.data.securityPage.content[i].company.companyName+"</td><td>启用</td><td style='color: #4395ff; cursor:pointer;'><span>修改</span></td></tr>");
			//             		};
			//             		$('.L_describe_operation').find('tbody').append(company);
		 //            		};		            	}
		 //            	},
		 //            error:function(){}
			// 	});
			// });
        },
        error:function(){}
	});
});