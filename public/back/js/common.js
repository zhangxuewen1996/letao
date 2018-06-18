// 最开始的时候需要检查用户是否登录
// 只要当页面是首页的时候才不要发送ajax请求
if (location.href.indexOf("login.html") == -1) {
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    success: function (info) {
      if (info.error) {
        location.href = "login.html";
      }
    }
  });
}

$(document).ajaxStart(function () {
  //开启进度条
  NProgress.start();
});

$(document).ajaxStop(function () {
  // 关闭进度条
  NProgress.done();
});

// 点击分类显示二级目录
$(".child").prev().on("click", function () {
  $(this).next().stop(true).slideToggle();
});
$(".icon_menu").on("click", function () {
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
});

// 点击退出按钮退出系统
$(".icon_exit").on("click", function () {
  //发送ajax请求
  $.ajax({
    type: "get",
    url: "/employee/employeeLogout",
    success: function (info) {
      if (info.success) {
        location.href = "login.html";
      }
    }
  });
});