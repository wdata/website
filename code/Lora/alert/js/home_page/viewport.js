var companyId=sessionStorage.getItem("companyID");
$(document).ready(function(){
    load();
    //推送
    var clt = sessionStorage.getItem('clt');
    var goEasy = new GoEasy({appkey: 'BC-bc8aca99c2334b7d980144423300d20c'});
    goEasy.subscribe({
        channel: clt,
        onMessage: function(message){
            load();
        }
    });
});
function load(){
    $.ajax({
        type:'post',
        url: server_url + '/web/common/select',
        dataType:'json',
        data:{'type':5},
        success:function(data){
            if(data.code==200){
                var html='';
                $.each(data.data,function(index,item){
                    //html+='<option value="'+item.key+'">'+item.val+'</option>';
                    /*html+=
                        `<div class="item">
                            <button data-tit="报警处理列表" href="html/warning_guan/wait_surface.html"  onclick="waringDesc(this)">${item.name}：<span id="${item.id}"></span></button>
                        </div>`;*/
                    html+=`
                        <div class="svg_con" data-tit="报警处理列表" href="html/warning_guan/wait_surface.html" onclick="waringDesc(this)" id="${item.id}">
                            <svg class="svg" width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="48" stroke="rgba(43,197,254,0.3)" stroke-width="4" fill="none"></circle>
                                <path id="ring${index+1}" stroke="rgba(43,197,254,1)" stroke-width="4" fill="none"></path>
                                <circle cx="50" cy="50" r="46" stroke-width="0" fill="#fff"></circle>
                            </svg>
                            <p class="num">0</p>
                            <p class="name">${item.name}</p>
                        </div>
                    `;
                });
                $(".alarm_type").html(html);
                getSysCount();
            }else{
                returnMessage(2,data.message);
            }
        },
        error:function(data){
            //报错提醒框
            returnMessage(2,'报错：' +  data.status);
        }
    });

}


//
function getSysCount(){
    $.ajax({
        type:'post',
        url:server_url+"/web/index/getSysCount",
        data:{companyId:companyId},
        dataType:'json',
        success:function(res){
            if(res.code==200){
                $("#warningCount").html(res.data.warningCount);
                $("#fire_alarm .num").html(res.data.fireAlarmCount);
                $("#no_connect .num").html(res.data.noConnectCount);
                $("#under_voltage .num").html(res.data.deviceFaultCount);

                var arc1 = parseFloat((res.data.fireAlarmCount/res.data.warningCount*100).toFixed(2));
                var arc2 = parseFloat((res.data.fireAlarmCount/res.data.warningCount*100).toFixed(2));
                var arc3 = parseFloat((res.data.fireAlarmCount/res.data.warningCount*100).toFixed(2));
                drawArc('ring1',arc1>99.5?99.5:arc1);
                drawArc('ring2',arc2>99.5?99.5:arc2);
                drawArc('ring3',arc3>99.5?99.5:arc3);

                $("#deviceCount").html(res.data.deviceCount);
                $("#deviceOnLineCount").html(res.data.deviceOnLineCount);
                $("#deviceOffLineCount").html(res.data.deviceOffLineCount);

                var path4 = parseFloat((res.data.deviceOnLineCount/res.data.deviceCount*100).toFixed(2));
                var path5 = parseFloat((res.data.deviceOffLineCount/res.data.deviceCount*100).toFixed(2));
                drawArc('path4',path4>99.5?99.5:path4);
                drawArc('path5',path5>99.5?99.5:path5);
            }else{
                returnMessage(2, res.message);
            }
        },
        error:function(res){
            returnMessage(2,'报错：' +  res.status);
        }
    });
}

//保存报警描述
function waringDesc(_this){
    var waringDesc=$(_this).attr("id");
    parent.workspace(_this);
    sessionStorage.setItem("waringDesc",waringDesc);
    sessionStorage.setItem('currentStatus','nocomplete');
    openTab(_this);
}


//SVG 画 弧形
function drawArc(path,progress,r,t) {//path 弧形容器id，progress 百分比，r 半径，t 圆心
    var path = document.getElementById(path);
    var progress=progress||0;
    var r=r||48;
    var t=t||50;
    path.setAttribute('transform', 'translate('+t+','+t+')');
    var degrees = progress * (360/100);
    var rad = degrees* (Math.PI / 180);
    var x = (Math.sin(rad) * r).toFixed(2);
    var y = -(Math.cos(rad) * r).toFixed(2);
    var lenghty = window.Number(degrees > 180);
    var descriptions = ['M', 0, 0, 'v', -r, 'A', r, r, 0, lenghty, 1, x, y, 'z'];
    path.setAttribute('d', descriptions.join(' '));
}