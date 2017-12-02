    /*
     *  设备管理
     *
     * */

    // 调用关联时间初始化
    associationTime("#startTime","#endTime");

    $(document).ready(function(){
        list.list(paGe,pageNum);
        equipment.types("#equipmentType","#equipmentModel",1);  // 设备类型列表

        // 搜索
        $("#search").on("click",function(){
            list.list(paGe,pageNum);
        });

        // 查看
        $(document).on("click",".toView",function(){
            list.toView(this);
        });
        // 编辑
        $(document).on("click",".edit",function(){
            list.toView(this);
        });

        // 删除
        $(".delete").on("click",function(){
            detele.multiple();
        });
        // 批量导入
        $(".importData").on("change",function(){
            batch.importData(this);
        });
        // 模板下载
        $(".expor").on("click",function(){
            batch.expor(this);
        });
        // 批量导出
        $(".templateExport").on("click",function(){
            batch.templateExport(this)
        });
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
                url: url + robotDevice + version1 +'/device/list',
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
                                            <td>${ noTd(d.id) }</td>
                                            <td>${ noTd(d.deviceSequence) }</td>
                                            <td>${ noTd(d.mac) }</td>
                                            <td>${ noTd(d.appKey) }</td>
                                            <td>${ noTd(d.deviceName) }</td>
                                            <td>${ noTd(d.typeName) }</td>
                                            <td>${ noTd(d.modelName) }</td>
                                            <td>${ noTd(d.version) }</td>
                                            <td>${ d.online?'在线':'离线' }</td>
                                            <td>${ noTd(d.agentName) }</td>
                                            <td>${ noTd(d.userName) }</td>
                                            <td>${ noTd(d.createTime) }</td>
                                            <td>${ noTd(d.ip) }</td>
                                            <td>${ noTd(d.area) }</td>
                                            <td>${ noTd(d.oemName) }</td>
                                            <td class="operating"><a href="assUser.html" class="bg success toView">查看</a></td>
                                            <td>${ d.status?'已启用':d.status===false?'已停用':'-' }</td>
                                            <td class="operating"><a href="fm_edit.html" class="bg success edit">编辑</a></td>
                                        </tr>`
                        });
                        list.append(listData);

                        //分页
                        pageCount = data.data.totalPages;
                        vpage = pageCount>10?10:pageCount;
                        if(pageCount>1){
                            $('.pages').show();
                            flag = true;
                            initPagination('#pagination',pageCount,vpage,paGe,function(num,type){
                                if(type === 'change'){
                                    paGe = num;
                                    self.list(paGe,pageNum);
                                }
                            });
                        }else{
                            if(flag){
                                paGe = 1;
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
     *   importData：批量导入、expor：导出、templateExport：导入模板下载
     * */

    let batch = {
        expor:function(_this){
            const form = $("#newForm").serialize();  //将form序列化
            $(_this).attr({"href": url + robotDevice + version1 + "/device/export?" + form});
        },
        importData:function(_this){
            //判断格式
            const name = _this.value;
            const postfix = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
            if(postfix !== 'xls' && postfix !== 'xlsx'){
                layer.msg('请选择xls和xlsx的格式文件上传！');
                $(_this).val("");   //清空数据，以防noChange内容不变时，不执行函数
                return ;
            }

            let form = new FormData($("#Import")[0]);
            form.append("userId",userId);
            $.ajax({
                type:'post',
                url: url + robotDevice + version1 +'/device/import',
                data: form,
                contentType: false,
                processData: false,
                success:function(data){
                    if(data.code === 200){
                        layer.msg('添加成功');
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
            $(_this).val("");   //清空数据，以防noChange内容不变时，不执行函数
        },
        // http://robotqn.xdaocloud.com/2017/11/17/bf4b420f-c728-4fc0-824f-f75e1987e989.xlsx
        templateExport:function(_this){
            // $(_this).attr({"href": url + robotDevice + version1 + "/device/export" });
            $(_this).attr("href","http://robotqn.xdaocloud.com/2017/11/17/bf4b420f-c728-4fc0-824f-f75e1987e989.xlsx")
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
                url: url + robotDevice + version1 +'/device/delete',
                data:JSON.stringify({
                    "userId":userId,
                    "deviceIds":id.join(",")
                }),
                dataType:'json',
                contentType: 'application/json',
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
                url: url + robotDevice + version1 + '/device/modifyStatus',
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


    /*  导入成功导入失败
     ---------------------------------------------------------------------------------------------------------*/
    // function importDetails(data){
    //     let pageCount,vpage;   //初始的
    //     let html,sum = 1;
    //     let import_list = $(".import_list");
    //     import_list.empty();
    //     $.each(data.data.failList,function(index,val){
    //         //阶段 0:群众,10:积极份子,20:重点对象,30预备党员,100党员
    //         let type = '';
    //         switch(val.type){
    //             case 0:type = '群众';
    //                 break;
    //             case 10:type = '积极份子';
    //                 break;
    //             case 20:type = '重点对象';
    //                 break;
    //             case 30:type = '预备党员';
    //                 break;
    //             case 100:type = '党员';
    //                 break;
    //         }
    //         let joinPartyDate = val.joinPartyDate?val.joinPartyDate:" ";
    //         html += '<tr><td>'+ sum +'</td>'+
    //             '<td>'+ val.name +'</td>'+
    //             '<td>'+ val.examName +'</td>'+
    //             '<td>'+ val.examScore +'</td></tr>';
    //         // <tr>
    //         // <th>姓名</th>
    //         // <th>科目</th>
    //         // <th>成绩</th>
    //         // </tr>
    //         sum++;
    //     });
    //     import_list.append(html);
    //
    //     // 显示弹出框
    //     $("#importModal").addClass("show in");
    // }
    // function importDown(){
    //     // 关闭弹出框
    //     $("#importModal").removeClass("show in");
    // }