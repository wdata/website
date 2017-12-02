//打开地图并获取标点的坐标
var mylayer;
function getMapMarker(){
    mylayer=layer.open({
        type: 2,
        title:'<h4 class="text-center" style="line-height: 42px">点击地图进行选点</h4>',
        shade: false,
        area: ['1000px', '700px'],
        maxmin: true,
        content: 'map_baidu.html',
        zIndex: layer.zIndex, //重点1
        success: function(layero){
            layer.setTop(layero); //重点2
        }
    });
}

function setMapMarker(lng,lat){
    $('.location .lng').val(lng);
    $('.location .lat').val(lat);
}




(function getIP(){
    var country,province,city;    //当前ip所在地址
    $.ajax({
        type:'get',
        url:'/crm/api/unitcrm.json',
        dataType:'json',
        success:function(data){
            if(data.code==0){
                country=data.data[0];
                province=data.data[1];
                city=data.data[2];
                initPosition1(country,province,city);
            }

        },
        error:function(data){
            console.log(data);
            //eval(data.responseText);

        }
    });
})();
//根据IP获取地理位置：
function initPosition1(_country,_province,_city){
    var _CID=0,_PID=0,_id=0;
    $.ajax({
        type:'get',
        url:'/geo/api/position/child.json',
        data:{'taskuuid':452,'clientId':23423,'id':0},
        dataType:'json',
        success:function(data){
            //console.info(data.data);
            var odata=data.data;
            var code='';
            var res= new RegExp(_country);
            console.log(1111);
            console.log(res);
            console.log(odata.length);
            if(odata.length>=1){
                for(var i=0;i<odata.length;i++){
                    code+=`
					    <option value=${odata[i].id} ${ res.test(odata[i].name)?'selected':''}>${odata[i].name}</option>
					`;
                    if(res.test(odata[i].name)){
                        _PID=odata[i].id
                    }
                }
            }
            $('#citySelect1 select[name=country]').append(code);
            $('#cityConC select[name=country]').append(code);
            if(_PID!==0){
                $.ajax({
                    type:'get',
                    url:'/geo/api/position/child.json',
                    data:{'taskuuid':452,'clientId':23423,'id':_PID},
                    dataType:'json',
                    success:function(data){
                        var odata=data.data;
                        var code=[];
                        var res= new RegExp(_province);
                        if(odata.length>=1){
                            for(var i=0;i<odata.length;i++){
                                code+=`
					                <option value=${odata[i].id} ${ res.test(odata[i].name)?'selected':''}>${odata[i].name}</option>
					            `;
                                if(res.test(odata[i].name)){
                                    _CID=odata[i].id
                                }
                            }
                        }
                        $('#citySelect1 select[name=province]').append(code);
                        $('#cityConC select[name=province]').append(code);
                        if(_CID!==0){
                            $.ajax({
                                type:'get',
                                url:'/geo/api/position/child.json',
                                data:{'taskuuid':452,'clientId':23423,'id':_CID},
                                dataType:'json',
                                success:function(data){
                                    var odata=data.data;
                                    var code=[];
                                    var res= new RegExp(_city);
                                    if(odata.length>=1){
                                        for(var i=0;i<odata.length;i++){
                                            code+=`
					                            <option value=${odata[i].id} ${ res.test(odata[i].name)?'selected':''}>${odata[i].name}</option>
					                        `;
                                            if(res.test(odata[i].name)){
                                                _id=odata[i].id
                                            }
                                        }
                                    }
                                    $('#citySelect1 select[name=city]').append(code);
                                    $('#cityConC select[name=city2]').append(code);
                                    if(_id!==0){
                                        $.ajax({
                                            type:'get',
                                            url:'/geo/api/position/child.json',
                                            data:{'taskuuid':452,'clientId':23423,'id':_id},
                                            dataType:'json',
                                            success:function(data){
                                                var odata=data.data;
                                                var code=[];
                                                if(odata.length>=1){
                                                    for(var i=0;i<odata.length;i++){
                                                        code+=`
					                                        <option value=${odata[i].id}>${odata[i].name}</option>
					                                    `;
                                                    }
                                                }
                                                $('#citySelect1 select[name=town]').append(code);
                                                $('#cityConC select[name=town]').append(code);
                                                return false;
                                            },
                                            error:function(data){
                                                console.info(data);
                                            }
                                        });
                                    }
                                    return false;
                                },
                                error:function(data){
                                    console.info(data);
                                }
                            });
                        }
                        return false;
                    },
                    error:function(data){
                        console.info(data);
                    }
                });
            }
            return false;
        },
        error:function(data){
            console.info(data);
        }
    });
}

/*城市数据获取*/
function getPosition(id,elem){
    $.ajax({
        type:'get',
        url:'/geo/api/position/child.json',
        data:{'taskuuid':452,'clientId':23423,'id':id},
        dataType:'json',
        success:function(data){
            console.info(data.data)
            var odata=data.data;
            var code=[];
            if(odata.length>=1){
                for(var i=0;i<odata.length;i++){
                    code+=`
						<option value=${odata[i].id}>${odata[i].name}</option>
					`;
                }
            }
            elem.append(code);
        },
        error:function(data){
            console.info(data);
        }
    })
}
//省份
$('#citySelect1 select[name=country]').change(function(){
    $('.citySelect select[name=city]').html('<option value="">请选择省份</option>');
    getPosition($(this).find('option:selected').attr('value'),$('#citySelect1 select[name=province]'));
});
//城市
$('#citySelect1 select[name=province]').change(function(){
    $('#citySelect1 select[name=city]').html('<option value="">请选择城市</option>');
    $('#citySelect1 select[name=town]').html('<option value="">请选择区县</option>');
    getPosition($(this).find('option:selected').attr('value'),$('#citySelect1 select[name=city]'));
});
//区县
$('#citySelect1 select[name=city]').change(function(){
    $('#citySelect1 select[name=town]').html('<option value="">请选择区县</option>');
    getPosition($(this).find('option:selected').attr('value'),$('#citySelect1 select[name=town]'));
});