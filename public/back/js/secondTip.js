$(function () {
  var page = 1;
  var pageSize = 5;
  render();

  function render() {
    // 发送ajax请求
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        $("tbody").html(template("tpl", info));

        // 显示分页器
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
    })
  }

  // 添加分类
  $(".btn-add").on("click", function () {
    // 动态渲染出一级目录
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        $(".dropdown-menu").html(template("tpl2", info));
      }
    })
  });

  // 根据值来改变对应值
  $(".dropdown-menu").on("click", "a", function () {
    $(".dropdown-text").text($(this).text());
    $("[name='categoryId']").val($(this).data("id"));
    // 这里需要手动校验成功，因为下面选址的改变不是表单元素来完成的
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

  // 上传图片
  $("#uploadfile").fileupload({
    done: function (e, data) {
      $(".form-group img").attr("src", data.result.picAddr);
      // 将图片的地址存起来
      $("[name='brandLogo']").val(data.result.picAddr);
      // 这里也需要这样校验
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  // 表单校验
  $("form").bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-hand-up',
      invalid: 'glyphicon glyphicon glyphicon-hand-down',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入一个二级分类"
          }
        }
      },
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一个一级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传一张图片"
          }
        }
      },
    }
  });

  // 表单校验成功事件
  $("form").on("success.form.bv", function (e) {
    // 阻止跳转
    e.preventDefault();
    // 发送ajax请求
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("form").serialize(),
      success: function (info) {
        if (info.success) {

          // 重新渲染
          page = 1;
          render();
          // 隐藏模态框
          $("#add").modal("hide");
          // 重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          // 清除图片
          $("[name='brandLogo'] img").attr("src", "images/none.png")
          // 将按钮链表改回原来的
          $(".dropdown-text").text("请选择一个一级分类")
        }
      }
    })
  });

});