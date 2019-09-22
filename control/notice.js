var express = require('express');
var router = express.Router();         //router使用
var noticeModel = require('../models/noticeModel');
var dateformat=require('dateformat');

//提交公告页面到数据库
router.post('/add-notice',function (req, res, next) {
  
  req.body.time = dateformat(new Date(),'yyyy年mm月dd日 H时MM分ss秒');
  var time = req.body.time;
  var title = req.body.title;
  var content = req.body.content;

  noticeModel.create({'time':time,'title':title,'content':content}, function (err, result) {
    if (err) {
      console.log(err);
      return
    }

    res.render('users/msg', {
      msg: '上传成功:',
      nextPageName: '公告列表',
      nextPageUrl: '/users/notice',
      tips: 'success'
    });

  });
});

//渲染添加页面
router.get('/add-notice', function(req, res, next) {
  res.render('users/add-notice', {});
});

//从数据库调出数据到列表
router.get('/', function (req, res, next) {
  noticeModel.aggregate([{$match:{}},{$sort:{time:-1}}],function(err,result){
    if(err){
      console.error(err);
    }
    res.render('users/notice', {'result':result});
  });
  
});

module.exports = router;
