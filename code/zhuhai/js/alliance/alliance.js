var title="工会";
$("nav>div").click(function(){
    $("nav p.active").removeClass("active");
    var text=$(this).attr("class");
    title=text=="labor"?"工会":text=="youth"?"共青团组织":"妇委会组织";
    $("nav div."+text+" p").addClass("active");
    $(".page>.head").addClass("hide");
    $(".page>.head."+text+"").removeClass("hide");
    $(".page>.content").addClass("hide");
    $(".page>.content."+text+"").removeClass("hide");
});
$("footer>a").click(function(){
    sessionStorage.setItem("edie_title",title);
});