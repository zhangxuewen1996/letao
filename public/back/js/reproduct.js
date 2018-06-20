$(function () {
  // 动态将页面渲染出阿里
  var page = 1;
  var pageSize = 5;
  // 定义这个数组用来存储上传图片得到的结果，一遍后面对地址的拼串，和表单的校验
  var imgs = [];
  // 调用渲染
  render();

  function render() {
    // 发送ajax请求
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
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
          // 改变按钮的值
          itemTexts: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          useBootstrapTooltip: true,
          onPageClicked: function (a, b, c, p) {
            page = p,
              render();
          }
        });
      }
    });
  };

  //改变按钮链表的值
  $(".addBtn").on("click", function () {
    // 发送ajax请求，动态生成dropdown-menu下的li
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100,
      },
      success: function (info) {
        $(".dropdown-menu").html(template("tpl2", info));
      }
    })

  });

  // 注册按钮链表注册事件
  $(".dropdown-menu").on("click", "a", function () {
    $(".dropdown-text").text($(this).text());
    $("[name='brandId']").val($(this).data("id"));
    // 这里需要在改变value值的同时，改变了dropdown-menu的值
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");
  });

  // 上传图片的功能
  $("#fileupload").fileupload({
    done: function (e, data) {
      if (imgs.length >= 3) {
        return;
      }
      imgs.push(data.result);
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100">');
      // 手动更高校验的状态
      if (imgs.length == 3) {
        $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
      } else {
        $("form").data("bootstrapValidator").updateStatus("brandLogo", "INVALID");
      }
    }
  });

  // 表单校验
  $("form").bootstrapValidator({
    // 这里默认对disabled hidden visable的不校验
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
            message: "请选择一个二级分类",
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品的名称",
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品的描述",
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品的库存",
          },
          regexp: {
            regexp: /^[1-9]\d{1,4}$/,
            message: "请输入正确的库存数量",
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品的尺码",
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: "请输入正确的尺码",
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品的原价",
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品的现价",
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传3张图片",
          }
        }
      },
    }
  });

  // 注册表单校验成功事件
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();
    var para = $("form").serialize();
    para += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    para += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    para += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;
    //发送ajax请求
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: para,
      success: function (info) {
        if (info.success) {
          //隐藏模态框
          $("#addProduct").modal("hide");
          //重新渲染
          page = 1;
          render();
          // 改变下拉菜单内的文字
          $(".dropdown-text").text("请选择二级分类");
          // 重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          // 将图片清除
          $(".img_box img").remove();
        }
      }
    })

  });
});