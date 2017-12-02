//使用接口判断是否登录
$.ajax({
    type:'get',
    url:ServerId + '/web/loginUser.json',
    dataType: 'json',
    success:function(data){
        if(data.code === 0){
            list(data.data.id);
            $(".name").text(data.data.name);
        }
        if(data.code === -1){
            returnMessage(2,"请先登录！");
            setTimeout(function(){
                window.location.replace("login.html");
            },300);
        }
    },
    error:function(data){
        console.log(data);
        //报错提醒框
        returnMessage(2,'报错：' +  data.status);
    }
});

//退出系统
$(".dropOut").click(function(){
    $.ajax({
        url:ServerId + '/web/logout',
        type:'POST',
        dataType: 'json',
        success:function(data){
            if(data.code === 0){
                window.location.replace("login.html");
            }else{
                returnMessage(2,"退出失败！");
            }
        },
        error: function(msg) {
            returnMessage(2,"报错：" + msg.status);
        }
    });
});

function list(userId){
    $.ajax({
        type:'get',
        url: ServerId +　'/web/userResource.json',
        dateType:'json',
        data:{
            "userId":userId                 // 现在固定是为2
        },
        success:function(e){
            var data = e.data;
            var rootNum=0;
            var code="";
            var sec=[];
            var third=[];
            var fourth=[];
            for(var j=0;j<data.length;j++){
                var secArr=data[j].children;
                var secCode="";
                if(secArr){
                    code+=`
					<li class="first-ul">
                        <a href="javascript:;" class="nav-parent-a nav-toggle" onclick="navToggle(this)">
                            <i class="fa fa-user-md"></i>
                            <span class="nav-label">${data[j].name}</span>
                        </a>
                    </li>
				`;
                    for(var m=0;m<secArr.length;m++){
                        var thirdArr=secArr[m].children;
                        var thirdCode="";
                        if(thirdArr){
                            secCode+=`
                            <li class="sec-ul">
                				<a href="javascript:;" onclick="navToggle(this)">${secArr[m].name}</a>
                			</li>
						`;
                            for(var n=0;n<thirdArr.length;n++){
                                var fourthArr=thirdArr[n].children;
                                var fourthCode="";
                                if(fourthArr){
                                    thirdCode+=`
			                            <li  class="third-ul">
			                				<a href="javascript:;" onclick="navToggle(this)" class="third-ul">${thirdArr[n].name}</a>
			                			</li>
									`;
                                    for(var z=0;z<fourthArr.length;z++){
                                        fourthCode+=`
												<li>
						                            <a href="${fourthArr[z].url}.html" class="J_menuItem">
							                            <i class="fa fa-users"></i>
							                            <strong style="color:white; ;"> ${fourthArr[z].name} </strong>
						                            </a>
						                        </li>
									`

                                    }
                                    fourth.push(fourthCode);
                                }else{
                                    thirdCode+=`
				                            <li>
					                            <a href="${thirdArr[n].url}.html" class="J_menuItem">
						                            <strong style="color:white; ;"> ${thirdArr[n].name} </strong>
					                            </a>
					                        </li>
										`;
                                }
                            }
                            third.push(thirdCode);
                        }else{
                            secCode+=`
                            <li>
                				<a href="${secArr[m].url}.html" class="J_menuItem">${secArr[m].name}</a>
                			</li>
						`;
                        }
                    }
                }else{
                    code+=`
						<li>
	                        <a href="${data[j].url}.html" class="nav-parent-a nav-toggle J_menuItem">
	                            <i class="fa fa-user-md"></i>
	                            <span class="nav-label">${data[j].name}</span>
	                        </a>
                        </li>
					`
                }
                sec.push(secCode)
            }
            $('#side-menu').html(code);
            for(var o=0;o<sec.length;o++){
                $('#side-menu>li.first-ul').eq(o).append('<ul class="nav nav-second-level" aria-expanded=false></ul>').find('ul').html(sec[o])
            }
            for(var p=0;p<third.length;p++){
                $('.nav-second-level>li.sec-ul').eq(p).append('<ul class="undis"></ul>').find('ul').html(third[p])
            }
            for(var q=0;q<fourth.length;q++){
                $('.nav-second-level>li ul li.third-ul').eq(q).append('<ul class="undis"></ul>').find('ul').html(fourth[q])
            }
        },
        error:function(data){
            if(data.status=='403' || data.status=='401'){
                window.location.href="/crm/index.jsp";
            }
        }
    });
}





function navToggle(_this){
    console.log(_this);
	$(_this).siblings('ul').slideToggle();
}
$('.nav-top').click(function(){
	/*$(this).parents('nav').toggleClass('nav-sm').find('.nav').html('<i class="fa fa-user-md"></i>');
	$(this).parents('nav').siblings('#page-wrapper').toggleClass('page-wrapper-sm');*/
	$('body').toggleClass('min-sidebar');
})

$('#content-main').height($(window).height()-85);

$('#pwd_form').validate({
	rules:{
		old_pwd:{
			required:true,
		},
		new_pwd:{
			required:true,
			rangelength:[6,18],
		},
		confirm_pwd:{
			required:true,
			equalTo:'#new_pwd'
		}
	}
})

// function changePwd(){
// 	if ($('#pwd_form').valid()){
// 		var old_pwd=$('#old_pwd').val();
// 		$.ajax({
// 			type:'get',
// 			url:'/crm/user/user/updataPwd.json',
// 			dataType:'json',
// 			success:function(data){
// 				if(old_pwd==data.data){
// 					var new_pwd=$('#new_pwd').val();
// 					if(new_pwd!=old_pwd){
// 						$.ajax({
// 							type:'post',
// 							url:'/crm/user/user/upPwdData.json',
// 							data:{'pwd':new_pwd},
// 							success:function(data){
// 								$('#pwd_modal').modal('hide');
// 								successMsg(data.code,0,'修改成功');
// 							},
// 							error:function(data){
// 								$('#pwd_modal').modal('hide');
// 								returnMessage(2,'修改失败');
// 							}
// 						})
// 					}else{
// 						$('#pwd_modal').modal('hide');
// 						returnMessage(2,'新密码与旧密码相同！');
// 					}
// 				}else{
// 					$('#pwd_modal').modal('hide');
// 					returnMessage(2,'旧密码错误！');
// 				}
//
// 			}
// 		})
// 	};
// }
