var mySwiper = new Swiper('.swiper-container',{
    slidesPerView : 3.8,
    spaceBetween : 8,
})
$("#head").click(function(){
    $(this).attr("href","branchZone.html");
});
function like_href(_this,text){
    sessionStorage.setItem("like_star",text);
    $(_this).attr("href",'../ledger_list/ledger.html');
}