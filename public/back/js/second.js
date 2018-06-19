$(function () {
  var pageNum = 1;
  var pageSize = 7;

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
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
          onPageClicked: function (a, b, c, page) {
            pageNum = page;
            render();
          }
        });
      }
    });
  };
  render();

  // 点击添加分类按钮发送ajax请求
  $(".lt_main .btn").on("click", function () {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        // 这里的接口文档没有给我们具体的接口，因此使用查询的接口获取数据，将页码和每页的数量定死
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        $(".dropdown-menu").html(template("tpl2", info));
      }
    });
  });

  // 给下拉菜单按钮下的a注册点击事件
  $(".dropdown-menu").on("click", "a", function () {
    $(".dropdown-text").text($(this).text());
    $("[name='categoryId']").val($(this).data("id"));
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

  // 上传显示图片的功能
  $("#uploadPic").fileupload({
    dataType: "json",
    done: function (e, data) {
      console.log(data.result.picAddr);
      $(".img_box img").attr("src", data.result.picAddr);
      $("[name='brandLogo']").val(data.result.picAddr);
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  // 表单校验功能
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
            message: "请选择一个分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请选择一个二级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请选择一张照片"
          }
        }
      },
    }
  });

  // 表单校验成功事件
  $("form").on("success.form.bv", function () {
    // 发送ajax请求
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("form").serialize(),
      success: function (info) {
        if (info.success) {
          // 影藏模态框
          $("#add-sec").modal("hide");
          page = 1;
          render();
        }
      }
    });
  });


});