var cur_id=sessionStorage.getItem('mainten_id');
console.info(cur_id);

function save(){
	var file_elem=new FormData($('#main_form')[0]);
    file_elem.append('userId',userId)
	$.ajax({
		type:'post',
		url:server_url+'/app/file/uploadFile',
		header:{'userId':userId},
		contentType:false,
        processData:false,
        data:file_elem,
        success:function(data){

        }
	})
	var save_elem=new FormData();
	save_elem.append('userId',userId);
	save_elem.append('id',cur_id);
	save_elem.append('ids',['000011','000012']);
	save_elem.append('solutionDesc','测试维保');
	save_elem.append('endTime','2017-02-03');
	save_elem.append('trustees','张三');

	$.ajax({
		type:'post',
		url:server_url+'/web/device/handleDeviceMaintence',
		traditional:false,
		contentType:false,
        processData:false,
		data:save_elem,
		success:function(data){

		}
	})
}










































