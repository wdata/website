


//获取当前用户的权限  
var auth_sum=sessionStorage.getItem('authority');
var auth_0=authMethod("/llt/click/rent/showModel/rentorwanted");			//显示出租/求租
	auth_1=authMethod("/llt/click/rent/showModel/bespeakoradd");			//显示预约/发布
	auth_2=authMethod("/llt/click/rent/showModel/click/assignorno");  			//预约显示状态_未分配/已分配
	auth_3=authMethod("/llt/click/rent/showModel/click/handleorno");			//预约显示状态_未处理/已处理
	auth_4=authMethod("/llt/click/rent/showModel/bespeak/distribute");			//分配接待
	auth_5=authMethod("/llt/click/rent/showModel/bespeak/remind");			//提醒
	auth_6=authMethod("/llt/click/rent/showModel/bespeak/recept");			//接待
    //因权限而对页面显示控制
    if(auth_1){
    	$('.rent-tab .top .top-r1').show().siblings().hide();
    }else{
    	$('.rent-tab .top .top-r2').show().siblings().hide();
    }
    if(auth_2){
    	$('.rent-tab .bot .inner-r1').show().siblings().hide();
    }else if(auth_4){
    	$('.rent-tab .bot .inner-r2').show().siblings().hide();
    }


$(document).ready(function(){
    rentInit();
});


//出租和求租
var rent = new Object({
	page:1,
	size:10,	
	genre:1,		 //类型默认 1 ：综合； 2 ：最新； 3 ：最近
	type:1,			 // 类型：1: 出租， 2: 求租
	searchType:"",   //搜索类型 1 ：标题 2 ：发布人： 3 ：租金 4 ：距离 5: 预约人
	keyword:"",
	isHaveNextPage:true
});
rent.getList = function(elem,me){
	var _this=this;
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rents/search.json",
		dataType:'json',
		data:{
			'type':_this.type,'page':_this.page,'size':_this.size,'genre':_this.genre,'searchType':_this.searchType,'keyword':_this.keyword
		},
		success:function(data){
			var code="";
			if(!data.data || data.code!=0) {
                $(elem).html(code); 
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
                me.resetload();
                return false; 
            }
			$.each(data.data.items,function(index,item){
                var imgCode="",botCode="";
                if(item.images.length>1){
                    for(var i=0;i<item.images.length;i++){
                        imgCode+=`
                                <div class="pic-w fl">
                                    <img src="${server_url_img+item.images[i].url}" alt=""  onerror="defaultP(this)">
                                </div>
                            `;
                    }
                    botCode=`<div class="bot">`+imgCode+`</div>`
                }
                var txCode=item.user.photo?server_uel_user_img+item.user.photo:default_tx;
				code+=`
					<div class="list all-rent" data-id=${item.id}>
                        <a class="p24" href="rent_detail.html" onclick="link('${item.id}',${_this.type})">
                            <div class="top">
                                <div class="t-l fl">
									<span class="tx" data-id=${item.user.id}><img src="${txCode}" alt=""></span>
                                    <div class="txt">
                                        <div class="tit">${item.user.name}</div>
                                        <div class="time">${item.createTime}</div>
                                    </div>
                                </div>
                                <div class="t-r fr">
                                    距离距离
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="mid">
                                <div class="word overhide">
                                    ${item.title}
                                </div>
                                <div class="tips price">${item.price}/月</div>    
                            </div>
                            ${botCode}
                        </a>
                    </div>
				`	
			})
			$(elem).append(code);
            _this.page++;
            if(data.data.pageNum*data.data.pageSize >= data.data.totalCount){
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
            }
            me.resetload();    //数据加载完重置
        },
        error:function(data){
            me.noData();      
            me.resetload();    
        }
	})
}
rent.reloadList = function(){
    $('.rent-list-con').html(' ');
    rent.page=1;
    dropload.unlock();
    dropload.noData(false);
    dropload.resetload();
}

//下拉刷新效果
var i=0;
var cur_ob=rent;     //当前列表
var conIndex=1;
var serIndex=1;
var sdropload,dropload;      //搜索下拉


