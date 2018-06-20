$(function () {
  var pageNum = 1;
  var pageSize = 2;

  //渲染
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
          tooltipTitles: function (type,  page,  current) {
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
          useBootstrapTooltip: true,
          onPageClicked: function (a, b, c, page) {
            pageNum = page;
            render();
          },
        });
      }
    });
  };
  render();

  // 点击添加商品，发送ajax请求生成二级分类的名称
  $(".lt_main .btn").on("click", function () {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        $(".dropdown-menu").html(template("tpl2", info));
      }
    });
  });

  // 给dropdown-menu下所有的a注册点击事件
  $(".dropdown-menu").on("click", "a", function () {
    // 改变dropdown-menu的值
    $(".dropdown-text").text($(this).text());
    $("[name='brandId']").val($(this).data("id"));
    // 手动改变校验结果
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");

  });

  // 进行表单验证
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
            regexp: /^[1-9]\d{0,4}$/,
            message: '请输入正确的库存数'
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
            message: '请输入正确的尺码',
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
            message: "请输入商品的价格",
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请输入3张图片",
          }
        }
      }
    }
  });

  // 进行上传图片的操作n
  // 限制只能传三张照片
  var imgs = [];
  $("#fileupload").fileupload({
    type: "json",
    done: function (e, data) {
      console.log(data);
      // 限制只能传三张照片      
      if (imgs.length >= 3) {
        return false;
      }
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100" alt="">');
      imgs.push(data.result);
      if (imgs.length == 3) {
        $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
      } else {
        $("form").data("bootstrapValidator").updateStatus("brandLogo", "INVALID");
      }
    }
  });

  // 注册表单校验完成事件
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();
    var $content = $("form").serialize();
    $content += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    $content += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    $content += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;
    console.log($content);
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: $content,
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 隐藏模态框
          $("#add-sec").modal("hide");
          // 重新渲染
          // 渲染第一页
          page = 1;
          render();
          // 重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          // 将dropdown-text改为请选择二级目录
          $(".dropdown-text").text("请选择二级分类");
          // 清除图片
          $(".img_box img").remove();

        }
      }
    });
  });
});