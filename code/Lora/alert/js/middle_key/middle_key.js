$(function(){
   initPagination("#user_pagination",10,1,1,function(num){});
   $.ajax({
		type: "POST",
        url:'/web/middleWareCtr/getMiddleWareList',
        dataType: 'json',
        data:{},
        success:function(e){
        	console.log(e);
        	// var numall = e.data.totalPages;
        	// $('.total').find('span').html(numall);
   //      	initPagination("#user_pagination",numall,1,1,function(num){
		 // 		$.ajax({
			// 		type: "post",
		 //            url:'/web/accountCtr/getLogList',
		 //            dataType: 'json',
		 //            data:{size:'10',page:num},
		 //            success:function(e){
		 //            	console.log(e)
		 //            	$('.L_describe_operation4').find('tbody').html('');
		 //            	var timestamp3  = e.data.content[i].createTime;
		 //            		var newDate = new Date(timestamp3);
		 //            		Date.prototype.format = function(format) {
			// 		       	var date = {
			// 		              "M+": this.getMonth() + 1,
			// 		              "d+": this.getDate(),
			// 		              "h+": this.getHours(),
			// 		              "m+": this.getMinutes(),
			// 		              "s+": this.getSeconds(),
			// 		              "q+": Math.floor((this.getMonth() + 3) / 3),
			// 		              "S+": this.getMilliseconds()
			// 		       		};
			// 				       if (/(y+)/i.test(format)) {
			// 				              format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
			// 				       }
			// 				       for (var k in date) {
			// 				              if (new RegExp("(" + k + ")").test(format)) {
			// 				                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
			// 				                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			// 				              }
			// 				       }
			// 				       return format;
			// 				};
		 //            	for(var i = 0; i<e.data.content.length; i++){
		            		

		 //            		for(var k=0;k<e.data.content[i].role.length;k++){
		 //            			if(e.data.content[i].status != false){
		 //            				var company = $("<tr><td>"+e.data.content[i].id+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+newDate.format('yyyy-MM-dd h:m:s')+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].role[k].roleName+"</td><td>正常</td><td><span>添加角色</span><span>启用</span><span>编辑</span></td></tr>");
			//             		}else{
			//             			var company = $("<tr><td>"+e.data.content[i].id+"</td><td>"+e.data.content[i].loginName+"</td><td>"+e.data.content[i].name+"</td><td>"+newDate.format('yyyy-MM-dd h:m:s')+"</td><td>"+e.data.content[i].telNumber+"</td><td>"+e.data.content[i].role[k].roleName+"</td><td>禁用</td><td><span>添加角色</span><span>启用</span><span>编辑</span></td></tr>");
			//             		};
			//             		$('.L_describe_operation4').find('tbody').append(company);
		 //            		};		            	
		 //            	}
		 //            },
		 //            error:function(){}
			// 	});
			// });
        },
        error:function(){}
	});
});