//预约
var order=new Object({
	page:1,
	size:5,
	userId:userId,
	status:0,          //状态， 0: 未， 1: 已
	keyword:null,
    searchType:null,
    state:auth_2?0:1,        //0：分配     1：处理
    curId:null              //当前要操作的预约id
})
order.getList = function(elem,me){
    var _this=this;
    $.ajax({
        type:'get',
        url:server_rent+server_v1+"/rentBespeaks/list.json",
        dataType:'json',
        data:{
            'page':_this.page,'size':_this.size,'userId':_this.userId,'status':_this.status,'keyword':_this.keyword,'searchType':_this.searchType
        },
        success:function(data){
            var code="";
            if(data.code!=0 || !data.data ) { 
                $(elem).html(code); 
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
                me.resetload();
                return false; 
            }
            console.info(order.status+","+order.state);
            if(_this.status==0){
                $.each(data.data.items,function(index,item){
                    var txCode=item.beseakUser.photo?server_uel_user_img+item.beseakUser.photo:default_tx;
                    var imgCode=item.imageUrl?item.imageUrl:default_img;
                    var diffCode;
                    if(_this.state==1){               //未分配   可以分配接待
                        diffCode=`
                            <div class="hr-48"></div>
                            <div class="order-area">
                                <div class="mask"></div>
                                <button class="abs" onclick="order.assignLink('${item.id}')">分配接待</button>
                                <img src="${imgCode}" alt="" class="full">
                            </div>
                        `;
                    }else{
                        diffCode=`
                            <div class="oper">
                                <button class="btn" onclick="order.remind('${item.id}')">提醒</button>
                                <button class="btn" onclick="order.tranShow('${item.id}')">接待</button>
                            </div>
                            <a href="order_detail.html" onclick="deposited('order_id',${item.rentId})">
                                <img src="${imgCode}" alt=""  onerror="defaultP(this)">
                            </a>
                        `;
                    }
                    code+=`
                         <div class="item rent-reservation">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${txCode}" alt=""></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html" onclick="deposited('order_id',${item.rentId})">
                                        <div class="mid mm">
                                            <p class="line2">${item.rentTitle}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                            <div class="tips overhide mm">接待者：${item.receptUser.name}</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    ${diffCode}
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    `;
                })
            }else{
                $.each(data.data.items,function(index,item){
                    var txCode=item.beseakUser.photo?server_uel_user_img+item.beseakUser.photo:default_tx;
                    var resCode="";
                    if(_this.state==1){           //已处理 有接待结果
                        resCode=`<div class="tips overhide">接待者：${item.receptUser.name}|&nbsp;结果：${item.receptUser.result}</div>`;
                    }
                    code+=`
                        <div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${default_tx}" alt=""></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html" onclick="deposited('order_id',${item.id})">
                                        <div class="mid">
                                            <p class="line2">${item.rentTitle+"1"}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                            <div>接待人：${item.receptUser.name}</div>
                                            ${resCode}
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    <div class="hr-48"></div>
                                    <div class="order-area" onclick="tranShow()">
                                        <button class="abs">分配接待</button>
                                        <img src="${server_url_img+item.imageUrl}" alt="">
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    `
                })
            }   
            $(elem).append(code);
            _this.page++;
            if(data.data.pageNum*data.data.pageSize >= data.data.totalCount){
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
            }
            me.resetload();    //数据加载完重置
        },
        error:function(data){
        }
    })        
}
//提醒
order.remind = function(id){
    $.ajax({
        type:'post',
        url:server_rent+server_v1+"/rentBespeaks/remind/"+id+".json",
        dataType:'json',
        success:function(data){
            if(data.code==0){
                showMask('提醒成功！');
            }else{
                showMask('提醒失败！');
            }
        },
        error:function(){
            showMask('提醒失败！');
        }
    })
}
//分配接待
order.assignLink = function(id){
    /*sessionStorage.setItem('aorder_ob',{'id':id,'isOrder':true});*/
    window.location.href="rent_assign.html?id="+id;
    
}
order.tranShow = function(id){
    tranShow(4);
    this.curId=id;
}
//写接待结果
order.recept = function(){
    var _this=this;
    $.ajax({
        type:'post',
        url:server_rent+server_v1+"/rentBespeaks/recept.json",
        dataType:'json',
        data:{
            'bespeakId':this.curId,
            'content':$('.reasult-box textarea').val()
        },
        success:function(data){
            if(data.code==0){
                showMask('提交接待成功！');
                setTimeout(function(){
                    closeMask();
                    returnTran();
                    _this.reloadList();  
                },1000)
            }else{
                showMask('提交接待失败！');
            }
        },
        error:function(){
            showMask('提交接待失败！');
        }
    })
}
order.init = function(){
    var _this=this;
    $('.recept-oper').click(function(){
        _this.recept();
    })
}
order.reloadList = function(){
    $('.rent-list-con').html(' ');
    order.page=1;
    dropload.unlock();
    dropload.noData(false);
    dropload.resetload();
}
order.init();
//我的出租\求租列表
var myrent=new Object({
	page:1,
	size:10,
	userId:userId,
	type:1,
    keyword:null
});
myrent.getList = function(elem,me){
    var _this=this;
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rents/user/"+this.userId+"/"+this.type+".json",
		dataType:'json',
		data:{
			'page':this.page,'size':this.size,'keyword':_this.keyword
		},
		success:function(data){
			var code="";
			if(data.code!=0 || !data.data ) { 
                $(elem).html(code); 
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
                me.resetload();
                return false; 
            }
			$.each(data.data.items,function(index,item){
                var imgCode="",statue = '';
                if(item.images.length>=1){
                    for(var i=0;i<item.images.length;i++){
                        imgCode+= ' <div class="pic-w fl"> <img src="'+ server_url_img+item.images[i].url +'" alt=""  onerror="defaultP(this)"> </div>'
                    }
                };
                // 状态：0正常,1下架
                if(item.status === 2 || item.status === 1){
                    statue = "上架";
                }else if(item.status === 0){
                    statue = "下架";
                }
                var botCode= '<div class="bot">'+ imgCode +'</div>';
				code += '<div class="list" data-id="'+ item.id +'"> ' +
                    '<a class="p24" href="rent_detail.html"  onclick="link('+ item.id +','+ _this.type +')"><div class="mid"> ' +
                '<div class="word overhide">'+ item.title +' ' +
                '</div> <div class="tips price">'+ item.price + item.unit +'<span class="fr c666">发布于'+ item.createTime +'</span></div> </div>'+ botCode +'' +
                    '</a> ' +
                    '<div class="oper-bot"> ' +
                    '<button onclick="myrent.refresh('+ item.id +')" class="btn">刷新</button> ' +
                    '<a class="btn" href="rent_edit.html" onclick="mlink('+ item.id +','+ _this.type +','+ item.status +')">修改</a> ' +
                '<button onclick="myrent.changeStatus('+ item.id +','+ item.status +')" class="btn">'+ statue +'</button> ' +
                '<button onclick="myrent.del(('+ item.id +','+ item.status +')" class="btn">删除</button> ' +
                '</div> ' +
                '</div>'
			});
			$(elem).append(code);
            _this.page++;
            if(data.data.pageNum*data.data.pageSize >= data.data.totalCount){
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
            }
            me.resetload();    //数据加载完重置
		}
	})
};
//刷新
myrent.refresh = function(id){
    var _this=this;
    $.ajax({
        type:'post',
        url:server_rent+server_v1+'/rents/refresh/'+this.userId+'/'+id+'.json',
        dataType:'json',
        success:function(res){
           $('.rent-list-con').html(' ');
            myrent.page=1;
            dropload.unlock();
            dropload.noData(false);
            dropload.resetload();
        }
    })
}
//上下架
myrent.changeStatus = function(id,status){
    var c_status = null;

    if(status === 2 || status === 1){
        c_status = 0;
    }else if(status === 0){
        c_status = 1;
    }

    $.ajax({
        type:'post',
        url:server_rent+server_v1+'/rents/shelfStatus/'+this.userId+'/'+id+'/'+c_status+'.json',
        dataType:'json',
        success:function(res){
            $('.rent-list-con').html(' ');
            myrent.page=1;
            dropload.unlock();
            dropload.noData(false);
            dropload.resetload();
        }
   })
}
//删除
myrent.del = function(id,status){
    var _this=this;
    if(status === 0) { showMask('该商品还未下架，不能进行删除！'); return false; }

    confirm("是否删除该商品！",function(){
        $.ajax({
            type:'post',
            url:server_rent+server_v1+'/rents/delete/'+this.userId+'/'+id+'.json',
            dataType:'json',
            success:function(res){
                $('.rent-list-con').html(' ');
                myrent.page=1;
                dropload.unlock();
                dropload.noData(false);
                dropload.resetload();
            }
        })
    });
};
myrent.reloadList = function(){
    $('.rent-list-con').html(' ');
    myrent.page=1;
    dropload.unlock();
    dropload.noData(false);
    dropload.resetload();
}



