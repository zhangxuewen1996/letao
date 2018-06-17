$(function () {
  // 初始化表单校验
  $("form").bootstrapValidator({
    fields: {
      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空",
          },
          stringLength: {
            min: 3,
            max: 6,
            message: "用户名应为3-6位"
          },
          callback: {
            message: "用户名不正确",
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度应为6-12位"
          },
          callback: {
            message: "密码不正确",
          }
        }
      }
    },

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    },
  });

  // 发送ajax请求
  // 注册表验证成功事件
  // 获取表单实例验证对象
  var $validator = $("form").data("bootstrapValidator");
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();
    // 使用ajax发送请求
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("form").serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error == 1000) {
          $validator.updateStatus("username", "INVALID", "callback");
        };
        if (info.error == 1001) {
          $validator.updateStatus("password", "INVALID", "callback");
        }
      }
    });
  });

  // 重置表单
  $("[type='reset']").on("click", function () {
    $validator.resetForm(true);
  });

});