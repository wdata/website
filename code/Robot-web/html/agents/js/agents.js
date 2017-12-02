
    let setting = {
        data : {
            key:{
              "name":"agentName"
            },
            simpleData : {
                enable : true,
                idKey: "agentId",
                pIdKey: "parentAgentId",
                rootPId: 0
            }
        },
        check:{
            enable: true,
            chkStyle: "radio",
            autoCheckTrigger: true,
            radioType:"all",
        }
    };

    $(document).ready(function(){
        /* 将时间放在最后 */
        setting.callback =  {
            onCheck: age.ztreeClick
        };

        list.list(paGe,pageNum);

        // 搜索
        $("#search").on("click",function(){
            list.list(paGe,pageNum);
        });
        // 查看
        $(document).on("click",".toView",function(){
            list.toView(this);
        });

        /* 添加代理商  全选函数 不全选函数 */
        $("#agents_list_table").on("click",".selectAll",function(){
            check.checkAll('agents_list_table',this);
        });
        $(document).on("click","#agents_list_table .notSelectAll",function(){
            check.checkDown(this);
        });
        /* 添加代理商 -- 确定 */
        $("#addAgents").on("click",".determine",function(){
            const id = $(this).parents(".modal").find(".list .notSelectAll:checked");
            let ids = [];
            id.each(function(){
                ids.push({
                    "agentId":$(this).attr("data-id"),
                    "agentName":$(this).parents("tr").find("td").eq(1).text()
                })
            });
            addAgents(ids);
        });
        /*
        *   显示上级代理商树状图
        *   确定选择类型和型号
        * */
        $(".superiorShow").on("click",function(){
            $(".superiorList").show();
            age.ageZtree();
        });
        $("#agentsPop").on("click",".determine",function(){
            age.determine();
        });
        /*
         *   显示上级代理商管理和添加代理商弹出框
         * */
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
            if(id === "#addAgents"){
                companyList.list();
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
            var self = this;
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
                url: url + robotAgent + version1 +'/agent/list.json',
                data:dataObject,
                dataType:'json',
                success:function(data){
                    const list = $("#list_tab .list");  //将选择器赋值给常量
                    list.empty();  //清空
                    if(data.code === 200){
                        let listData = '';
                        $.each(data.data.items,function(i,d){
                            listData += `<tr>
                                    <td><input data-id = "${ d.agentId }" type="checkbox" class="notSelectAll"></td>
                                    <td>${ i + 1 }</td>
                                    <td>${ noTd(d.agentUsername) }</td>
                                    <td>${ noTd(d.agentName) }</td>
                                    <td class="operating"><a href="javascript:" class="bg success toView">查看</a></td>
                                    <td>${ agentsLevel(d.level) }</td>
                                    <td>${ noTd(d.ratio) }%</td>
                                    <td>${ noTd(d.linkName) }</td>
                                    <td>${ noTd(d.phone) }</td>
                                    <td>${ noTd(d.email) }</td>
                                    <td>${ noTd(d.address) }</td>
                                    <td>${ noTd(d.parentAgentName) }</td>
                                    <td class="operating"></td>
                                </tr>`
                        });
                        list.append(listData);

                        //分页
                        pageCount = data.data.totalPages;
                        vpage = pageCount>10?10:pageCount;
                        if(pageCount>1){
                            $('#pagesA').show();
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
                                $('#pagesA').hide();
                            }
                        }
                    }else{
                        $('#pagesA').hide();
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        },
        pageTo:function(_this){
            let max = parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
            let val = parseInt($(_this).siblings('input').val());
            let num = (val>0?val:1)>max?max:(val>0?val:1);
            paGe = num;
            this.list(paGe,pageNum);
            $(_this).siblings('input').val(num);
        },
        toView:function(_this){
            const agentId = $(_this).parents("tr").find("td:first input").attr("data-id");
            $.ajax({
                type:'get',
                url: url + robotAgent + version1 +'/agent/device.json',
                data:{
                    "agentId":agentId
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 200){
                        let html = '';
                        const typeModel = $(".typeModel").empty();
                        $.each(data.data,function(){
                            let text = '';
                            $.each(this.models,function(){
                                text += `<label class="control-label text-muted">${ this.modelName }</label>`
                            });
                            html += `<div class="form-group">
                                        <label class="control-label col-md-4">${ this.typeName }：</label>
                                        <div class="col-sm-8">${ text }</div>
                                    </div>`;
                        });

                        layer.open({
                            type: 1,
                            skin: 'layui-layer-demo', //样式类名
                            closeBtn: 0, //不显示关闭按钮
                            anim: 2,
                            shadeClose: true, //开启遮罩关闭
                            content: `<div style="width: 300px;">${ html }</div>`
                        });

                    }else{
                        layer.msg(data.message);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        },
    };


    /*
     *   公司列表
     * */

    let companyList = {
        list:function(){
            //开始时显示数据
            let dataObject = {
                "keyword":$("#keyword").val(),
            };
            $.ajax({
                type:'get',
                url: url + robotAgent + version1 +'/agent/firm/list.json',
                data:dataObject,
                dataType:'json',
                success:function(data){
                    const list = $("#agents_list_table .list");  //将选择器赋值给常量
                    list.empty();  //清空
                    if(data.code === 200){
                        let listData = '';
                        $.each(data.data,function(i,d){
                            listData += `<tr>
                                    <td>${ i + 1 }</td>
                                    <td>${ noTd(d.name) }</td>
                                    <td>${ noTd(d.address) }</td>
                                    <td>${ noTd(d.mobileNo) }</td>
                                    <td><input data-id = "${ d.id }" type="checkbox" class="notSelectAll"></td>
                                </tr>`
                        });
                        list.append(listData);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        }
    };

    /*
    *  添加代理商 -- 弹出框 -- 确定 ids
    * */
    function addAgents(ids){
        $.ajax({
            type:'post',
            url: url + robotAgent + version1 +'/agent/save.json',
            data:JSON.stringify({
                'agentId':agentId,
                "children":ids
            }),
            dataType:'json',
            contentType: 'application/json',
            success:function(data){
                if(data.code === 200){
                    layer.msg("添加成功！");
                    list.list(paGe,pageNum);
                }else{
                    layer.msg(data.message);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
        });
    }


    /*
    *   选择代理设备类型和上级代理商
    * */
    let age = {
        "id":null,
        "agentId":null,
        ageZtree:function(){
            $.ajax({
                type:'get',
                url: url + robotAgent + version1 +'/agent/list.json',
                data:{
                    "page":1,
                    "size":10000
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 200){
                        let treeObj = $.fn.zTree.init($("#treeDemo"), setting, data.data.items);
                        treeObj.expandAll(true);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        },
        ztreeClick:function(event, treeId, treeNode){
            $(".superiorShow").val(treeNode.agentName);
            age.typeModel(treeNode.agentId);
            age.agentId = treeNode.agentId;
        },
        typeModel:function(agentId){
            $.ajax({
                type:'get',
                url: url + robotAgent + version1 +'/agent/device.json',
                data:{
                    "agentId":agentId
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 200){
                        let html = '';
                        const typeModel = $(".typeModel").empty();
                        $.each(data.data,function(){
                            let text = '';
                            $.each(this.models,function(){
                                text += `<label class="control-label"><input data-id = "${ this.modelId }" type="checkbox" name="status">${ this.modelName }</label>`
                            });
                            html += `<div class="form-group">
                                    <label class="control-label col-md-3">${ this.typeName }</label>
                                    <div class="col-sm-7">${ text }</div>
                                </div>`;
                        });
                        typeModel.append(html);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        },
        determine:function(){
            const idEle = $(".typeModel .control-label input:checked");
            let ids = [];
            idEle.each(function(){
                ids.push($(this).attr("data-id"))
            });
            if(!this.agentId){
                layer.msg("上级代理商不能为空！");
                return false;
            }
            if(ids.length <= 0){
                layer.msg("型号不能为空！");
                return false;
            }

            $.ajax({
                type:'post',
                url: url + robotAgent + version1 +'/agent/setting.json',
                data:{
                    "agentId":this.id,
                    "parentAgentId":this.agentId,
                    "modelIds":ids
                },
                dataType:'json',
                traditional:true,
                success:function(data){
                    if(data.code === 200){
                        layer.msg("修改成功！");
                        $("#agentsPop").toggleClass("show");
                    }else{
                        layer.msg(data.message);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        }
    };






