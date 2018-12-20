$(function() {
  // 1.1一进到页面就要发送ajax请求,动态渲染表格
  var currentPage = 1
  var pageSize = 3
  render()
  function render() {
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(e) {
        console.log(e)
        //  开始渲染
        var htmlStr = template('addTml', e)
        $('tbody').html(htmlStr)

        //1.2 开始使用分页插件
        $('#paginator').bootstrapPaginator({
          //版本号
          bootstrapMajorVersion: 3,
          //当前页
          currentPage: e.page,
          //总页数
          totalPages: Math.ceil(e.total / e.size),

          // 添加点击事件
          onPageClicked: function(a, b, c, page) {
            // 更新当前页
            currentPage = page
            //重新渲染页面
            render()
          }
        })
      }
    })
  }

  //2.点击添加分类按钮, 显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal('show')
    // 显示模态框, 就立刻发送ajax请求, 请求一级分类的全部数据, 渲染下拉列表
    // 通过 page: 1, pageSize: 100, 获取数据, 模拟获取全部数据的接口
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function(e) {
        console.log(e)
        var htmlStr = template('ZF', e)
        $('.dropdown-menu').html(htmlStr)
      }
    })
  })

  // 3. 给下拉列表的 a 注册点击事件, 让下拉列表可选 (通过事件委托注册)
  $('.dropdown-menu').on('click', 'a', function() {
    //获取a的文本
    var text = $(this).text()
    // 设置给按钮
    $('#dropdownText').text(text)
    // 获取a存的id  一级分类id
    var id = $(this).data('id')
    // 赋值给隐藏域 (input:hidden)
    $('[name="categoryId"]').val(id)
    // 更新隐藏域的校验状态成 校验成功
    $('#form')
      .data('bootstrapValidator')
      .updateStatus('categoryId', 'VALID')
  })

  // 4. 调用fileupload方法完成文件上传初始化
  /*
   * 思路: 选择完图片完成预览时, 发送了一个异步文件上传请求, 真正预览时, 文件已经上传到了服务器
   * 使用插件步骤:
   *   1. 引包   注意依赖问题
   *   2. 指定   name后台接收的name值    data-url 指定后台接口地址
   *   3. 使用 fileupload 初始化, 配置 dataType 和 done 方法即可* */
  $('#fileupload').fileupload({
    dataType: 'json',
    // e 事件对象, data 数据
    // 文件上传完成时, 响应回来时调用 (类似于success)
    done: function(e, data) {
      console.log(data)
      var result = data.result // 后台返回的对象
      var picUrl = result.picAddr // 图片路径

      // 设置给 img src
      $('#imgBox img').attr('src', picUrl)
      // 设置图片地址给隐藏域, 用于提交
      $('[name="brandLogo"]').val(picUrl)
      // 更新隐藏域的校验状态, 为成功
      $('#form')
        .data('bootstrapValidator')
        .updateStatus('brandLogo', 'VALID')
    }
  })

  // 5. 进行表单校验插件初始化
  $('#form').bootstrapValidator({
    // 配置排除项, 对隐藏域也进行校验
    excluded: [], //里面有三个值,这里为了隐藏域也能被校验才被去掉
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    fields: {
      categoryId: {
        //input里面name的属性值
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        //input里面name的属性值
        validators: {
          notEmpty: {
            message: '请选择二级分类名称'
          }
        }
      },

      brandLogo: {
        //input里面name的属性值
        validators: {
          notEmpty: {
            message: '请选择图片'
          }
        }
      }
    }
  })

  // 6. 阻止默认的提交, 通过ajax提交 (注册表单校验成功事件)
  $('#form').on('success.form.bv', function(e) {
    e.preventDefault() // 阻止默认的提交
    // 发送ajax请求进行提交
    $.ajax({
      url: '/category/addSecondCategory',
      type: 'post',
      data: $('#form').serialize(), //获取了form表单内所有的参数属性值传给后台
      dataType: 'json',
      success: function(e) {
        console.log(e)
        if (e.success) {
          //关闭模态框
          $('#addModal').modal('hide')
          //把新添加的数据渲染到第一页 currentPage=1
          currentPage = 1
          //重新渲染
          render()

          // 重置表单内容和状态
          $('#form').data('bootstrapMajorVersion').resetForm(true)
          // 由于下拉列表和图片不是表单元素, 需要手动重置
          $('#dropdownText').text('请选择一级分类')
          $('#imgBox img').attr('src','./images/none.png')
        }
      }
    })
  })
})
