$(function(){
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
	        //onClick: zTreeClick
	    }
	};

    var zNodes;      //初始化树形结构
    $.ajax({
        type:"get",
        //url:"/crm/sys/auth/RoleCtrl/EditResoutce/admin.json",
        async:false,
        success:function(data){
        }
    })
    
    var zNodes=[{"id":"1","pId":"null","seqid":"1","name":"全国","open":true,"type":null,"checked":true,"permid":null},{"id":"2","pId":"1","seqid":"2","name":"广东","open":true,"type":null,"checked":true,"permid":null},{"id":"3","pId":"2","seqid":"3","name":"深圳","open":true,"type":null,"checked":true,"permid":null},{"id":"4","pId":"3","seqid":"4","name":"深圳市小道科技有限公司","open":true,"type":null,"checked":true,"permid":null},{"id":"5","pId":"2","seqid":"5","name":"惠州","open":true,"type":null,"checked":true,"permid":null},{"id":"7","pId":"1","seqid":"7","name":"湖南","open":true,"type":null,"checked":true,"permid":null},]
    $(document).ready(function(){
        var t = $.fn.zTree.init($("#vedioTree"), setting, zNodes);
    });

    

    $.ajax({  
        url:"http://192.168.1.51:8080/test",
        type:"post",
        dataType:'json',  
        data:{"word":"a"},  
        success:function(data) {  
           console.info(data);
        }, 
        onerror:function(data){
        	console.info(data)
        } 
    }); 

    
})