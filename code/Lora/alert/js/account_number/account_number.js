$(function(){
    var rlgou = JSON.parse(sessionStorage.getItem('rlgou'));
    var dataone = JSON.parse(sessionStorage.getItem('dataone'));
    var cuser_id=sessionStorage.getItem('clt');
    console.info(cuser_id)
    blurCheck('#main_form');

    function setSel(id){
        $.ajax({
              type: "POST",
              url:'/web/common/select',
              dataType: 'json',
              data:{
                type:8
              },
              success:function(e){
                  var code="";
                  var isSelected;
                  for(var i = 0;i<e.data.length;i++){
                    isSelected=(id==e.data[i].id)?'selected':'';
                    if(e.data[i] != null){
                         code += '<option class="roleid"  '+isSelected+'  value = '+e.data[i].id+'>'+e.data[i].name+'</option>';
                     }
                  }
                  $('.role_character').html(code);
                },
            error:function(data){
                returnMessage(2,data.status);
            }
          })
    }
    setSel();     
    var olength = $('.role_character').find('option').text();
    if(dataone == false){
        var id = rlgou.data.id;
        $('.login_name').val(rlgou.data.loginName);
        $('.login_name').attr("disabled", true);
        $('.name_append').val(rlgou.data.name);
        $('.number_append').val(rlgou.data.telNumber);
        if (cuser_id == rlgou.data.id) {
            $('#cur_role').html(`<span style="line-height:34px;">${rlgou.data.roleName}</span>`);
        } else {
            var _html = rlgou.data.roleId == 'fuwushangguanliyuan' ? `服务商管理员` : rlgou.data.roleId == 'yunyingshangguanliyuan' ? `运营商管理员` : rlgou.data.roleId == 'danweiguanliyuan' ? `单位管理员` : rlgou.data.roleId == 'anquanguanliyuan' ? `安全管理员` : rlgou.data.roleId == 'anquanxunjianyuan' ? `安全巡检员` : "";
            if (_html != '') {
                $('#cur_role').html(`<span style="line-height:34px;">` + _html + `</span>`);
            } else {
                setSel(rlgou.data.roleId);
            }
        }
        $('#number_append88').css('display', 'none');
        $('#number_append99').show();
        $('#number_append99').click(function () {
            var isEditPersonMsg = sessionStorage.getItem('isEditPersonMsg');
            var loginName = $('.login_name').val();
            var name = $('.name_append').val();
            var telNumber = $('.number_append').val();
            var roleId = $('.role_character').val();
            if ($('#main_form').valid()) {
                $.ajax({
                    type: "POST",
                    url: '/web/accountCtr/saveAccount',
                    dataType: 'json',
                    data: {
                        "user.loginName": loginName,
                        "user.name": name,
                        "user.telNumber": telNumber,
                        "roleId": roleId,
                        "id": id
                    },
                    beforeSend: function () {
                        $('.opering-mask').show();
                    },
                    complete: function () {
                        $('.opering-mask').hide();
                    },
                    success: function (e) {
                        if (e.code === 200) {
                            if (isEditPersonMsg == 'true') {
                                alertMsg('type-success','修改成功！','btn-success',function(dialog){//成功
                                    history.go(-1);
                                    dialog.close();
                                });
                            } else {
                                rebackList('修改成功');
                            }
                        } else {
                            returnMessage(2, e.message)
                        }
                    },
                    error: function (data) {
                        returnMessage(2, data.status);
                    }
                });
            }
        });
        $('#number_append77').click(function(){
            var isEditPersonMsg = sessionStorage.getItem('isEditPersonMsg');
            if (isEditPersonMsg == 'true') {
                history.go(-1);
            } else {
                closeTab(this);
            }
        });

    }else{
      $('#number_append99').css('display','none');
      $('#number_append88').click(function(){
        var loginName = $('.login_name').val();
        var name = $('.name_append').val();
        var telNumber = $ ('.number_append').val();
        var roleId = $('.role_character').val();
        if($('#main_form').valid()){
          $.ajax({
            type: "POST",
                  url:'/web/accountCtr/saveAccount',
                  dataType: 'json',
                  data:{
                    "user.loginName":loginName,
                    "user.name":name,
                    "user.telNumber":telNumber,
                    "roleId":roleId
                  },
                  beforeSend:function(){
                    $('.opering-mask').show();
                  },
                  complete:function(){
                          $('.opering-mask').hide();
                  },
                  success:function(e){
                      if(e.code===200){
                          rebackList('新增成功');
                      }else{
                          returnMessage(2,e.message);
                      }
                  },
              error:function(data){
                  returnMessage(2,data.status);
              }
            });
          }
        })
  
    }
});