//发布
var issue=new Object({
    isShow:false,
    type:1,                     //1出租   2求租
    userId:userId,
    acreage:null,
    price:null,
    picId:null,
    repeat:true
});
issue.show = function(){
    if(this.isShow){
        $('.rent-list-con').hide();
        $('.issue').show();
    }else{
        $('.rent-list-con').show();
        $('.issue').hide();
    }
};
issue.scroll = function(){
    var _this=this;
    $('.mainCon-wrap').scroll(function(){
        if(!_this.isShow) return false;
        if($('.issue-editbox').offset().top<=$('.top-search').height()-10){
            $('.rent-box').removeClass('transy');
            $('.sBox-wrapper').addClass('z0');
            $('.issue-editbox').addClass('on');
        }
    })
};
issue.add = function(){
    var _this = this;
    var p=$('.diff-orent .unit-choosed').html();
    var q=$('.diff-irent .unit-choosed').html();
    var unit = this.type===1?q:p;
    //  wxImg.urls  /api/v1/rents/save.json
    /*alert(wxImg.urls);*/
    var picUrl=[];
    $.each(wxImg.fileData,function(index,item){
        picUrl.push(item.url)
    });

    if(!_this.repeat){
        return;
    }
    _this.repeat = false;
    $.ajax({
        type:'post',
        url:server_rent + server_v1+'/rents/save.json',
        dataType:'json',
        traditional: true,  
        data:{
            'type':this.type,
            'userId':this.userId,
            'urls':picUrl,
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
        success:function(data){
            if(data.code===0){
                // closeMask();
                // clearForm('#rent_form');

                // 修改rentTop为3可显示在发布，修改rentBot可显示在我的出租还是我的求组；
                deposited("rentTop",3);
                deposited("rentBot",_this.type);
                history.go(0);
            }else{
                showMask(data.message);
                _this.repeat = true;
            }
        },
        beforeSend:function(){
            showMask("正在发布!");
        },
        error: function (data) {
            _this.repeat = true;
        }
    })
};
issue.tranBack = function(){
     $('.p-layout').css('transform','translateX(0)');
};
issue.event = function(){
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
    })
    //选择单位
    $('.unit-con ul li').tap(function(){
        if(_this.type==1){
           $('.diff-irent .unit-choosed').html($(this).html()) 
        }else{
           $('.diff-orent .unit-choosed').html($(this).html())  
        }
        _this.tranBack();
    })
    //输入描述
    $('.desc-con textarea').focus(function(){
        if($(this).val()){
            $('#desc_oper').show();
        }
    })
    $('#desc_oper').tap(function(){
        $('.elem-08').val($('.desc-con textarea').val());
        _this.tranBack();
    });
    //出租、求租切换
    $('.oper-btn .btn').tap(function(){
        _this.type=$(this).index()+1;
        if($(this).index()==0){
            $('.diff-orent').hide();
            $('.diff-irent').show();
        }else{
            $('.diff-orent').show();
            $('.diff-irent').hide();
        }
        $(this).addClass('on').siblings().removeClass('on');
    })
    // 朝向
    $(".fell .check-wrap").tap(function(){
       $(this).siblings().find("input").prop("checked",false);
    });
    //提交  
    $(document).on("click",'.submit-btn',function(){
        _this.acreage=($('.diff-orent .elem-04').val())?$('.diff-orent .elem-04').val():$('.diff-irent .elem-04').val();
        var m=$('.diff-orent .elem-05').val();
        var n=$('.diff-irent .elem-05').val();
        _this.price=(m)?m:n;
        var mobile = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|1349[0-9]{7}|17[0123456789][0-9]{8})$/;
        var phone = $('.elem-10').val();
        //if(_this.type==1 && wxImg.urls.length<=0)                                       { showMask('请至少上传一张图片！'); return false; }
        //if(!$('#addressList li.active').data('id'))                                     { showMask('请选择区域！'); return false; }
        if(!_this.acreage)                                                              { showMask('请填写面积！'); return false; }
        if(!_this.price)                                                                { showMask('请填写租金！'); return false; }
        if(!$('.elem-06').val())                                                        { showMask('请填写类型！'); return false; }
        if(!($('.elem-07').val().length>=8 && $('.elem-07').val().length<=18))          { showMask('请填写标题，且在8-28个字之间！'); return false; }
        if(!$('.elem-08').val().length>=10)                                             { showMask('请填写描述！'); return false; }
        if(!$('.elem-09').val().length>=2)                                              { showMask('请填写联系人，且至少2字！'); return false; }
        if(!$('.elem-10').val())                                                        { showMask('请填写手机号！'); return false; }
        if(!(phone.length === 11 && mobile.test(phone)))                                           { showMask('手机号格式错误！'); return false; }
        if($('.elem-02').val()){
            if(!($('.elem-02').val().length>=2 && $('.elem-07').val().length<=30))      { showMask('所填写楼盘字数应为2-30个字'); return false; }
        }
        if($('.elem-03').val()){
            if(!($('.elem-03').val().length>=2 && $('.elem-03').val().length<=12))      { showMask('所填写地段字数应为2-12个字'); return false; }
        }
        _this.add();
    })
};
issue.init = function(){
    this.show();
    this.scroll();
    this.event();
};


