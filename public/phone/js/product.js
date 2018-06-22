$(function () {
  function getKey() {
    var key = location.search;
    key = decodeURI(key);
    key = key.slice(1);
    key = key.split("&");
    var obj = {};
    key.forEach(function (e) {
      var k = e.split("=")[0];
      var v = e.split("=")[1];
      obj[k] = v;
    });
    return obj;
  }
  var result = getKey().productId;
  console.log(result);

  // 发送ajax请求
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: result,
    },
    success: function (info) {
      console.log(info);
    }
  })

});