var _pf_id = '';var _timeout = 5000;//ajax超时设置
if(sessionStorage.getItem('pf_id_bool')&&sessionStorage.getItem('pf_id')){
    _pf_id = sessionStorage.getItem('pf_id');
    getDetails();
}

function getDetails(){
    if(!_pf_id)return false;
    $.ajax({
        type:"get",
        url:server_url+'/plat/api/platform/parentlist.json',
        dataType:'json',
        data:{
            "id":_pf_id
        },
        timeout:_timeout,
        success:function(res){
            console.dir(res.data);
            if(res.message!='查询成功'){
                returnMessage(5,'查询失败。');
                return false;
            }
            $('.msg').addClass('undis');
            var item = res.data;
            var _date = new Date(item.begin).toLocaleString();
            $('#id').val(item.id);//上级单位ID
            $('#name').val(item.name);//上级单位名称
            $('#version').val(item.extension.versionCode);//上级平台版本号
            $('#location').val(item.extension.locationId);//上级平台部署位置
            $('#unit').val(item.extension.orgName);//上级平台所属单位
            $('#begin').val(_date);//上级平台创建时间
            $('#desc').val(item.desc);//上级平台描述
        },
        error:function(res){
            console.log(res);
            returnMessage(5,'获取上级平台数据失败，请稍后重试！');
            $('.msg').addClass('undis');
        }
    });
}