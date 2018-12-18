$(function() {
  // 一进到user.html就发送ajax请求开始渲染页面
  var currentPage = 1
  var pageSize = 5
  var currentId //当前修改的用户id
  var isDelete //当前修改的用户状态
  render() //   一进到页面就开始调用render方法

//   1.1 封装渲染页面的方法
  function render() {
    $.ajax({
      url: '/user/queryUser',
      type: 'get',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(e) {
        console.log(e)

        // template( 模板id, 数据对象 )  在模板中可以任意使用数据对象的所有属性
        var htmlStr = template('tml', e)

        $('tbody').html(htmlStr)

        // 1.2根据返回的数据, 实现动态渲染分页插件
        $('#paginator').bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          //当前号
          currentPage: e.page,
          // 总页数
          totalPages: Math.ceil(e.total / e.size),

          // 添加页码点击事件
          onPageClicked: function(a, b, c, page) {
            console.log(page)
            // 更新当前页
            currentPage = page //没有这一步就没法重新渲染页面
            //重新渲染页面
            render()
          }
        })
      }
    })
  }



  // 2.给所有的按钮, 添加点击事件 (通过事件委托注册)
  $('tbody').on('click', '.btn', function() {
    // 点击显示模态框
    //  alert(1)
    $('#userModal').modal('show')
    // 获取存储的 id
    currentId = $(this)
      .parent()
      .data('id')
    // 1 启用状态, 0 禁用状态, 给后台传几, 就是将用户改成对应状态
    // 禁用按钮 ? 0 : 1
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1
  })



    // 3.点击模态框确认按钮, 发送请求, 完成启用禁用功能

    $('#submitBtn').click(function () {
        $.ajax({
           url:'/user/updateUser',
           type:'post',
           data:{
               id:currentId,
               isDelete:isDelete
           },
           dataType:'json',
           success:function (e) {
               console.log(e)
              if (e.success) {
                  // 修改成功/,关闭模态框
                  $('#userModal').modal('hide')
                  //重新渲染页面
                  render()
              } 
           }
        })
    })
})
