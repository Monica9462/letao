$(function() {
  // 功能一.一进到页面，发送ajax请求，内容位置的左侧数据li
  $.ajax({
    url: '/category/queryTopCategory',
    type: 'get',
    dataType: 'json',
    success: function(e) {
      console.log(e)
      var htmlStr = template('leftTpl', e)
      $('.It_mainleft ul').html(htmlStr)
      // 调用方法, 默认渲染第一个一级分类 对应的 二级分类
      renderById(e.rows[0].id)
    }
  })

  // 功能二.添加一级分类切换效果 (二级联动效果)
  $('.It_mainleft ul').on('click', 'a', function() {
    // 1. 切换效果, 给自己加上 current 类, 移除其他 a 的current类
    $(this)
      .addClass('current')
      .parent()
      .siblings()
      .find()
      .removeClass('current')
    //2.根据一级分类a上的自定义属性id来渲染右侧二级分类
    // 获取 存储的 一级分类 id
    var id = $(this).data('id')
    renderById(id)
  })

  //   封装二级分类根据一级分类id渲染的方法
  function renderById(id) {
    $.ajax({
      url: '/category/querySecondCategory',
      type: 'get',
      data: {
        id: id
      },
      dataType: 'json',
      success: function(e) {
        // console.log(e)
        var htmlStr = template('rightTpl', e)
        $('.It_mainright ul').html(htmlStr)
      }
    })
  }
})