$('#search_btn').on("input porpertychange",function(){
	if($('#search_btn').val()){
		$('.search-main').css('transform','translateX(-'+ww+'px)');	
        $('.top-search').addClass('active');
	}else{
		$('.search-main').css('transform','translateX(0)');
        $('.top-search').removeClass('active');
        return false;
	}
    if(i==0){
        sdropload = $('.serCon-wrap').dropload({
                scrollArea : $(".serCon-wrap"),
                autoLoad:true,
                loadDownFn:function(me){
                    switch(serIndex){
                        case 3:
                            myrent.getList('#searchCon',me);
                            break;
                        case 2:
                            order.getList('#searchCon',me);
                            break;
                        default:
                            rent.getList('#searchCon',me);
                            break;
                    }
                    
                }
        })
    }
    i++;
	var tIndex=$('.rent-tab .top .list.active').index();
	var bIndex=$('.rent-tab .bot .list.active').index();
	var _val=$('#search_btn').val();
	var _type=$('.search-main .list-con .list.active').index()>0?$('.search-main .list-con .list.active').index():' ';
	switch(tIndex){
        case 3:
            myrent.keyword=$('#search_btn').val();
            serIndex=3;
            myrent.page=1;
            sdropload.unlock();
            sdropload.noData(false);
            sdropload.resetload();
            break; 
		case 2:
            order.keyword=$('#search_btn').val();
            order.searchType=_type+1;
            serIndex=2;
            order.page=1;
            sdropload.unlock();
            sdropload.noData(false);
            sdropload.resetload();
            break;
		default:
			rent.keyword=$('#search_btn').val();
			rent.searchType=_type+1;
            serIndex=1;
            rent.page=1;
            sdropload.unlock();
            sdropload.noData(false);
            sdropload.resetload();
			break;
	}
})

