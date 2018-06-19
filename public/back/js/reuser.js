$(function () {
  var page = 1;
  var pageSize = 10;
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        $("tbody").html(template("tpl", info));

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });
      }
    });
  }

  // 禁用和启用
  $("tbody").on("click", ".btn-sm", function () {
    var id = $(this).data("id");
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    $(".icon_confirm").off().on("click", function () {
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function (info) {
          if (info.success) {
            $("#refuse").modal("hide");
            render();
          }
        }
      })
    });
  });

});