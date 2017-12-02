	var zTree;
	var setting = {
	    view: {
	        dblClickExpand: false,
	        showLine: true,
	        selectedMulti: false
	        //expandSpeed: ($.browser.msie && parseInt($.browser.version)<=6)?"":"fast"
	    },
	    data: {
	        simpleData: {
	            enable:true,
	            idKey: "id",
	            pIdKey: "pId",
	            rootPId: ""
	        }
	    },
	    callback: {
	        onClick: zTreeClick
	    }
	};

    //初始化菜单节点树形结构
    function initMenusTree(){
        var zNodes;      
        $.ajax({
            type:"GET",
            url:"/crm/sys/auth/MenuCtrl.json",
            async:false,
            dataType:'json',
            success:function(data){
                //console.info(data);
                zNodes=data;
            }
        })
        $.fn.zTree.init($("#menusTree"), setting, zNodes);
    }
    initMenusTree();

    //表单内容设置
    function setTranResourse(name,url,type,method,status){
        $("#resourceName").val(name);
        $("#resourceUrl").val(url);
        $("#resourceType").find('option').each(function(){
            if($(this).attr('value')==type){
                $(this).attr("selected",true).siblings().attr('selected',false)
            }
        });
        $("#resourceMethod").find('option').each(function(){
            if($(this).text()==method){
                $(this).attr("selected",true).siblings().attr('selected',false)
            }
        })
        $("#resourceStatus").find('input[type=radio]').each(function(){
            if($(this).attr('value')==status){
                $(this).prop("checked",'checked').siblings().prop("checked",false);
            }
        })
    }

    //页面初始化
    function addResourse(){                      
        setTranResourse(' ',' ',1,'GET',0);
        $('.roles-content').hide();
        $('#button_menu').attr('method','add');
    };

    //未有角色载入
    function notRoles(pageNum,sizeNum,search){
        $('#pagination').html(' ');
        var zTree = $.fn.zTree.getZTreeObj("menusTree");
        var treeNode = zTree.getSelectedNodes()[0];
        $.ajax({
            type:"get",
            url:"/crm/sys/auth/MenuCtrl/out/roles.json",
            data:{'resourceId':treeNode.id,'count':-1,'page':pageNum,'size':sizeNum,'search':search},
            dataType:'json',
            success:function(data){
                var vpage=data.pageCount>5?5:data.pageCount;
                function pageListCon(page,size){
                    $.ajax({
                        type:"get",
                        url:"/crm/sys/auth/MenuCtrl/out/roles.json",
                        data:{'resourceId':treeNode.id,'count':-1,'page':page,'size':size,'search':search},
                        dataType:'json',
                        success:function(data){
                            var hasNotlist=" ";
                            for(var i=0;i<data.items.length;i++){
                                hasNotlist+='<tr><td class="td-checkbox"><input type="checkbox" name="rolebranch_out" value='+data.items[i].id+'></td><td>'+data.items[i].id+'</td><td>'+data.items[i].name+'</td></tr>';
                            }
                            $('#user_out_role tbody').html(' ').append(hasNotlist);
                        }
                    })    
                }
                if(data.pageCount>1){
                    initPagination('#pagination',data.pageCount,vpage,data.page,function(num){
                        pageListCon(num,pageSize);
                    })
                }else{
                    pageListCon(1,pageSize)
                }
            }
        }) 
    }

    //点击树的节点载入右边资源信息内容
    var pageSize=10;  //未有角色每页显示条数
    function zTreeClick(event, treeId, treeNode, clickFlag) {  
        $('.roles-content').show();
        $('#button_menu').attr('method','update');
        $('#user_out_role tbody').html(" ");
        $('#out_user2branch tbody').html(" ");
        var zTree = $.fn.zTree.getZTreeObj("menusTree");
        var treeNode = zTree.getSelectedNodes()[0];
        $.ajax({
            type:"get",
            url:"/crm/general/resource/"+treeNode.id+".json",
            dataType:'json',
            success:function(data){
                setTranResourse(data.name,data.url,data.type,data.method,data.status);
            },
        })
        notRoles(1,pageSize);        
        $.ajax({
            type:"get",
            url:"/crm/sys/auth/MenuCtrl/in/roles.json",
            dataType:'json',
            data:{'resourceId':treeNode.id},
            success:function(data){
                //console.info(data)
                var userRoleList;
                if(data.length!=0){
                    for(var i=0;i<data.length;i++){
                       userRoleList+='<tr><td class="td-checkbox"><input type="checkbox" name="rolebranch_in" value='+data[i].id+'></td><td>'+data[i].id+'</td><td>'+data[i].name+'</td></tr>';
                    }
                }
                $('#out_user2branch tbody').append(userRoleList);
            }
        })
    }; 

    //保存资源
    function saveResourse(){  
        var zTree = $.fn.zTree.getZTreeObj("menusTree");
        var treeNode=zTree.getSelectedNodes()[0];
        var resourceId;
        if($('#button_menu').attr('method')=='add'){
            resourceId=5;
        }else{
            resourceId=treeNode.seqid;
        }
        /*$('#menusForm').validate();*/
        if($("#menusForm").valid()){
            $.ajax({
                    type:"post",
                    url:"/crm/sys/auth/MenuCtrl/Update.json",
                    data:{'name':$('#resourceName').val(),
                    'url':$('#resourceUrl').val().ltrim(),
                    'resourceType':1,
                    'resourceMethod':$('#resourceMethod').find('option:checked').text(),
                    'resourceId':resourceId,
                    'status':$('#resourceStatus').find('input[type=radio]:checked').attr('value'),
                    'method':$('#button_menu').attr('method'),
                    },
                    dataType:'json',
                    success:function(data){
                        returnMessage(1,data.message);  
                        addResourse();
                        initMenusTree();
                    },
                    error:function(data){
                        returnMessage(2,data.message);  
                    }
                })
        }
    };

    //删除资源
    function removeResourse() {
        var zTree = $.fn.zTree.getZTreeObj("menusTree");
        var treeNode = zTree.getSelectedNodes()[0];
        //console.info(treeNode.pId)
        if (!treeNode) {
            returnMessage(0,"请先选择一个节点");
            return;
        }else if(treeNode.pId==""){
            returnMessage(2,'不能删除根节点')
        }else{
            BootstrapDialog.show({
                'type':'type-warning',
                'title':"确认提示",
                'message':"你确定要删除吗？",
                buttons:[
                        {
                            label: '确定',
                            cssClass: 'btn-primary',
                            action: function(dialog) {
                                 dialog.close(); 
                                $.ajax({
                                    type:'post',
                                    url:'/crm/sys/auth/MenuCtrl/Delete.json',
                                    data:{"resourceId":treeNode.seqid},
                                    dataType:'json',
                                    success:function(data){
                                        initMenusTree();
                                        returnMessage(1,'删除成功');
                                    },
                                    error:function(data){
                                        returnMessage(2,'删除失败');
                                    }
                                })
                                setTranResourse(' ',' ',1,'GET',0);
                            }
                        }
                        ,{
                          label: '取消',
                          cssClass: 'btn-warning',
                          action: function(dialog) {
                              dialog.close();
                        }
                    }]
            }); 
        }     
    }; 
     
    //角色分配
    function addRole(){
        var zTree = $.fn.zTree.getZTreeObj("menusTree");
        var treeNode = zTree.getSelectedNodes()[0];
        var roleIdArr=[];
        $("input[name='rolebranch_out']:checkbox:checked").each(function(){
            roleIdArr.push($(this).val())
            $(this).attr("checked","false");
        });
        if(roleIdArr!=''){
            $("input[name='rolebranch_out']:checkbox:checked").each(function(index){
                 $(this).attr("name","rolebranch_in").attr("checked",false);
                 $(this).parent('td').parent('tr').clone().appendTo("#user_in_role");
                 $(this).parent('td').parent('tr').remove();
            }); 
            $.ajax({
                type:'post',
                url:'/crm/sys/auth/MenuCtrl/Save.json',
                data:{'resourceId':treeNode.id,'roleId':roleIdArr.join(',')},
                dataType:'json',
                success:function(data){
                    notRoles(1,pageSize)
                }
            })
        }else{
            returnMessage(0,'请选择一个未有角色')
        }
    }
 
    function removeRole(){
        var zTree = $.fn.zTree.getZTreeObj("menusTree");
        console.info(zTree)
        var treeNode = zTree.getSelectedNodes()[0];
        console.info(treeNode)
        var roleIdArr=[];
        $("input[name='rolebranch_in']:checkbox:checked").each(function(){
            roleIdArr.push($(this).val())
            $(this).attr("checked","false");
        });
        if(roleIdArr!=''){
            $("input[name='rolebranch_in']:checkbox:checked").each(function(index){
                $(this).attr("name","rolebranch_out").attr("checked",false);
                $(this).parent('td').parent('tr').remove();
            }); 
            $.ajax({
                type:'post',
                url:'/crm/sys/auth/MenuCtrl/Remove.json',
                data:{'resourceId':treeNode.id,'roleId':roleIdArr.join(',')},
                dataType:'json',
                success:function(data){
                    notRoles(1,pageSize);
                    console.info(data)
                }
            })
        }else{
            returnMessage(0,'请选择一个已有角色')
        }
    }

    //未有角色搜索
    function outRoleSearch(){
        var searchKey=$('.out-role-search input[type=text]').val();
        var zTree = $.fn.zTree.getZTreeObj("menusTree");
        var treeNode = zTree.getSelectedNodes()[0];
            $.ajax({
                type:'get',
                url:'/crm/sys/auth/MenuCtrl/out/roles.json',
                data:{'resourceId':treeNode.id,'page':1,'size':pageSize,'search':searchKey},
                success:function(data){
                    notRoles(1,pageSize,searchKey);      
                }
            })
    }
    

	
