// 不需要入口函数是因为不需要等页面全部加载完才有进度条，一开始发送ajax请求时就有进度条
// 1.功能一进度条效果
//   nprogress进度条插件  nprogress插件是一个适用于ajax应用的轻量级的进度条插件。
// 使用步骤

// - 引入js文件和css文件

//     <link rel='stylesheet' href='nprogress.css'/>
//     <script src='nprogress.js'></script>

// - 使用进度条插件

//     //引入了nprogress.js文件后，就有了一个全局对象NProgress对象
//     //开启进度条
//     NProgress.start();
//     //关闭进度条
//     NProgress.done();

// 延时器使用
//setTimeout(function() {  延时器 延长2s结束进度条
//   结束进度条
//  NProgress.done();
//}, 2000);

// 使用场景

// - 添加到你调用 Ajax 的地方！绑定它到 jQuery ajaxStart 和 ajaxStop 事件上

// JQ中AJAX的全局事件

// ajax提供了6个全局函数，会被页面中所有的ajax请求触发，在不同时间点会触发不同的全局事件。

// 在页面中会有很多的ajax请求，但是这些ajax请求都有相同的消息机制，比如我们需要在ajax请求发送之前弹出了一个提示框，提示"正在读取数据...." 在ajax请求成功时显示"获取数据成功...",在ajax结束后隐藏提示框。如果不使用全局事件，那么需要在每一个ajax的beforeSend、success、complete回调函数中都加上相同的代码。

// - jquery的全局事件需要给document注册（固定写法）

//     $(document).ajaxStart(function () {
//       console.log("ajaxStart在开始一个ajax请求时触发");
//     });

//   ajax全局事件
//   *    .ajaxComplete()  当每个ajax完成时,调用     (不管成功还是失败)
//   *    .ajaxSuccess()   当ajax返回成功时调用
//   *    .ajaxError()     当ajax返回失败时调用
//   *    .ajaxSend()      当ajax发送前调用
//   *
//   *    .ajaxStart()     当第一个ajax发送时调用
//   *    .ajaxStop()      当全部的ajax请求完成时调用

// 需求: 在第一个ajax发送的时候, 开启进度条
//        在全部的ajax回来的时候, 关闭进度条

$(document).ajaxStart(function() {
  //   开启进度条
  NProgress.start()
})

$(document).ajaxStop(function() {
  setTimeout(function() {
    //   结束进度条
    NProgress.done()
  }, 500)
})

// 等待页面dom结构的加载后执行
$(function() {
  // 注册事件完成公共功能

  // 功能1: 左侧二级导航切换效果
  $('.lt_aside .category').click(function() {
    //    alert(1111)
    $('.lt_aside .child')
      .stop()
      .slideToggle()
  })

  // 功能2: 左侧菜单切换效果
  $('.icon_left').click(function() {
    $('.lt_aside').toggleClass('hidemenu')
    $('.lt_topbar').toggleClass('hidemenu')
    $('.lt_main').toggleClass('hidemenu')
  })

  // 功能3: 退出功能
  // 给右侧按钮, 添加点击事件, 让模态框显示
  $('.icon_right').click(function() {
    // 让模态框显示  .modal("show")   .modal("hide")
    $('#logoutModal').modal('show')
  })

  // 退出两种方式
  // 1. 发ajax让后台, 销毁当前用户的登录状态, 实现退出   (推荐)
  // 2. 清除浏览器缓存, 将cookie清空, 本地存储的 sessionId 也没了
  // 给退出按钮, 添加点击事件, 需要在退出时, 销毁当前用户的登录状态
  $('#logoutBtn').click(function() {
    // 发送ajax请求, 让后端销毁当前用户的登录状态
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      dataType: 'json',
      success: function(e) {
        console.log(e)
        if (e.success) {
          // 销毁登录状态成功
          location.href = 'login.html'
        }
      }
    })
  })
})
