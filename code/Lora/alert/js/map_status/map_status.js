var pageNum = 5;//每次条数
var paGe = 1;   //第几页  修改时，出现在被修改页面
var flag = null;
var place=[];
$(function(){
	//load(paGe,{userId:1,currentPage:paGe,pageSize:pageNum});
	$('.L_node_surface').click(function(){
		var location = $('.L_location_set').css('display');
		if(location == 'block'){
			$('.L_location_set').css('display','none');
		}else{
			$('.L_location_set').css('display','block');
		}
	});
	// 百度地图API功能
	var map = new BMap.Map("allmap");
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 4);
	map.enableScrollWheelZoom();

	var MAX = 10;
	var markers = [];
	var pt = null;
	var i = 0;
	for (; i < MAX; i++) {
		pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21);
		markers.push(new BMap.Marker(pt));
	}
	//最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
	var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
});
//function load(page,date){
//	var pageCount;   //初始的
//	if(date!=undefined){
//		$.ajax({
//		type:'post',
//		url: server_url + '/web/index/searchDeviceByName',
//		data:date,
//		dataType:'json',
//		success:function(data){
//			if(data.code==200){
//				$("#node_list tbody").empty();
//				var html='',coord={};
//				$.each(data.data.content,function(index,item){
//					html+='<tr><td>'+item.deviceName+'</td><td>'+item.longitude+'</td><td>'+item.latitude+'</td><td><a data-id="'+item.id+'">定位</a></td></tr>';
//				});
//				$("#node_list tbody").append(html);
//				//分页
//				pageCount = data.data.totalPages;//总页数
//				$(".total .L_common_num").text(pageCount);
//				if(pageCount>1){
//					$('.pages').show();
//					$(".total").removeClass("hide");
//					flag = true;
//					initPagination('#pagination',pageCount,1,page,function(num,type){
//						if(type === 'change'){
//							paGe = num;
//							date.currentPage=paGe;
//							load(paGe,date);
//						}
//					});
//				}else{
//					$('.pages').hide();
//					if(flag) {
//						paGe = 1;
//						date.currentPage=paGe;
//						load(paGe,date);
//						flag = false;
//
//					}
//				}
//			}else{
//				returnMessage(2,data.message);
//			}
//		},
//		error:function(data){
//			//报错提醒框
//			returnMessage(2,'报错：' +  data.status);
//		}
//	});
//	}else{
//		returnMessage(2,"请传入参数");
//	}
//
//}
