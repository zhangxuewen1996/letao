$(function () {
  // 进入页面发送ajax,获取一级分类
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    success: function (info) {
      $(".category_left ul").html(template("firstTpl", info));

      // 在自动更新一级分类的同时应该将第一个对应的二级分类给渲染出来
      renderSecond(info.rows[0].id);
    }
  });

  // 渲染二级分类
  function renderSecond(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      // 必须要参数
      data: {
        id: id
      },
      success: function (info) {
        $(".category_right ul").html(template("secondTpl", info));
      }
    })
  };

  // 注册点击事件 
  $('.category_left').on("click", "li", function () {
    // 获取点击的一级分类的id
    var id = $(this).data("id");
    $(this).addClass("now").siblings().removeClass("now");
    renderSecond(id);
    // 在render之后手动将右边的滑动最上面
    // mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0,0,1);//100毫秒滚动到顶
    mui('.category_right .mui-scroll-wrapper').scroll().scrollTo(0, 0, 1);
  });
});