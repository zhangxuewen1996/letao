$(function () {
  // 获取验证码
  $(".btn-code").on("click", function () {
    var count = 5;
    // 警用按钮
    $(this).prop("disabled", true).addClass("disabled").text("发送中...");
    // 发送ajax请求
    $.ajax({
      type: "get",
      url: "/user/vCode",
      success: function (info) {
        console.log(info);
        var timeId = setInterval(function () {
          count--;
          $(".btn-code").text(count + "秒重新发送");
          if (count <= 0) {
            clearInterval(timeId);
            $(".btn-code").prop("disabled", false).removeClass("disabled").text("获取验证码");
          }
        }, 1000);
      }
    });
  });

  // 表单校验
  $(".btn_register").on("click", function (e) {
    e.preventDefault();
    var username = $("[name='username']").val();
    var password = $("[name='password']").val();
    var repassword = $("[name='repassword']").val();
    var mobile = $("[name='mobile']").val();
    var vCode = $("[name='vCode']").val();
    if (!username) {
      mui.toast('请输入用户名', {
        duration: 'long',
        type: 'div'
      });
      return false;
    };
    if (!repassword) {
      mui.toast('请确认用户密码', {
        duration: 'long',
        type: 'div'
      });
      return false;
    };
    if (password != repassword) {
      mui.toast('用户密码和确认密码不一致', {
        duration: 'long',
        type: 'div'
      });
      return false;
    };
    if (!mobile) {
      mui.toast('请输入手机号码', {
        duration: 'long',
        type: 'div'
      });
      return false;
    };
    if (!/1[3-9]\d{9}/.test(mobile)) {
      mui.toast('手机号码格式不正确', {
        duration: 'long',
        type: 'div'
      });
      return false;
    };
    if (!vCode) {
      mui.toast('请输入验证码', {
        duration: 'long',
        type: 'div'
      });
      return false;
    };

    // 发送ajax请求
    $.ajax({
      type: "post",
      url: "/user/register",
      data: $(".myForm").serialize(),
      success: function (info) {
        console.log(info);
        if (info.success) {
          mui.toast('一秒后跳转到登录页', {
            duration: 1000,
            type: 'div'
          });
          setTimeout(function () {
            location.href = "login.html";
          }, 1000)
        }
      }
    });
  })
});