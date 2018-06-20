$(function () {
  //点击登录按钮时获取表单的值
  $(".btn-login").on("click", function () {
    if ($("form").serialize() == "") {
      $("body").append($("<p>请输入用户名</p>"));
    }
  });
});