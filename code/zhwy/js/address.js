
//地址选择
(function(){
    var Address = function(){
        this.userId = getSession('userId');
        this.subsetBur = true;
        this.propertyId = '';
        this.propertyName = '';
        this.ajax = new Util();
        this.notChild = '';
    };
//选择区域(显示)
    Address.prototype.addrToggle = function(_this){
        var offset = $(_this).offset();
        if(/_(add|edit)\.html/.test(location.href)){
            $("#address").removeClass("hide").css({'left':offset.left,'top':offset.top+45});
        }else {
            $("#address").removeClass("hide").css({'left':offset.left-24,'top':offset.top-12});
        }

    };
//选择区域(隐藏)
    Address.prototype.addrToggleAdd = function(){
        $("#address").addClass("hide");
    };
//确定选择区域
    Address.prototype.yes = function(){
        $("#addR").val(this.propertyName);
        setSession('propertyId',this.propertyId);
        setSession('propertyName',this.propertyName);
        this.addrToggleAdd();
    };

// 子集事件
    Address.prototype.subsetFt = function(){
        var _this = this;
        $(document).on("click",".addDetail",function(){
            // 修改菜单
            var id = $(this).attr("data-id");

            _this.propertyId = $(this).attr("data-id");
            _this.propertyName = $(this).text();

            _this.subset(id);  // 获取子集菜单

            if(_this.subsetBur){
                var last = $('.details .detailsB').last();
                last.removeClass('active');

                if(last.attr('data-id') == id){
                    _this.subsetBur = false;
                }


                // 修改顶部菜单

                $("#address .details").append(
                    `<div data-id="${id}" class="detailsB">
                <span class="addName">${$(this).text()}</span>
                <i class="icon fa fa-angle-down"></i>
            </div>`
                );
                last.addClass('active');
            }else{
            }
        });
    };

    Address.prototype.all = function(){
        var _this = this;
        $(document).on("click","#address div.all",function(){
            $('.head .details').html('');
            _this.propertyId = '';
            _this.propertyName = '全部';
            _this.topLevel();
        });
    };

// 顶部同级事件
    Address.prototype.topSubsetFt = function(){
        var _this = this;
        $(document).on("click",".details .detailsB",function(){
            var id = $(this).attr("data-id");
            var name = $(this).find('.addName').text();

            $(this).addClass("active").siblings().removeClass("active");
            $(".choose").removeClass("active");
            $(this).nextAll().remove();

            _this.propertyId = id;
            _this.propertyName = name;

            _this.subset(id);
        })
    };

// 一级菜单
    Address.prototype.topLevel = function(){
        var _this = this;
        this.ajax.get('/web/api/v1/property/topPropertyList',{"userId":_this.userId},function(res){
            var html = '';
            var list = $("#add-list").empty();
            if(res.code === 0){
                $.each(res.data,function(i,item){
                    html += `<li data-id="${item.id}" class="addDetail">${item.name}</li>`;
                });
                list.append(html);
            }
        });

    };

// 子集菜单
    Address.prototype.subset = function(id){
        var _this = this;

        if(_this.notChild == id){return false;}
        this.ajax.get('/web/api/v1/property/childList',{"userId":_this.userId,"propertyId":_this.propertyId},function(res){
            if(res.code === 0 ){
                //var html = `<li data-id="${id}" data-propertyName="${_this.propertyName}" class="all active">全部</li>`;
                var html = '';
                if(res.data.length > 0){
                    var list = $("#add-list").empty();
                    $.each(res.data,function(i,item){
                        html += `<li data-id="${item.id}" class="addDetail">${item.name}</li>`;
                    });
                    list.append(html);
                    _this.subsetBur = true;
                    $('.details .detailsB').removeClass('active').last().addClass('active');

                }else{
                    //_this.notChild = id;
                    $("#add-list").empty();
                    _this.subsetBur = false;
                    $('.details .detailsB').removeClass('active').last().addClass('active');

                }
            }
        });

    };
    Address.prototype.init = function(){
        if(getSession('propertyId')===''){
            setSession('propertyId','');
            setSession('propertyName','全部');
        }
        $('#addR').val(getSession('propertyName'));
        this.all();
        this.topLevel();
        this.subsetFt();     // 底部子集事件
        this.topSubsetFt();  // 顶部同级事件
    };
    var address = new Address();
    address.init();
})();