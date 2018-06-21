$(function () {
  // 验证成功发送ajax请求
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    success: function (info) {
      console.log(info);
      if (info.error) {
        location.href = "login.html";
      }
      $(".mui-media").html(template("tpl", info));
    }
  });

  // 退出的判断
  $('.btn_logout').on('click', function () {
    $.ajax({
      type: "get",
      url: "/user/logout",
      success: function (info) {
        if (info.success) {
          location.href = "login.html";
        }
      }
    });
  });
});