var mySwiper = new Swiper('.swiper-container',{
    slidesPerView : 5.2,
    spaceBetween : 10,
});
$("#head").click(function(){
    $(this).attr("href","leaderZone.html");
});
function like_href(_this,text){
    sessionStorage.setItem("like_star",text);
    $(_this).attr("href",'../ledger_list/ledger.html');
}