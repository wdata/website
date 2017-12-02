$(function(){
	var i=0;
	$('.modifySort').click(function(){
		var elem=$(this).parent().prev().find('span');
		var oldNum=elem.text();
		if(i%2==0){
			elem.html("<input type='text' value="+oldNum+" style='width:100%;box-sizing:border-box'>");
			$(this).text('保存');
		}else{
			var newNum=elem.find('input').val();
			elem.html(newNum);
			//当万分比发生改变时，才进行数据交互
			if(newNum!=oldNum){ 

			}
			$(this).text('修改');
		}
		i++;
		
		
		
	})
})