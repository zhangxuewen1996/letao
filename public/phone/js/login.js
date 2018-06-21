$(function () {
  //点击登录按钮时获取表单的值
  $("[type='button']").on("click", function () {
    mui(".mui-input-row input").each(function () {
      //若当前input为空，则alert提醒 
      if (!this.value || this.value.trim() == "") {
        var label = this.previousElementSibling;
        // mui.alert(label.innerText + "不允许为空");
        mui.toast('请输入' + label.innerText, {
          duration: 'long',
          type: 'div'
        })  
        check = false;
        return false;
      }
    }); //校验通过，继续执行业务逻辑 
    // if (check) {
    //   mui.alert('验证通过!')
    // }

    // 验证成功发送ajax请求
    $.ajax({
      type: "post",
      url: "/user/login",
      data: $("form").serialize(),
      success: function (info) {
        console.log(info);
        if (info.error) {
          mui.toast(info.message, {
            duration: 'long',
            type: 'div'
          })
        } else {
          location.href = "user.html";
        }
      }
    });
  });
});