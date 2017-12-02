$(document).ready(function(){
    //获取企业的下拉框
    company(function(data){
        if(data.code==200){
                var options='<option value="">全部</option>';
                $.each(data.data.company,function(index,item){
                    options+='<option value="'+item.id+'">'+item.companyName+'</option>';
                });
                $("#firm").html(options);
            var companyId=sessionStorage.getItem("companyID");
            if(companyId){
                $("#firm").val(companyId);
            }
        }else{
            returnMessage(2,data.message);
        }
    });
    /*$(".cut_map").click(function(){
        var isShow= $("#map_frame").attr("src").indexOf("viewport");
        if(isShow==-1){
            $("#map_frame").attr("src","viewport.html");
        }else{
            $("#map_frame").attr("src","map.html");
        }
    });*/
});
function companyID(_this){
    session("companyID",$($(_this)[0]).val());
    $("#map_frame").attr("src","map.html");
    $("#map_frame_2").attr("src","viewport.html");
}
function isShow(_this){
    if($("#map_frame").attr("src").indexOf("house")!=-1){
        $("#map_frame").attr("src","floor.html");
    }else if($("#map_frame").attr("src").indexOf("floor")!=-1){
        $("#map_frame").attr("src","map.html");
            $(_this).hide();
    }else if($("#map_frame").attr("src").indexOf("location")!=-1){
        $("#map_frame").attr("src","map.html");
        $(_this).hide();
    }else{
        $(_this).hide();
    }
    //var isHidden= $("#map_frame").attr("src").indexOf("map");
    //if(isHidden==-1) {
    //    history.go(-1);
    //}else{
    //    $(_this).hide();
    //}
}