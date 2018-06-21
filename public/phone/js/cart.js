$(function () {
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    success: function (info) {
      console.log(info);
      if (info.error) {
        location.href = "login.html"
      }
    }
  });
});