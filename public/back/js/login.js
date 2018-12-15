// 初始化表单校验插件
// bootstrap-validator插件会在表单提交的时候进行校验，如果校验成功了，表单会继续提交.
// 但是如果校验失败了，就会阻止表单的提交。
// 为了防止全局污染，引入入口函数
$(function() {
  // _______________________________________________________________
  // 1.功能一进行表单校验
  //使用表单校验插件
  // 校验要求: (1) 用户名不能为空
  //           (2) 密码不能为空, 且必须是 6-12 位
  $('#form').bootstrapValidator({
    // 配置图标 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //  指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        //校验规则
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6之间'
          },
          callback: {
            message: '用户名不存在'
          }
        }
      },
      password: {
        //校验规则
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '用户名长度必须在6到12之间'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    }
  })

  // _____________________________________________________________________________

  // 2.功能二进行登录请求，通过ajax请求
  // 表单校验插件有一个特点, 在表单提交的时候进行校验
  // 如果校验成功, 继续提交, 需要阻止这次默认的提交, 通过 ajax 进行请求提交
  // 如果校验失败, 默认会阻止提交
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault()
    console.log($('#form').serialize())
    //使用ajax提交逻辑
    $.ajax({
      url: '/employee/employeeLogin',
      type: 'post',
      dataType: 'json',
      data: $('#form').serialize(),
      success: function(e) {
        console.log(e)
        //登录成功
        if (e.success) {
          location.href = 'index.html'
        }
        // 登录失败,分两种情况，用户名正确密码错误，密码正确用户名错误
        if (e.error === 1000) {
          // alert('用户名不存在')
          //重新设置表单状态
          // updateStatus
          // 参数1: 字段名称
          // 参数2: 校验状态
          // 参数3: 校验规则, 可以设置提示文本
          $('#form')
            .data('bootstrapValidator')
            .updateStatus('username', 'INVALID', 'callback')
        }
        if (e.error === 1001) {
          // alert('密码错误')
          $('#form')
            .data('bootstrapValidator')
            .updateStatus('password', 'INVALID', 'callback')
        }
      }
    })
  })

  //   ____________________________________________________________________________
  // 3.功能3重置功能
  $('#box').click(function() {
    alert(2121)
    // 除了重置文本, 还要重置校验状态
    $('#form')
      .data('bootstrapValidator')
      .resetForm()
  })
  console.log($('[type=reset]'))
})
