    /*
    *   公共文件
    *   url：ip
    * */
    var url = ""
        ,robotDevice = "/robot-device"  // 设备
        // ,robotDevice = ""  // 设备
        ,robotAgent = "/robot-agent"  // 代理商
        ,robotCore = "/robot-core"   // 公共
        // ,robotAgent = ""  // 代理商
        ,version1 = "/api/v1"   // 版本
        ,userId = "5021"
        ,agentId = "100";





    let pageNum = 10,   //每次页数
         paGe = 1,   //第几页  修改时，出现在被修改页面
         flag = null;   // 分页赋值

    $(function(){

        /*
        *   全选函数 不全选函数
        * */
        $("#list_tab").on("click",".selectAll",function(){
            check.checkAll('list_tab',this);
        });
        $(document).on("click","#list_tab .notSelectAll",function(){
            check.checkDown(this);
        });
        /*
         *   跳转
         * */

        $(".jump").on("click",function(){
            list.pageTo(this);
        });


    });


    /*
     *   开启,关闭选择代理商弹出层
     *   给每个需要开启或关闭的元素添加onOff类名和data-onOff属性，data-onOff存放需要开启或者关闭的id名
     *   ele：执行的事件 ; character：点击的类名
     * */
    let onOff = {
        open:function (character,ele){
            this.dealWith(character,ele);
        },
        down:function (character,ele){
            this.dealWith(character,ele);
        },
        dealWith:function(character,ele){
            $(character).on("click",function(){
                ele(this);
            });
        }
    };


    // 报错提示
    function beingGiven(XMLHttpRequest, textStatus, errorThrown){
        /* readyState :当前状态,0-未初始化，1-正在载入，2-已经载入，3-数据进行交互，4-完成; status：返回的HTTP状态码; statusText：对应状态码的错误信息*/
        console.log("当前状态：" + XMLHttpRequest.readyState + " 状态码：" + XMLHttpRequest.status + " 错误信息：" + errorThrown);
    }

    /*
    *    本地存储
    *    deposited：将值存入dataSession
    *    obtain：获取dataSession值
    *    dataSession：本地存储对象,添加判断，以继承本地存储内数据；如果没有本地存储则创建一个对象；
    * */

    let robot = localStorage.getItem("robot")?JSON.parse(localStorage.getItem("robot")):{};
    function deposited(name,value){
        robot[""+ name +""] = value;
        localStorage.setItem("robot",JSON.stringify(robot));
    }
    function obtain(name){
        let data = "";
        if(localStorage.getItem("robot")){
            data = JSON.parse(localStorage.getItem("robot"))[name];
        }
        return data;
    }


    /*  types：设备类型列表
     *  传参：元素字符串,index：为1时有全部；idNameType：类型名；idNameModel：型号名
     *
     *  model：设备型号列表
     *  传参：元素字符串,index：为1时有全部；idNameModel：型号名，typeId：类型ID , 如果correspond相等，则突出显示
     *  设备类型为全部，不显示设备型号
     *
     * */
    var equipment = {
        types:function(idNameType,idNameModel,index,correspond){
            $.ajax({
                type:'get',
                url: url + robotDevice + version1 +'/device/type/list',
                dataType:'json',
                success:function(data){
                    const list = $(idNameType).empty();  //将选择器赋值给常量 清空
                    if(data.code === 200){
                        var listData = index === 1?'<option value="">全部</option>':'';
                        $.each(data.data,function(i,d){
                            if(d.id === correspond){
                                listData += '<option selected value="'+ d.id +'">'+ d.typeName +'</option>';
                            }else{
                                listData += '<option value="'+ d.id +'">'+ d.typeName +'</option>';
                            }
                            if(!(index === 1) && i === 0){
                                equipment.model(idNameModel,d.id,0); // 设备型号列表
                            }
                        });
                        list.append(listData);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });

            /*  给元素绑定改变事件,如果选择的val为空（等于选择全部），则删除除全部以外的所有元素
            *   indexModel：根据类型的index而变化
            *   html：根据index变化
            * */
            $(idNameType).on("change",function(){
                const val = $(this).val();
                const indexModel = index === 1?1:0;
                if(val.length > 0){
                    equipment.model(idNameModel,val,indexModel); // 设备型号列表
                }else{
                    const html =  index === 1?'<option value="">全部</option>':'';
                    $(idNameModel).html(html);
                }
            })
        },
        model:function(idNameModel,typeId,index,correspond){
            if(typeId.length <= 0){
                return;
            }
            $.ajax({
                type:'get',
                url: url + robotDevice + version1 +'/device/model/list',
                data:{
                    "typeId":typeId   //设备类型Id
                },
                dataType:'json',
                success:function(data){
                    const list = $(idNameModel).empty();  //将选择器赋值给常量 清空
                    if(data.code === 200){
                        var listData = index === 1?'<option value="">全部</option>':'';
                        $.each(data.data,function(i,d){
                            if(d.id === correspond){
                                listData += '<option selected value="'+ d.id +'">'+ d.modelName +'</option>';
                            }else{
                                listData += '<option value="'+ d.id +'">'+ d.modelName +'</option>';
                            }
                        });
                        list.append(listData);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        }
    };
    /*
    *   代理商
    *   传参：元素字符串,index：为1时有全部；idNameAgents：类型名
    * */
    function agents(idNameAgents,index){
        $.ajax({
            type:'get',
            url: url + robotAgent + version1 +'/agent/list.json',
            dataType:'json',
            success:function(data){
                const list = $(idNameAgents).empty();  //将选择器赋值给常量 清空
                if(data.code === 200){
                    var listData = index === 1?'<option value="">全部</option>':'';
                    $.each(data.data.items,function(i,d){
                        listData += '<option value="'+ d.agentId +'">'+ d.agentName +'</option>';
                    });
                    list.append(listData);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
        });
    }
    /*
     *   OME厂商
     *   传参：元素字符串,index：为1时有全部；idNameAgents：类型名
     * */
    function ome(idNameAgents,index){
        $.ajax({
            type:'get',
            url: url + robotAgent + version1 +'/agent/list.json',
            dataType:'json',
            success:function(data){
                const list = $(idNameAgents).empty();  //将选择器赋值给常量 清空
                if(data.code === 200){
                    var listData = index === 1?'<option value="">全部</option>':'';
                    $.each(data.data.items,function(i,d){
                        listData += '<option value="'+ d.agentId +'">'+ d.agentName +'</option>';
                    });
                    list.append(listData);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
        });
    }
    /*
     *   根据代理商参数1-10返回代理商一级到代理商十级
     * */
    function agentsLevel(level){
        var text = "-";
        switch(level){
            case 1:text = "一级代理商";break;
            case 2:text = "二级代理商";break;
            case 3:text = "三级代理商";break;
            case 4:text = "四级代理商";break;
            case 5:text = "五级代理商";break;
            case 6:text = "六级代理商";break;
            case 7:text = "七级代理商";break;
            case 8:text = "八级代理商";break;
            case 9:text = "九级代理商";break;
            case 10:text = "十级代理商";break;
        }
        return text;
    }



    // 关联时间初始化，传参：id名
    function associationTime(start,end){
        /*  日期初始化   */
        $(start).datetimepicker({
            format: "yyyy-mm-dd",
            minView:'month',
            autoclose: true,
            todayBtn: true,
            changeMonth: true,
            changeYear: true,
            language: 'zh-CN',
            clearBtn: true
        }).on("click",function(){
            $(start).datetimepicker("setEndDate",$(end).val())
        });
        $(end).datetimepicker({
            format: "yyyy-mm-dd",
            minView:'month',
            autoclose: true,
            todayBtn: true,
            changeMonth: true,
            changeYear: true,
            language: 'zh-CN',
            clearBtn: true
        }).on("click",function(){
            $(end).datetimepicker("setStartDate",$(start).val())
        });
    }
    /*表格内容非空判断*/
    function noTd(elem){
        return elem?elem:'-'
    }
    //去掉字符串首空格
    String.prototype.ltrim=function(){
        return this.replace(/(^\s*)/g,"");
    };
    //去掉字符串首尾空格
    String.prototype.trim=function(){
        return this.replace(/(^\s*)|(\s*$)/g,"");
    };
    //分页初始化
    function initPagination(id,total,vpage,curpage,callback) {
        console.log(curpage)
        $.jqPaginator(id, {
            totalPages: total,
            visiblePages: vpage,
            currentPage: curpage,
            onPageChange: callback,
            prev: '<li class="prev"><a href="javascript:;"><i class="fa fa-chevron-left"></i></a></li>',
            next: '<li class="next"><a href="javascript:;"><i class="fa fa-chevron-right"></i></a></li>',
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>'
        });
    }
    //切换页面
    function target_page(id){
        $(".content").hide();
        $("."+id).removeClass("hide");
    }

    /*
    *   列表全选，和取消全选
    * */
    let check = {
        checkAll:function(id,_this){
            if(_this.checked){
                $("#"+id+" tbody :checkbox").prop("checked", true);
            }else{
                $("#"+id+" tbody :checkbox").prop("checked", false);
            }
        },
        checkDown:function(_this){
            const all = $(_this).parents("tbody").siblings("thead").find("input[type=checkbox]");
            if(_this.checked){
                let bur = true;
                $.each($(_this).parents("tr").siblings().find("input[type=checkbox]"),function(index,val){
                    if(!val.checked){
                        bur = false;
                    }
                });
                if(bur){
                    all.prop("checked", true);
                }
            }else{
                all.prop("checked", false);
            }
        }
    };

    /*上传图片预览*/
    function imgPreview(_this){
        if(_this.value==='')return false;
        var $file = $(_this);
        var fileObj = $file[0];
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        var $img = $(_this).parent().siblings().find('img');

        if(fileObj && fileObj.files && fileObj.files[0]) {
            dataURL = windowURL.createObjectURL(fileObj.files[0]);
            $img.attr('src', dataURL);
        } else {
            dataURL = $file.val();
            var imgObj =$img.get(0);
            imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
        }
        return true;
    }

    /*上传图片大小格式验证*/
    function imgSizeCheck(_this){
        var fileSize = 0;
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        var name=_this.value;
        var postfix=name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        if(isIE && !_this.files) {
            var filePath = _this.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        } else {
            fileSize = _this.files[0].size;
        }
        var size = fileSize / 1024;
        if(size > 2000) {
            returnMessage(2,'附件不能大于2M！');
            _this.value==' ';
            $(_this).attr('src','');
            console.info($(_this).attr('src') )
            return false;
        }else{
            if(postfix!='jpg' && postfix!='jpeg'&& postfix!='png'&& postfix!='bmp'){
                returnMessage(2,'请选择jpg，jpeg，png，bmp的格式文件上传！');
                _this.value==' ';
                $(_this).attr('src',' ');
                return false;
            }else{
                imgPreview(_this);
            }
        }
    }

    /*导入excel表格验证*/
    function excelCheck(_this){
        var name=_this.value;
        var postfix=name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        if(postfix!='xls' && postfix!='xlsx'){
            returnMessage(2,'请选择xlsx，xls的格式文件上传！');
            _this.value==' ';
            $(_this).attr('src',' ');
            return false;
        }else{
            return true
        }
    }





















