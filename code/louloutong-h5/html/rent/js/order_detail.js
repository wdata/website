var auth_sum=sessionStorage.getItem('authority');
var auth_2=false;  			                  //预约显示状态_未分配/已分配 
if(auth_sum.indexOf('/llt/click/rent/showModel/click/assignorno')>0) 		auth_2=true;

function dayTran(date){
	if(date){
		return date.substring(2,9).replace('-','/').replace('-','/');
	}else{
		return null;
	}
}
	
function hourTran(date){
	if(date){
		return date.substring(11,date.length);
	}else{
		return null;
	}
}



$.ajax({
	type:'get',
	url:server_url+server_v1+'/rents/bespeak/'+ obtain("order_id") +'.json',
	dataType:'json',
	success:function(res){
		if(res.code===0 && res.data){
            var imgCode="";
            if(res.data.images.length>1){
                for(var i=0;i<res.data.images.length;i++){
                    imgCode+=`
                            <div class="pic-w fl">
                                <img src="${server_url_img+res.data.images[i].url}" alt="">
                            </div>
                        `;
                }
            }
            var tCode=`
            	<div class="list noborder">
                    <div class="p24" >
                        <div class="top">
                            <div class="t-l fl">
                                <span class="tx"><img src="${imgDefault(res.data.user.photo,default_tx)}" alt="" class="full"></span>
                                <div class="txt">
                                    <div class="tit" >${res.data.user.name}</div>
                                    <div class="time">${res.data.createTime}</div>
                                </div>
                            </div>
                            <div class="t-r fr">
                                <button class="off-btn">下架了</button>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <a href="rent_detail.html" onclick="deposited('rent_id',${res.data.id})">
                            <div class="mid">
                                <div class="word overhide">
                                   ${nullCheck(res.data.title)}
                                </div>
                                <div class="price">${res.data.price+res.data.unit}</div>    
                            </div>
                            <div class="bot">
                                ${imgCode}
                                <div class="clear"></div>
                            </div>    
                        </a>
                    </div>
                </div>
            	`;
           	$('.rent-list-con').html(tCode);
           	var beCode="";
           	if(res.data.rentBespeaks){
	           	$.each(res.data.rentBespeaks,function(index,item){
	           		var tipsCode="",operCode="",resCode="";
	           		if(auth_2){
	           			operCode=`<button>分配接待</button><br>`;
	           			tipsCode=`
	           				<div class="tips tips01">
	                            <div class="tip">
	                                <span>预约日期</span>
	                                <div>${dayTran(item.bespeakTime)}</div>
	                            </div>
	                            <div class="tip">
	                                <span>预约时间</span>
	                                <div>${hourTran(item.bespeakTime)}</div>
	                            </div>
	                            <div class="clear"></div>
	                        </div>
	           				`;
	           		}else{
	           			operCode=`<button>提醒</button><br>`;
		           		tipsCode=`
	           				<div class="tips ">
	                            <div class="tip">
	                                <span>预约日期</span>
	                                <div>${dayTran(item.bespeakTime)}</div>
	                            </div>
	                            <div class="tip">
	                                <span>预约时间</span>
	                                <div>${hourTran(item.bespeakTime)}</div>
	                            </div>
	                            <div class="tip">
	                                <span>接待人员</span>
	                                <div>
	                                   <img src="${imgDefault(item.receptUser.photo,default_tx)}" alt=""> 
	                                   <span class="cblue">${item.receptUser.name}</span>
	                                </div>
	                            </div>
	                            <div class="clear"></div>
	                        </div>
	           				`;
	           		}
	           		if(item.result){
	           			resCode=`
	           				<div class="bot">
		                       <i class="icon icon-resault"></i> 
		                      	${nullCheck(item.result)}
		                    </div>
	           				`;
	           		}
	           		beCode+=`
	           				<div class="item">
			                    <div class="inner">
			                        <div class="t-l fl">
			                            <div class="tx">
			                                <img src="${imgDefault(item.beseakUser.photo,default_tx)}" alt="">
			                                ${item.beseakUser.name}
			                            </div>
			                            ${tipsCode}
			                        </div>
			                        <div class="bgline fl"></div>
			                        <div class="t-r fr">
			                            <div class="inner">
			                                ${operCode}
			                                <a href="to:13123568956">
			                                    <i class="icon icon-phone"></i>
			                                    <div>${item.beseakUser.phone}</div>
			                                </a>
			                            </div>
			                        </div>
			                        <div class="clear"></div>
			                    </div>
			                    ${resCode}
			                </div>
		           			`;	
	           	})
	           	$('.order-item-con').html(`<div class="tit">预约看房</div>`+beCode);	
           	}
           	
			
          


		}
	}
})















