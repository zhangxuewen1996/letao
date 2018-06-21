$(function () {
  var page = 1;
  var pageSize = 2;
  // 创建这个数组，为了存储后面传入的照片的result
  var imgs = [];
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        $("tbody").html(template("tpl", info));
        // 初始化分页器
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          itemTexts: function (type, page) {
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "末页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function (type, page) {
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "末页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          useBootstrapTooltip: true,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        })
      }
    });
  }

  // 点击添加商品获取一级分类，动态渲染到按钮式链表中
  $(".add-pro").on("click", function () {
    // 发送ajax请求
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: page,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        $(".dropdown-menu").html(template("tpl2", info));
      }
    })
  });

  // 点击下拉按钮的a获得值改变主要的值
  $(".dropdown-menu").on("click", "a", function () {
    $(".dropdown-text").text($(this).text());
    $("[name='brandId']").val($(this).data("id"));

    // 这里需要手动校验成功
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");
  });

  // 点击上传图片
  $("#file").fileupload({
    done: function (e, data) {
      // 如果超过三张就不能传入
      if (imgs.length >= 3) {
        return false;
      }
      imgs.push(data.result);
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100">');
      if (imgs.length == 3) {
        $("form").data("bootstrapValidator").updateStatus("pic", "VALID");
      } else {
        $("form").data("bootstrapValidator").updateStatus("pic", "INVALID");
      }
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
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择一个二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品的名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品的描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品的库存 "
          },
          regexp: {
            regexp: /^[1-9]\d{0,4}$/,
            message: "请输入正确的库存"
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请选择一个二级分类"
          },
          regexp: {
            regexp: /\d{2}-\d{2}/,
            message: "请输入正确的尺码"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品的原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品的现价"
          }
        }
      },
      pic: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });

  // 表单校验发送ajax请求
  $("form").on("success.form.bv", function (e) {
    // 阻止跳转
    e.preventDefault();
    var para = $("form").serialize();
    para += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    para += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    para += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: para,
      success: function (info) {
        if (info.success) {
          // 隐藏模态框
          $("#add").modal("hide");
          // 重新渲染，
          // 渲染第一页
          page = 1;
          render();
          // 重置表单名
          // $("form").data("bootstrapValidator").resetForm(true);
          $("form")[0].reset();
          // 改变按钮链表的值
          $(".dropdown-text").text("请选择二级分类");
          // 删除图片
          $(".img_box img").remove();
        }
      }
    })
  });

});