
    $(document).ready(function(){
        list.list(paGe,pageNum);

        // 搜索
        $("#search").on("click",function(){
            list.list(paGe,pageNum);
        });

        // 通过和不通过
        $(".modify").on("click",function(){
            modify.single($(this).attr('data-bur'));
        });
        // 通过和不通过
        $(document).on("click",".modifyOnly",function(){
            modify.multiple(this,$(this).attr('data-bur'));
        });

    });

    /*
     *   列表、搜索、跳转
     * */

    let list = {
        list:function(page,size){
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
                url: url + robotAgent + version1 +'/divident/auditList.json',
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
                                                <td>${ noTd(d.reason) }</td>
                    <td class="operating"><a data-bur="true" class="bg success modifyOnly">通过</a><a data-bur="false" class="bg success modifyOnly">不通过</a></td>
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
            paGe = num - 1;
            this.list(paGe,pageNum);
            $(_this).siblings('input').val(num);
        }
    };


    /*
     *   停用和启用，分为单个和批量
     *   status：true，false ； id：数组格式
     * */

    let modify = {
        single:function(status){
            const dataID = $('#list_tab tbody input[type=checkbox]:checked');   //单选按钮
            let id = [];
            $.each(dataID,function(index,val){
                id.push($(val).attr("data-id"));   //获取id
            });
            if(id.length <= 0){
                layer.msg('请选择代理商！');
                return false;
            }
            modify.transferTrue(id);
        },
        multiple:function(_this,status){
            if(status === "true"){
                let id = [$(_this).parents("tr").find("input[type=checkbox]").attr("data-id")];
                modify.transferTrue(id);
            }else if(status === "false"){
                let id = $(_this).parents("tr").find("input[type=checkbox]").attr("data-id");
                layer.prompt({title: '请输入原因', formType: 2}, function(text, index){
                    layer.close(index);
                    modify.transferFalse(id,text);
                });
            }
        },
        transferTrue:function(id){
            $.ajax({
                type:'post',
                url: url + robotAgent + version1 + '/divident/pass.json',
                data:{
                    ids: id.join(",")
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 200){
                        layer.msg('审核成功！');
                        list.list(paGe,pageNum);
                    }else{
                        layer.msg(data.message);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        },
        transferFalse:function(id,reason){
            $.ajax({
                type:'post',
                url: url + robotAgent + version1 + '/divident/notPass.json',
                data:{
                    id:id,
                    reason: reason
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 200){
                        layer.msg('审核成功！');
                        list.list(paGe,pageNum);
                    }else{
                        layer.msg(data.message);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        }
    };