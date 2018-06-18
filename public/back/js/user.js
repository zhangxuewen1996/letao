$(function () {
  // 发送ajax请求
  var page = 1;
  var pageSize = 10;

  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: page,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);

        // 显示分页器
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            page = page;
            render();
          }
        });
      }
    });
  }

  render();

  $("tbody").on("click", ".btn-sm", function () {
    var id = $(this).data("id");
    var isDelete = $(this).hasClass("btn-danger") ? 0:1;
    console.log(id);
    console.log(isDelete);
    //点击确认按钮禁用
    $(".icon_confirm").on("click", function () {
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete: isDelete,
        },
        success: function (info) {
          if (info.success) {
            $(".modal-forbidden").modal("hide");
            // $("#forbidden").addClass("btn-primary");
            render();
          }
        }
      });
    });
  });


});