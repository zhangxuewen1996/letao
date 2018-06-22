$(function () {
  // 获取传入的参数
  function getKey() {
    // 首先需要获取传过来的地址中key的值
    var obj = {};
    var key = location.search;
    key = decodeURI(key);
    // 去掉获取到的前面的？
    key = key.slice(1);
    // 去掉获取到的字符串中的&符
    key = key.split("&")
    key.forEach(function (e) {
      var k = e.split("=")[0];
      var v = e.split("=")[1];
      obj[k] = v;
    });
    return obj;
  }
  // 获取key的值，将key的值赋值给搜索框
  var txt = getKey().key;
  $(".lt_search input").val(txt);

  var page = 1;
  var pageSize = 10;

  // 封装render函数
  function render() {
    $(".product").html('<div class = "loading"></div>');
    // 创建一个对象
    var obj = {
      page: page,
      pageSize: pageSize,
      proName: txt
    };

    // 判断是否需要添加最后的一个参数
    var $select = $(".lt_sort li.now");
    // console.log($select);
    if ($select.length > 0) {
      var type = $select.data("type");
      var value = $select.find("span").hasClass("fa-angle-up") ? 1 : 2;
      console.log(value);
      obj[type] = value;
    }

    // 发送ajax请求
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: obj,
      success: function (info) {
        console.log(info);
        // 延迟一秒出现
        setTimeout(function () {
          $(".product").html(template("tpl", info));
        }, 1000);
      }
    });
  }

  render();

  // 点击搜索发送ajax重新渲染
  $(".btn-search").on("click", function () {
    // 将排序中的所有去除now类，全部换成下箭头
    $(".lt_sort li").removeClass('now').find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
    txt = $(".lt_search input").val();
    render();
  });

  // 点击进行切换排序
  $(".lt_sort li[data-type]").on("click", function () {
    // 对于不含有now类的li
    if (!$(this).hasClass("now")) {
      $(this).addClass("now").siblings().removeClass("now");
      // 让所有的span都向下
      $(".lt_sort span").addClass('fa-angle-down').removeClass('fa-angle-up');
    } else {
      // 对于含有now类的li应该改变其中的上下箭头
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    render();
  });
});