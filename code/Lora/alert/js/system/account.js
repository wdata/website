/**
 * Created by Administrator on 2017/7/5.
 */
//弹出框取消隐藏
function hideForm(_this){
    $(_this).parents("form").addClass("hide");
    $("#detail_modal").removeClass("show");
}
function add(){
    $("#detail_modal").addClass("show");
    $("#addForm").removeClass("hide");
}