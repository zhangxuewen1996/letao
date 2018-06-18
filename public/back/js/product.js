$(function () {
  var pageNum = 1;
  var pageSize = 2;

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: pageNum,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: pageNum,
          totalPages: Math.ceil(info.total / info.size),
          //改变显示上一页下一页的值
          itemTexts: function (type,  page,  current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "末页";
              case "page":
                return page;
            };
          },
          onPageClicked: function (a, b, c, page) {
            pageNum = page;
            render();
          },
        });
      }
    });
  };
  render();
});