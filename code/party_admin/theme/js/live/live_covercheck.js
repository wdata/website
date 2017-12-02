/*分页点击函数*/
var pageNum=2;  //每页显示数
var flag=true;	//判断字段
function pageListCon(page,size){
	var pageCount,vpage;
	$('#pagination').html(' ');
	$.ajax({
		type:'get',
		url:'/dmb/api/v1/live/coverslist.json',
		dataType:'json',
		data:{'page':page,'size':size,'nickname':$('.input-nickname').val()},
		success:function(data){
			console.info(data.entity);
			var date=new Date(data.entity.items[0].liveTime);
			var code="";
			for(var i=0;i<data.entity.items.length;i++){
				code+=`
					<li class="picture-box">
		                <a href="javascript:;" class="pic-box-content">
		                    <img src=${data.entity.items[i].imgUrl} alt="">
		                    <input type="checkbox" class="pic-checkbox" data-id=${data.entity.items[i].liveId}>
		                    <div class="liv-nickname">
		                        <span class="live-title">${data.entity.items[i].liveName}</span>
		                       	<i class='fa ${data.entity.items[i].liveGender==0?"fa-male":"fa-female"}'></i>
		                    </div>
		                    <p class="live-date">${date.toLocaleString()}</p>
		                </a>
		            </li> 
				`;
			}
			$('#live-pic-list ul').html(code);
			pageCount=data.entity.pageCount;
			vpage=pageCount>10?10:pageCount;
			if(pageCount>1){
				$('.pages').show();
				initPagination('#pagination',pageCount,vpage,page,function(num,type){
					if(type=='change'){
				    	pageListCon(num,pageNum); 
					}
				})
			}else{
				if(flag){
					pageListCon(1,pageNum);	
					flag=false;
					$('.pages').hide();
				}
				
			}
		}
	})
}

/*跳转到第几页*/
function pageTo(_this){
	pageListCon(parseInt($(_this).siblings('input').val()),pageNum)
}

/*页面数据获取*/
pageListCon(1,pageNum)

/*搜索查询*/
$('.search-nickname').click(function(){
	pageListCon(1,pageNum)
})

//提示弹框
function returnMessage(message){
    alertMsg(message,function(dialog){
        dialog.close();
    })
}

/*封面审核*/
function verify(num){
	var idx=[];
	$('.pic-checkbox:checked').each(function(){
		idx.push($(this).attr('data-id'));
	})

	function alertbox(message){
		BootstrapDialog.show({
            'title':"确认提示",
            'message':message,
            buttons:[
                    {
                        label: '确定',
						cssClass: 'btn-success',
						action: function(dialog){
							dialog.close();
							$.ajax({
								type:'post',
								url:'/dmb/api/v1/live/covers/audit.json',
								dataType:'json',
								data:{'reviewStatus':num,'ids':idx.join(',')},
								success:function(data){
									if(data.code==200){
										returnMessage(data.message);
									}
								},
								error:function(data){
									returnMessage('返回数据错误'+data.code)
								}
							})
					}
                    }
                    ,{
                      	label:'取消',
						cssClass:'btn-danger',
						action:function(dialog){
							dialog.close();
						}
                }]
        }); 
	}
	if(idx.length>0){
		if(num){
			alertbox('你确定审核通过该直播封面吗？');
		}else{
			alertbox('你确定审核不通过该直播封面吗？');
		}
	}else{
		returnMessage('请勾选直播封面');
	}
	
	

}


































