var rent_modify=JSON.parse(sessionStorage.getItem('rent_modify'));

if(rent_modify.type===1){
	$('.diff-orent').hide();
    $('.diff-irent').show();
}else{
    $('.diff-orent').show();
    $('.diff-irent').hide();
}



$.ajax({
    type:'get',
    url:server_url + server_v1 + '/rents/'+ rent_modify.id + '.json',
    dataType:'json',
    success:function(data){
        if(data.code === 0){
            $(".elem-02").val(data.data.community); // 楼盘
            $(".elem-03").val(data.data.section); // 地段
            $(".elem-04").val(data.data.acreage); // 面积
            $(".elem-05").val(data.data.price); // 价格
            $(".elem-06").val(data.data.houseType); // 类型
            $('.elem-07').val(data.data.title);  // 标题
            $(".elem-08").val(data.data.content); // 描述
            $(".desc-con textarea").text(data.data.content);  // 描述
            $(".elem-09").val(data.data.contacter); // 联系人
            $(".elem-10").val(data.data.phone); //联系电话
            // 朝向;
            $.each($(".elem-11 input"),function(index,val){
                if($(val).siblings("label").text() === data.data.direction){
                    $(val).attr("checked",'true');
                }
            });
            // 交通;
            $.each($(".elem-12 input"),function(index,val){
                if($(val).siblings("label").text() === data.data.traffic){
                    $(val).attr("checked",'true');
                }
            });
            // 配套设施;
            $.each($(".elem-13 input"),function(index,val){
                if($(val).siblings("label").text() === data.data.matingFacility){
                    $(val).attr("checked",'true');
                }
            });
            // 图片；
            var codeData = "";
            $(".img-wrap img").attr("src",data.data.images[0].url);
            $("#pic_num").text(data.data.images.length);
            $.each(data.data.images,function(index,val){
                wxImg.fileData.push({'num':index,'url':val.unDomainUrl});
                codeData += '<div class="img-list"> <img src="'+ val.url +'" alt=""  onerror="defaultP(this)"> <i data-name="'+ val.unDomainUrl +'" class="icon icon-del delete-icon"></i> </div> ';
            });
            $('.pic-wrap .pic-con .list-con').append(codeData);
        }
    }
});











var modify = new Object({
	id:rent_modify.id, 
    type:rent_modify.type,                     //1出租   2求租
    userId:userId,
    acreage:null,
    price:null,
    propertyId:null,
    imgArr:[]
});
modify.update = function(){
	var p=$('.diff-orent .unit-choosed').html();
    var q=$('.diff-irent .unit-choosed').html();
    var unit = this.type===1?q:p;
    var picUrl = [];
    $.each(wxImg.fileData,function(index,item){
        picUrl.push(item.url)
    });
    console.log(wxImg.fileData,picUrl);
	$.ajax({
		type:'post',
		url:server_rent+server_v1+'/rents/update.json',
		dataType:'json',
		traditional: true,  
		data:{
			'id':this.id,
			'type':this.type,
			'urls':picUrl,
            'userId':this.userId,
            'propertyId':$('#addressList li.active').data('id'),
            'community':$('.elem-02').val(),
            'section':$('.elem-03').val(),
            'acreage':this.acreage,
            'price':this.price,
            'unit':unit,
            'houseType':$('.elem-06').val(),
            'title':$('.elem-07').val(),
            'content':$('.elem-08').val(),
            'contacter':$('.elem-09').val(),
            'phone':$('.elem-10').val(),
            'direction':$(".elem-11 input[type=checkbox]:checked").siblings("label").text(),
            'traffic':$(".elem-12 input[type=checkbox]:checked").siblings("label").text(),
            'matingFacility':$(".elem-13 input[type=checkbox]:checked").siblings("label").text()
		},
		beforeSend:function(data){
            showMask('请求处理中！');
        },
        success:function(data){
            if(data.code === 0){
                closeMask();
                showMask('修改成功！');
                clearForm('#rent_form');
                window.location.href="rent.html";
            }
        }
	})
};
modify.tranBack = function(){
     $('.p-layout').css('transform','translateX(0)');
};
modify.event = function(){
	var _this=this;
    //区域选择
    $('.header-operating').tap(function(){
        var cur_name,li_name;
        li_name=$('#addressList li.active').text();
        if(li_name=="全部"){
            cur_name=$('.switch .nav li.active').prev().text();
        }else{
            cur_name=li_name;
        }
        $('.elem-01').text(cur_name);
        _this.tranBack();
    });
	//选择单位
    $('.unit-con ul li').tap(function(){
        if(_this.type===1){
           $('.diff-irent .unit-choosed').html($(this).html()) 
        }else{
           $('.diff-orent .unit-choosed').html($(this).html())  
        }
        _this.tranBack();
    });
    $('#desc_oper').tap(function(){
        $('.elem-08').val($('.desc-con textarea').val());
        _this.tranBack();
    });
    $(document).on("click",'.submit-btn',function(){
	    _this.acreage = _this.type === 1?$('.diff-irent .elem-04').val():$('.diff-orent .elem-04').val();
	    var m = $('.diff-orent .elem-05').val();
	    var n = $('.diff-irent .elem-05').val();
	    _this.price = _this.type === 1 ? n : m;
        var mobile = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|1349[0-9]{7}|17[0123456789][0-9]{8})$/;
        var phone = $('.elem-10').val();
	    if(!$('#addressList li.active').data('id'))                                     { showMask('请选择区域！'); return false; }
	    if(!_this.acreage)                                                              { showMask('请填写面积！'); return false; }
	    if(!_this.price)                                                                { showMask('请填写租金！'); return false; }
	    if(!$('.elem-06').val())                                                        { showMask('请填写类型！'); return false; }
	    if(!($('.elem-07').val().length>=8 && $('.elem-07').val().length<=18))          { showMask('请填写标题，且在8-28个字之间！'); return false; }
	    if(!$('.elem-08').val().length>=10)                                             { showMask('请填写描述！'); return false; }
	    if(!$('.elem-09').val().length>=2)                                              { showMask('请填写联系人，且至少2字！'); return false; }
	    if(!phone)                                                        { showMask('请填写手机号！'); return false; }
	    if(!(phone.length === 11 && mobile.test(phone)))                                           { showMask('手机号格式错误！'); return false; }
	    if($('.elem-02').val()){
	        if(!($('.elem-02').val().length>=2 && $('.elem-07').val().length<=30))      { showMask('所填写楼盘字数应为2-30个字'); return false; }
	    }
	    if($('.elem-03').val()){
	        if(!($('.elem-03').val().length>=2 && $('.elem-03').val().length<=12))      { showMask('所填写地段字数应为2-12个字'); return false; }
	    }
	    _this.update()
	})
};

modify.event();
