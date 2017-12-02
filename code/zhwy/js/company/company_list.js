var Company = function (){
    this.ajax = new Util();
    this.userId = getSession('userId');
};

Company.prototype.getArgument = function(){
    var data = {};
    data.userId = this.userId;
    return data;
};
Company.prototype.getfirmList = function(){
    var _this = this;
    var data = this.getArgument();
    this.ajax.get('/web/api/v1/property/firm/firmList',data,function(res){
        if(res.code===0){
            var data = res.data;
            if(data.length>0){
                var html = '';
                $.each(data,function(i,item){
                    html +=`
                    <tr class="text-center" data-firmId="${item.firmId}" data-propertyId="${item.propertyId}">
                        <td><input type="checkbox"></td>
                        <td>${i+1}</td>
                        <td>${val(item.firmName)}</td>
                        <td><button class="btn btn-xs btn-link">查看</button></td>
                        <td>${val(item.industry)}</td>
                        <td>${val(item.linkmanName)}</td>
                        <td>${val(item.mobileNo)}</td>
                        <td>${val(item.creatorName)}</td>
                        <td>${val(item.createTime)}</td>
                        <td>${val(item.officeName)}</td>
                        <td>${val(item.status)}</td>
                        <td>
                            <button type="button" class="btn btn-info btn-xs" onclick=""><i class="fa fa-edit fa-fw"></i>启用</button>
                            <button type="button" class="btn btn-info btn-xs" onclick=""><i class="fa fa-edit fa-fw"></i>修改</button>
                            <button type="button" class="btn btn_red btn-xs" onclick=""><i class="fa fa-edit fa-fw"></i>删除</button>
                        </td>
                    </tr>
                `;
                });
                $('#list tbody').html(html);
            }
        }
    });
};

var company = new Company();
company.getfirmList();


