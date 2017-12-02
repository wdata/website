$(function(){
	initPagination("#user_pagination",10,1,1,function(num){});
	$.ajax({
		type: "POST",
        url:'/web/webDutyCtr/findDutyList',
        dataType: 'json',
        contentType:'application/json',
        data:JSON.stringify({"dutyLeave":{}}),
        success:function(e){
        	console.log(e)
        },
        error:function(){}
    })
    // $.post('/web/webDutyCtr/testJson',{userName:"test"},function(e){
    //     console.log(e)
    // })
})