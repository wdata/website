
    $(document).ready(function(){
        list.list(paGe,pageNum);

        // 调用关联时间初始化
        associationTime("#startTime","#endTime");

        // 搜索
        $("#search").on("click",function(){
            list.list(paGe,pageNum);
        });

        // 删除
        $(".delete").on("click",function(){
            detele.multiple();
        });
        // 单个删除
        $(document).on("click",".single",function(){
            detele.single(this);
        });
        $(".determine").on("click",function(){
            determine();
        });


        onOff.open('.open',function(_this){
            const id = "#" + $(_this).attr('data-onOff');
            const ids = $("#list_tab .list td input:checked");
            if(id === "#agentsPop"){
                if(!(ids.length === 1)){
                    layer.msg("请选择一个代理商！");
                    return false;
                }
                $(".superiorList").hide();
                $("#treeDemo").empty();
                $(".typeModel").empty();
                $(".superiorShow").val("");

                age.id = ids.attr("data-id");
            }
            $(id).toggleClass("show");
        });
        onOff.down(".down",function(_this){
            $(_this).parents(".modal").toggleClass("show");
        });

    });

    /*
     *   列表、搜索、跳转
     * */

    let list = {
        list:function(page,size){
            let self = this;
            let pageCount,vpage;   //初始的
            //开始时显示数据
            let dataObject = {
                page:page,
                size:size
            };

            // 添加搜索条件
            $.each($('#newForm .form-control'),function(index,val){
                if($(val).val().length > 0){
                    dataObject[$(val).attr("name")] = $(val).val();
                }
            });

            $.ajax({
                type:'get',
                url: url + robotAgent + version1 +'/divident/list.json',
                data:dataObject,
                dataType:'json',
                success:function(data){
                    const list = $(".list");  //将选择器赋值给常量
                    list.empty();  //清空
                    if(data.code === 200){
                        let listData = '';
                        $.each(data.data.items,function(i,d){
                            listData += `<tr>
                                            <td><input data-id="${ d.id }" type="checkbox" class="notSelectAll"></td>
                                            <td>${ i + 1 }</td>
                                            <td>${ agentsLevel(d.agentLevel) }</td>
                                            <td>${ d.ratio?d.ratio+"%":"-" }</td>
                                            <td>${ noTd(d.userName) }</td>
                                            <td>${ noTd(d.createTime) }</td>
                                            <td>${ d.status===1?'审核通过':d.status===2?'审核不通过':'-' }</td>
                                            <td>${ noTd(d.reason) }</td>
                                            <td class="operating"><a class="bg success single">删除</a></td>
                                        </tr>`
                        });
                        list.append(listData);

                        //分页
                        pageCount = data.data.totalPages;
                        vpage = pageCount>10?10:pageCount;
                        if(pageCount>1){
                            $('.pages').show();
                            flag = true;
                            initPagination('#pagination',pageCount,vpage,page,function(num,type){
                                if(type === 'change'){
                                    paGe = num;
                                    self.list(paGe,pageNum);
                                }
                            });
                        }else{
                            if(flag){
                                paGe = 0;
                                list.list(paGe,pageNum);
                                flag = false;
                                $('.pages').hide();
                            }
                        }
                    }else{
                        $('.pages').hide();
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
            $("#list_tab thead td:first input").prop("checked",false);
        },
        pageTo:function(_this){
            const max = parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
            const val = parseInt($(_this).siblings('input').val());
            const num = (val>0?val:1)>max?max:(val>0?val:1);
            paGe = num;
            this.list(paGe,pageNum);
            $(_this).siblings('input').val(num);
        },
        toView:function(_this){
            const id = $(_this).parents("tr").find("input[type=checkbox]").attr("data-id");
            deposited("id",id);
        },
        edit:function(_this){
            const id = $(_this).parents("tr").find("input[type=checkbox]").attr("data-id");
            deposited("id",id);
        }
    };

    /*
     *   单个删除按钮，多个删除按钮，删除请求调用
     * */

    let detele = {
        single:function(_this){
            layer.confirm('是否删除记录', {
                btn: ['确定','取消'] //按钮
            }, function(){
                let id = [$(_this).parents("tr").find("input[type=checkbox]").attr("data-id")];
                detele.transfer(id);
            });
        },
        multiple:function(){
            const dataID = $('#list_tab tbody input[type=checkbox]:checked');   //单选按钮
            let id = [];
            $.each(dataID,function(index,val){
                id.push($(val).attr("data-id"));   //获取id
            });

            if(id.length <= 0) {layer.msg("请选择！"); return;}
            layer.confirm('是否删除记录', {
                btn: ['确定','取消'] //按钮
            }, function(){
                detele.transfer(id);
            });
        },
        transfer:function(id){
            $.ajax({
                type:'post',
                url: url + robotAgent + version1 +'/divident/delete.json',
                data:{
                    "ids":id.join(",")
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 200){
                        layer.msg('删除成功');
                        list.list(paGe,pageNum);
                    }else{
                        layer.msg(data.message);
                    }
                },
                beforeSend:function(){
                    layer.load(0, {shade:[0.1,'#000']}); //0代表加载的风格，支持0-2
                },
                complete:function(){
                    layer.closeAll('loading'); //关闭信息框
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        }
    };

    function determine(){
        $.ajax({
            type:'POST',
            url: url + robotAgent + version1 +'/divident/addOrUpdate.json',
            data:{
                "userId":userId,
                "agentLevel":$("#agentLevel").val(),
                "ratio":$("#ratio").val(),
            },
            dataType:'json',
            success:function(data){
                if(data.code === 200){
                    layer.msg("添加成功！");
                    $("#addDivided").toggleClass("show");
                    list.list(paGe,pageNum);
                }else{
                    layer.msg(data.data[0].message);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
        });
    }

