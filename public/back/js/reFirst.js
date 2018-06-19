$(function () {
  var page = 1;
  var pageSize = 7;

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
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
        })
      }
    });
  }

  // 表单校验
  $("form").bootstrapValidator({
    // 1。这里需要注意由于bootstrapValidator默认会不校验type为hidden disabled not(:visible)
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一个一级分类的名称"
          }
        }
      }
    }
  });

  // 验证成功事件
  $("form").on("success.form.bv", function () {
    // 发送ajax请求
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("form").serialize(),
      success: function (info) {
        if (info.success) {
          $("#add").modal("hide");
          page = 1;
          render();
        }
      }
    })
  });
});