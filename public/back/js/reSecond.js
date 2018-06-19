$(function () {
  var page = 1;
  var pageSize = 5;
  render();
  // 根据生成结构
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        $("tbody").html(template("tpl", info));

        // 生成分页器
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
  };

  // 点击添加分类按钮发送ajax请求,动态生成按钮式下拉链表
  $(".lt_main button.btn").on("click", function () {
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

  // 点击dropdown下的a注册事件
  $(".dropdown-menu").on("click", "a", function () {
    $(".dropdown-text").text($(this).text());
    $("[name='categoryId']").val($(this).data("id"));
    // 由于更改的下拉框和上传照片空间并不是表单的元素，所以这里需要手动调整校验的状态
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

  // 上传文件
  $("#uploadPic").fileupload({
    dataType: "json",
    done: function (e, data) {
      $(".img_box img").attr("src", data.result.picAddr);
      $("[name='brandLogo']").val(data.result.picAddr);
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

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
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一个一级分类名称",
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请选择一个二级分类名称",
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请选择一张图片上传",
          }
        }
      },

    }
  });

  // 表单验证成功发送ajax请求
  $("form").on("success.form.bv", function () {
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("form").serialize(),
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 隐藏模态框
          $("#add-sec").modal("hide");
          page = 1;
          render();
        }
      }
    })
  });

});