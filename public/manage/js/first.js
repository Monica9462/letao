$(function() {
  //一进到页面就发送ajax请求，动态渲染表格以及整个first.html页面
  var currentPage = 1 //当前页
  var pageSize = 5 //每页条数

  //1.1一进到页面就发送ajax请求，调用render方法
  render()
  function render() {
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      type: 'get',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(e) {
        console.log(e)
        var htmlStr = template('addTml', e)
        $('tbody').html(htmlStr)
        // 表格渲染完成

        // 1.2开始引入分页插件
        // 根据返回数据, 完成初始化
        $('#paginator').bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: e.page,
          // 总页数
          totalPages: Math.ceil(e.total / e.size),

          // 添加点击事件
          onPageClicked: function(a, b, c, page) {
            console.log(page)
            // 更新当前页
            currentPage = page //没有这一步无法重新渲染当前页面
            //重新渲染当前页面
            render()
          }
        })
      }
    })
  }

  //2.给添加按钮, 添加点击事件, 显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal('show')
  })

  // 3. 调用表单校验插件, 完成校验
  $('#form').bootstrapValidator({
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    // 校验字段     先给input设置name
    fields: {
      categoryName: {
        //根据input的name属性值来写的
        // 校验规则
        validators: {
          // 非空
          notEmpty: {
            // 提示信息
            message: '请输入一级分类名称'
          }
        }
      }
    }
  })

  // 4. 阻止默认的提交, 通过 ajax 提交
  $('#form').on('success.form.bv', function(e) {
    // 阻止默认的提交
    e.preventDefault()
    // 发送 ajax
    $.ajax({
      url: '/category/addTopCategory',
      type: 'post',
      data: $('#form').serialize(), //不懂这里
      dataType: 'json',
      success: function(e) {
        console.log(e)
        if (e.success) {
          // 关闭模态框
          $('#addModal').modal('hide')
          // 重新渲染第1页
          currentPage = 1
          //重新渲染页面
          render()

          // 重置表单内容
          // resetForm(true)  表示内容和状态都重置
          // resetForm()      只重置状态
          $('#form')
            .data('bootstrapValidator')
            .resetForm(true)
        }
      }
    })
  })
})
