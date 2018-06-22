$(function () {
  // 获取地址栏中的参数
  function getTxt() {
    // 根据地质获取到key的值
    var key = location.search;
    // 转换成中文
    key = decodeURI(key);
    // 减去前面的？
    key = key.slice(1);
    // 用去除&符，生成一个数组
    key = key.split("&");
    var obj = {};
    key.forEach(function (e) {
      var k = e.split('=')[0];
      var v = e.split('=')[1];
      obj[k] = v;
    });
    return obj;
  }
  var txt = getTxt().key;
  var page = 1;
  var pageSize = 10;

  // 分装一个render方法
  function render() {
    //运行动画
    $(".product").html('<div class="loading"></div>');
    // 用一个对象来存储发送需要的参数
    var obj = {
      page: page,
      pageSize: pageSize,
      proName: txt
    };

    // 判断是否需要最后一个参数
    //有now这个类的元素最多只有一个
    var $select = $(".lt_sort li.now");
    if ($select.length > 0) {
      var type = $select.data("type");
      var value = $select.find("span").hasClass("fa-angle-down") ? 2 : 1;
      obj[type] = value;
    }

    // 发送ajax请求
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: obj,
      success: function (info) {
        setTimeout(function () {
          $(".product").html(template("tpl", info));
        }, 1000);
      }
    });
  };

  render();

  // 点击搜索按钮重新render

  $(".btn-search").on("click", function () {
    txt = $(".lt_search input").val();
    render();
  });

  // 点击li改变颜色
  $(".lt_sort li[data-type]").on("click", function () {
    // 对于自己种没有now的类的
    if (!$(this).hasClass("now")) {
      // 当前的加now，其余的不加
      $(this).addClass("now").siblings().removeClass("now");
      // 所有的方向都向下
      $(".lt_sort li").find("span").addClass("fa-angle-down").removeClass("fa-angle-up");
    } else {
      // 有now类，切换上下箭头
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    render();
  });

});