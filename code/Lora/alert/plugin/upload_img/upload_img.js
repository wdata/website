$(function(){
	$('.L_map_place').find('a').click(function(){
		$('.L_map_place').find('input').val('');
	});
	// 点input框出现下拉框
	$('.L_map_place').find('input').focus(function(){
		$('.L_place_frame').css('display','block');
	});
	// 下拉框动态
	$('.L_address_list').find('li').hover(function(){
		$('.L_address_list').find('li').css('background-color','#fff').css('color','#000');
		$(this).css('background-color','#4395ff').css('color','#fff');
	});
	$('.L_address_list').find('li').click(function(){
		var value = $(this).text();
		
		$('.L_map_place').find('input').val(value);
	});
	$('.L_place_frame').find('button').eq(0).click(function(){
		$('.L_place_frame').css('display','none');
	});
	$('.L_place_frame').find('button').eq(1).click(function(){
		$('.L_place_frame').css('display','none');
	});    
});