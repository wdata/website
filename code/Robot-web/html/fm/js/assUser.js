    /*
    *  关联用户
    * */

    $(document).ready(function(){
        list.list(paGe,pageNum);

        // 启用和停用
        $(".modify").on("click",function(){
            modify.single($(this).attr('data-bur'));
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
                "page":page,
                "size":size,
                "deviceId":obtain("id")
            };

            $.ajax({
                type:'get',
                url: url + robotDevice + version1 +'/device/user/list',
                data:dataObject,
                dataType:'json',
                success:function(data){
                    const list = $(".list");  //将选择器赋值给常量
                    list.empty();  //清空
                    if(data.code === 200){
                        let listData = '';
                        $.each(data.data.items,function(i,d){
                            listData += `<tr>
                                            <td><input data-status="${ d.status }" data-id="${ d.id }" type="checkbox" class="notSelectAll"></td>
                                            <td>${ i + 1 }</td>
                                            <td>${ noTd(d.deviceSequence) }</td>
                                            <td>${ noTd(d.userAcc) }</td>
                                            <td>${ noTd(d.userName) }</td>
                                            <td>${ noTd(d.createTime) }</td>
                                            <td>${ noTd(d.correlationType) }</td>
                                            <td>${ d.manager?'是':d.manager === false?'否':'-' }</td>
                                            <td>${ d.status?'已启用':d.status === false?'已停用':'-' }</td>
                                        </tr>`;
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
                                self.list(paGe,pageNum);
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
        },
        pageTo:function(_this){
            const max = parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
            const val = parseInt($(_this).siblings('input').val());
            const num = (val>0?val:1)>max?max:(val>0?val:1);
            paGe = num;
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
                layer.msg('请选择设备！');
                return false;
            }
            modify.transfer(id,status);
        },
        multiple:function(_this,status){
            let id = [$(_this).parents("tr").find("input[type=checkbox]").attr("data-id")];
            modify.transfer(id,status);
        },
        transfer:function(id,status){


            $.ajax({
                type:'post',
                url: url + robotDevice + version1 + '/device/user/modifyStatus',
                data:JSON.stringify({
                    ids	:id.join(","),
                    status:status,
                    userId:userId
                }),
                dataType:'json',
                contentType: 'application/json',
                success:function(data){
                    if(data.code === 200){
                        switch (status){
                            case "1":  layer.msg('启用成功！'); break;
                            case "0": layer.msg('停用成功！'); break;
                        }
                        list.list(paGe,pageNum);
                    }else{
                        layer.msg(data.message);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        }
    };
