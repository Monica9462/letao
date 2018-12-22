$(function() {
  $('#loginBtn').click(function() {
    //   alert(1)
    var username = $('#username')
      .val()
      .trim()
    var password = $('#password')
      .val()
      .trim()
    console.log(username)
    console.log(password)
    if (username === '') {
      mui.toast('请输入用户名')
      return
    }
    if (password === '') {
      mui.toast('请输入密码')
      return
    }

    $.ajax({
      url: '/user/login',
      type: 'post',
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: function(e) {
        console.log(e)
        if (e.error === '403') {
          mui.toast('用户名或者密码错误')
          return
        }
        if (e.success) {
          // 成功
          // (1) 如果有参数传递, 需要跳转回去
          // (2) 如果没有参数传递, 正常跳转用户中心



          
          // 不太懂
          if (location.search.indexOf('retUrl') != -1) {
            // 有参数, 获取地址, 进行跳转
            var retUrl = location.search.replace('?retUrl=', '')
            location.href = retUrl
          } else {
            // 没有参数
            location.href = 'user.html'
          }
        }
      }
    })
  })
})
