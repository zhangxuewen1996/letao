$(function () {
  var pageNum = 1;
  var pageSize = 5;

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: pageNum,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: pageNum,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            pageNum = page;
            render();
          }
        });
      }
    });
  };
  render();


  // 表单校验
  var $form = $("#form");
  $form.bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一级分类的名称"
          }
        }
      }
    }
  });

  // 添加分类
  $("#form").on("success.form.bv", function (e) {
    console.log(1);
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("form").serialize(),
      success: function (info) {
        if (info.success) {
          $(".modal-add").modal("hide");
          pageNum = 1;
          render();
          //重置表单
          $("#form")[0].reset();
        }
      }
    });
  });
});