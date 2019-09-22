var express = require('express');
var router = express.Router();
var usersModel = require('../models/usersModel');
var captchapng = require('captchapng2');

//给浏览输出验证码
router.use('/captchapng', function (req, res, next) {
  //解决乱码问题
  let rand = parseInt(Math.random() * 9000 + 1000); //生成一个四位数随机数1000-9999
  //生成的验证码要存到session中
  req.session.validcode = rand;
  let png = new captchapng(80, 30, rand); // width,height, numeric captcha

  res.writeHead(200, {
    'Content-Type': 'image/png'
  });
  res.write(png.getBuffer());
  res.end();
});
//渲染登录页面
router.get('/', function (req, res, next) {
  res.render('login', {});

});
//登录 1、先判断验证码 2、根据用户名查询数据库，3，判断有没有存在，4，判断密码是否正确
router.post('/', function (req, res, next) {

  var validcode = req.body.validcode;
  var username = req.body.username;
  var password = req.body.password;
  // 1、先判断验证码
  if (validcode != req.session.validcode) {
    res.render('msg', {
      msg: '登录失败，验证码错误',
      nextPageName: '登录页面',
      nextPageUrl: '/login',
      tips: 'warning'
    });
    return;
  }

  //2、根据用户名查询数据库
  usersModel.find({ 'username': username }, {}, function (err, result) {
    if (err) {
      res.render('msg', {
        msg: '登录失败:' + err.message,
        nextPageName: '登录页面',
        nextPageUrl: '/login',
        tips: 'warning'
      });
      return;
    }
    //3判断有没有存在(注册)
    if (result.length == 0) {
      res.render('msg', {
        msg: '该用户没有注册!',
        nextPageName: '登录页面',
        nextPageUrl: '/login',
        tips: 'warning'
      });
      return;
    }
    //4，判断密码是否正确
    if (password != result[0].password) {
      res.render('msg', {
        msg: '该用户密码不正确!',
        nextPageName: '登录页面',
        nextPageUrl: '/login',
        tips: 'warning'
      });
      return;
    }

    //5、成功,记录把用户名保存在session中
    req.session.username = username;
    res.render('msg', {
      msg: '登录成功!',
      nextPageName: 'borke博客管理系统',
      nextPageUrl: '/users/myselfinfo',
      tips: 'success'
    });
  });
});
//注销退出
router.get('/logout', function (req, res, next) {
  req.session.destroy();//销毁session
  res.redirect('http://localhost:3000/index');//重定向到首页
});

module.exports = router;