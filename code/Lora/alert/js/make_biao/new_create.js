/**
 * Created by Administrator on 2017/6/29.
 */
function addSave(){
    var companyName= $("#companyName").val();
    var contact= $("#contact").val();
    var telNumber= $("#telNumber").val();
    var email= $("#email").val();
    var area= $("#province1").val() + " " + $("#city1").val() + " " + $("#district1").val() + " " + $(".L_fill_value1").val() + " " ;
    var address= $("#address").val();
    var deviceType= $("#deviceType").val();
    $.ajax({
        type: "POST",
        url: server_url + '/web/managementCtr/saveManagementInfo',
        data:{
                                                    //账号
            "company.companyName":companyName,  //服务单位名称
            "company.contact":contact,           //联系人
            "company.telNumber":telNumber,       //联系号码
            "company.email":email,                  //邮箱
            // "company.area":area,                  //企业地址
            "company.address":area +" "+ address,            //企业详细地址 + 企业地址
            "company.deviceType":deviceType,      //设备类型
            "company.companyType":"facilitator",   //单位类型--服务单位
            "company.parentId":5501,   //单位代码
            "company.status":0    //状态
        },
        dataType: 'json',
        success:function(data){
            console.log(data);
        },
        error:function(){}
    })
}