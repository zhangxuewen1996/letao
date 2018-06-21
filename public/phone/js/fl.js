$(function () {
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    success: function (info) {
      $(".left_aside ul").html(template("tpl", info));
      // 渲染第一个二级的第一个
      renderSecond(info.rows[0].id);
    }
  });

  $(".left_aside").on("click", "li", function () {
    $(this).addClass("now").siblings().removeClass("now");
    renderSecond($(this).data("id"));
    // 将右边滑到最上面
    mui(".right_aside .mui-scroll-wrapper").scroll().scrollTo(0, 0, 1);
  });

  function renderSecond(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      success: function (info) {
        $(".right_aside ul").html(template("tpl2", info));
      }
    });
  }
});