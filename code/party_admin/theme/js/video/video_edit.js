/*编辑封面*/
function coverEdit(_this){
	if($(_this).find('input').val()=="0"){
		$('.reupload-cover').show();
		$('.cut-cover').hide();
	}else{
		$('.reupload-cover').hide();
		$('.cut-cover').show();
	}
}
















