$('.rent-tab .top .list').tap(function(){
	if($(this).hasClass('active')) return false;
	$(this).addClass('active').siblings().removeClass('active');
	var tIndex=$(this).index();
	$('.mainCon-wrap').scrollTop('0px');
	$('.rent-tab .bot .inner').eq(tIndex).show().siblings().hide();
	$('.search-main .list-con .inner').eq(tIndex).show().siblings().hide();
    $('.rent-tab .bot .inner').eq(tIndex).find(".list").eq(0).addClass("active").siblings().removeClass("active");

    deposited("rentTop",tIndex); // 根据所点击的导航，刷新时重新显示该导航；
    conIndex=tIndex;

	switch(tIndex){
		case 2:
			cur_ob=order;
			$('.rent-list-con').show();
			$('.issue').hide();
            order.reloadList();
			break;
		case 3:
            issue.isShow=true;
            issue.init();
			break;
		default:
			cur_ob=rent;
			$('.rent-list-con').show();
			$('.issue').hide();
			rent.type=tIndex+1;
            rent.reloadList();
	}
});

$('.rent-tab .bot .list').tap(function(){
	if($(this).hasClass('active')) return false;
	$(this).addClass('active').siblings().removeClass('active');
	var bIndex=$(this).index();
	var tIndex=$('.rent-tab .top .list.active').index();

    deposited("rentBot",bIndex); // 根据所点击的导航，刷新时重新显示该导航；

    switch(tIndex){
		case 2:
			order.status=bIndex;
            order.reloadList();
			break;
		case 3:
			switch(bIndex){
				case 0:
					issue.isShow=true;
					issue.init();
					break;
				default:
					issue.isShow=false;
					issue.init();
                    myrent.type=bIndex;
                    myrent.reloadList();
					break;
			}
			break;
		default:
			rent.genre=bIndex+1;
			rent.type=tIndex+1;
            rent.reloadList();
			break;
	}
})



