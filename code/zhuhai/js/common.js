//点赞之星、创新之星
//function like_href(_this,text,_id){
//    //sessionStorage.setItem("user-id",_id);
//    //$(_this).attr("href",'../ledger_list/ledger.html');
//}
function like_href(_this,_id,text){
    sessionStorage.setItem("user-id", _id);
    sessionStorage.setItem("like_star_aaa",text);
    $(_this).attr("href",'../ledger_list/ledger.html');
}
//所有台账列表跳转
function ledger_href(_this,text){
    sessionStorage.setItem("all_ledger",text);
    $(_this).attr("href",'../ledger_list/ledger_list.html');
}
//领导表率空间跳转留言板
function change_bg(_this,src,href){
    $(_this).children(".black-img").children("img").attr("src",src);
    setTimeout(function(){
        window.location.href=href;
    },200);
}
//四个指标数组
var branch=['凝聚•支部自觉落实“三会一课”组织生活......','凝聚支部党员干事创业、默默奉献的工作活力','凝聚支部攻坚克难、闯关夺隘、推进党的......','凝聚支部打造党建品牌、挖掘工作亮点、塑......'];
var ground=['坚持党的领导，落实党的理论和路线方针政策','坚持全面从严治党，落实三个六对照法则','坚持民主集中制，确保党的活力与团结','发挥领导核心作用，推进党业融合'];
var member=['带头践行党员宗旨，主动担当，争创佳绩','带头学习提高，坚定理想信念，严肃参加组......','带头服务群众，服务社会，弘扬正气','带头遵纪守法，坚守廉洁自律'];
var leader=['模范执行党的路线方针政策和上级各项决议','模范践行“两学一做”要求，做“四讲四有”党员','模范遵守党的纪律和规矩，做链接从税表率','模范履行岗位职责，提升工作质效'];
//四个指标和台账列表关联函数
function homepage_ind(_this,arr){
    sessionStorage.setItem("one", arr[0]);
    sessionStorage.setItem("two", arr[1]);
    sessionStorage.setItem("three", arr[2]);
    sessionStorage.setItem("four", arr[3]);
    $(_this).attr("href",'../ledger_list/ledger_list_filtrate.html');
}