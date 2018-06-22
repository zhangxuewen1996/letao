$(function () {

  function getLocalStorage() {
    //获取本地的localStorage
    var result = localStorage.getItem("lt_history");
    result = JSON.parse(result);
    return result;
  }

  // 查询历史记录显示
  function render() {
    // 获取到本地历史
    var history = getLocalStorage();
    // 结合魔板

    $(".lt_history").html(template("tpl", {
      rows: history
    }));
  }

  render();

  //注册清空事件
  $(".lt_history").on("click", ".btn-empty", function () {

    mui.confirm("你确定要删除所有的历史记录吗？", "温馨提示", ["取消", "确定"], function (e) {
      if (e.index == 1) {
        // 将本地的清除即可
        localStorage.removeItem("lt_history");
        render();
      }
    })

  });

  // 删除一个历史记录
  $(".lt_history").on("click", ".btn-delete", function () {
    mui.confirm("你确定要删除记录吗？", "温馨提示", ["取消", "确定"], function (e) {
      if (e.index == 1) {
        // 获取到本地的localstorage
        var history = getLocalStorage();
        var index = $(this).data("index");
        // 删除对应下标的数组中的内容,splice返回的是删除的部分
        history.splice(index, 1);
        // 在将数组存回localstorage
        localStorage.setItem("lt_history", JSON.stringify(history));
        render();
      }
    })
  });

  // 增加历史记录
  $(".btn-search").on('click', function () {
    var txt = $(".lt_search input").val();
    $(".lt_search input").val('');
    // 判断传入的是否为空
    if (txt == "") {
      mui.toast('请输入搜索关键字');
      return false;
    }

    // 点击后应该跳转到
    location.href = "product.html?key=" + txt;

    // 获取本地的
    var history = getLocalStorage();

    // 如果有重复的，将前面的去掉
    var index = history.indexOf(txt);
    // 传入的在历史记录存在
    if (history.indexOf(txt) != -1) {
      history.splice(index, 1);
    }

    // 如果长度超过10 删除最早添加的
    if (history.length >= 10) {
      history.pop();
    }

    // 将最新输入的放入history的最前面
    history.unshift(txt);
    // 将数组重新存入本地缓存
    localStorage.setItem("lt_history", JSON.stringify(history));
    render();
  });
});