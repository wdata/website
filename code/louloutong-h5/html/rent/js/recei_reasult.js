
$('.reasult-editer').focus(function(){
	$('.placeholder').remove();
});
$('.reasult-editer').blur(function(){
	if($.trim($(this).val()).length<=0){
		$('.reasult-box').append('<div class="placeholder">请填写接待结果<span>(30个字以内)</span></div>');
	}
});















