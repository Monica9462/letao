$(function() {
  // 一进到页面开始发送ajax，渲染头像部分
  $.ajax({
    url: '/user/queryUserMessage',
    type: 'get',
    dataType: 'json',
    success: function(e) {
      console.log(e)
      // 根据后台的返回结果, 如果是 error 拦截到登陆页
      if (e.error === 400) {
        // 拦截到登录页
        location.href = 'login.html'
        return
      }
      // 已登录, 返回了用户信息
      var htmlStr = template('userTpl', e)
      $('#userInfo').html(htmlStr)
    }
  })

  // 退出功能

  $('#logout').click(function() {
    //   发送ajax退出
    $.ajax({
      url: '/user/logout',
      type: 'get',
      dataType: 'json',
      success: function(e) {
        console.log(e)
        if (e.success) {
          location.href = 'login.html'
        }
      }
    })
  })
})