//我要出租/我要求租返回列表页
function returnList(){
	$('.issue-editbox,.sBox-wrapper').removeClass('on z0');
	$('.rent-box').addClass('transy');
}

function link(id,type){
    deposited("rent_id",id);
    deposited("rent_type",type);

}
function mlink(id,type,status){
    var elem=JSON.stringify({'id':id,'type':type,'status':status});
    sessionStorage.setItem('rent_modify',elem);
}

//点击关键字后
$('.sBox-wrapper .list-con .list').tap(function(){
    $(this).addClass('active').siblings().removeClass('active');
    $('#search_btn').attr('placeholder',$(this).text());
    $('.search-main').css('transform','translateX(-'+ww+'px)'); 
    $('.sBox-wrapper .top-search').addClass('active')
    $('#searchCon').html(' ');
})
//取消回到列表页
$('.sBox-wrapper .cancel').tap(function(){
    $('.search-main').css('transform','translateX(0)'); 
    $('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');
    $('#search_btn').attr('placeholder','搜索').val('');
    rent.searchType=null;
    rent.keyword=null;
    rent.genre=1;
})

$('.reasult-editer').focus(function(){
    $('.placeholder').remove();
})
$('.reasult-editer').blur(function(){
    if($.trim($(this).val()).length<=0){
        $('.reasult-box').append(`<div class="placeholder">请填写接待结果<span>(30个字以内)</span></div>`);
    }
})

//根据url的show参数来确定初始化哪个tab
var j=0;
function rentInit(){
    // 当没有数据是，显示为0；
    var rentTop = obtain("rentTop")?obtain("rentTop"):0;
    var rentBot = obtain("rentBot")?obtain("rentBot"):0;
    // 修改样式；
    $('.rent-tab .top .list').eq(rentTop).addClass('active').siblings().removeClass('active');
    $('.rent-tab .bot .inner').eq(rentTop).show().siblings().hide();
    $('.rent-tab .bot .inner').eq(rentTop).find(".list").eq(rentBot).addClass("active").siblings().removeClass("active");

    conIndex= rentTop;
    if(rentTop<=1){                   //出租求租情况下
        rent.type = rentTop + 1;   // 出租和求组
        rent.genre = rentBot + 1;  // 综合，最新，最近
        rent.status = rentBot;
    }
    if(rentTop === 2){
        order.status = rentBot;
    }
    if(rentTop === 3){
        myrent.type = rentBot;  // 我的出租和我的求组
    }
    if(j==0){
        dropload= $('.mainCon-wrap').dropload({
            scrollArea : $(".mainCon-wrap"),
            autoLoad:true,
            loadDownFn:function(me){
                switch(conIndex){
                    case 0:
                        console.log("0");
                        rent.getList('.rent-list-con',me);
                        break;
                    case 1:
                        console.log("1");
                        rent.getList('.rent-list-con',me);
                        break;
                    case 2:
                        console.log("2");
                        order.getList('.rent-list-con',me);
                        break;
                    case 3:
                        console.log("3");
                        myrent.getList('.rent-list-con',me);
                        break;
                }
            }
        })
    }
    j++;
    switch(rentTop){
        case 2:
            conIndex = rentTop;
            // order.reloadList();
            break;
        case 3:
            if(rentTop === 3 && rentBot >= 1){
                issue.isShow=false;
            }else{
                issue.isShow=true;
            }
            issue.init();
            break;
        default:
            break;
    }
}
