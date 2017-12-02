// 支部堡垒空空间
// 所有成员
var nav_list=new Swiper('.nav_list',{
    slidesPerView : 5.2,
    spaceBetween : 10
});
// 最新台账
var ledger_list = new Swiper('.ledger_list',{
    slidesPerView : 3.8,
    spaceBetween : 4
});

// 轨迹
var container = new Swiper('.grow-container',{
    prevButton:'.swiper-button-prev',
    nextButton:'.swiper-button-next',
});
// 台账模板
var ledger_template = new Swiper('.ledger_template',{
    slidesPerView : 3.8,
    spaceBetween : 4
});