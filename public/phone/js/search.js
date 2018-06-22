$(function () {
  // 查询的功能
  // 获取localStorsge内的内容
  function getLocalStorage() {
    // 这里加一个或的条件，保证每次都能获取到一个数组
    var result = localStorage.getItem("lt_history") || "[]";
    result = JSON.parse(result);
    return result;
  }

  // 结合模板渲染出来
  function render() {
    var history = getLocalStorage();
    $(".lt_history").html(template("tpl", {
      rows: history
    }));
  };
  // 熏染
  render();

  // 清空历史记录
  // 注册委托事件
  $(".lt_history").on("click", ".btn-empty", function () {
    var btnArray = ['取消', '确定'];
    mui.confirm('你是否要清除所有的历史记录？', '温馨提示', btnArray, function (e) {
      if (e.index == 1) {
        // 清空localstorage中的lt_history
        localStorage.removeItem("lt_history");
        // 重新渲染
        render();
      }
    })

  });

  // 删除的操作哦
  $(".lt_history").on("click", ".btn-delete", function () {
    var index = $(this).data("index");
    var btnArray = ['否', '是'];
    mui.confirm('您确定要删除吗？', '温馨提示', btnArray, function (e) {
      if (e.index == 1) {
        // 先获取到对应的数组
        var history = getLocalStorage();
        // 删除对应下标的数组中的值
        history.splice(index, 1);
        console.log(history);
        // 将数组存回本地内存
        localStorage.setItem("lt_history", JSON.stringify(history));
        render();
      }
    })

  });

  // 增加的操作
  $(".btn-search").on("click", function () {
    // 获取input框中的对应的值
    var txt = $(".lt_search input").val();
    if (txt == "") {
      mui.toast('请输入搜索关键字', {
        duration: 'long',
        type: 'div'
      })
      return false;
    }
    location.href = "searchList.html?key=" + txt;
    // 清空input框中的值
    $(".lt_search input").val("");
    // 获取对应的数组
    var history = getLocalStorage();

    // 如果前面有，就删除前面的并加到最后 
    var index = history.indexOf(txt);
    if (history.indexOf(txt) != -1) {
      history.splice(index, 1);
    }
    // 限制历史记录的长度
    // 超过10删除最前面的
    if (history.length >= 10) {
      history.pop();
    }
    // 将获取到的文本放到最前面
    history.unshift(txt);
    console.log(history);
    // 将新创建的数组存回里面 
    localStorage.setItem("lt_history", JSON.stringify(history));
    render();

  });

});