$(function(){
	initPagination("#user_pagination",10,1,1,function(num){});
	$.ajax({
		type: "POST",
        url:'/web/securityCtr/getSafetyInspectionList',
        dataType: 'json',
        data:{size:'10',page:1,roleType:'security_patrol'},
        success:function(e){
        	console.log(e)
        },
        error:function(){}
    })
});