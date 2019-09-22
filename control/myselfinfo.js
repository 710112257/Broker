var express = require('express');
var router = express.Router();
var myselfinfoModel = require('../models/myselfinfoModel');
var multer = require('multer');
var path = require('path');
var upload = multer({
    dest: path.join(__dirname , '../public/users-imgs/')
});
var fs = require('fs');

//获取头像
router.post('/touxiang', upload.single('upload'), function (req, res, next) {
  var oldPath = req.file.path;
  var extName = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));//获得后缀.jpg
  var newName = new Date().getTime() + '-' + parseInt(Math.random() * 10) + extName;//头像名称，需要存入数据库
  var newPath = path.join(req.file.destination,newName);
  fs.rename(oldPath, newPath, function (err) {
      if (err) {
        res.render('users/msg', {
          msg: '上传失败:'+err,
          nextPageName: '个人中心',
          nextPageUrl: '/users/myselfinfo',
          tips: 'danger'
        });
          return;
      }
      myselfinfoModel.updateOne({ _id: '001' }, { $set: {'img':newName} }, function (err, result) {
        if(err){
          res.render('users/msg', {
            msg: '上传失败:'+err,
            nextPageName: '个人中心',
            nextPageUrl: '/users/myselfinfo',
            tips: 'danger'
          });
      
        }
        res.render('users/msg', {
          msg: '上传成功:',
          nextPageName: '个人中心',
          nextPageUrl: '/users/myselfinfo',
          tips: 'success'
        });
      });
  });

});

//信息修改页面
router.get('/myselfedit', function (req, res, next) {
  myselfinfoModel.find({ _id: '001' }, {}, function (err, result) {
    res.render('users/myselfedit', result[0]);
  });

});
//信息修改提交
router.post('/edit', function (req, res, next) {
  var replaceData = req.body;
  myselfinfoModel.updateOne({_id: '001' }, { $set: replaceData }, function (err, result) {
    if(err){
      res.render('users/msg', {
        msg: '修改失败:'+err,
        nextPageName: '个人中心',
        nextPageUrl: '/users/myselfinfo',
        tips: 'danger'
      });
      return;
    }
    res.render('users/msg', {
      msg: '修改成功:',
      nextPageName: '个人中心',
      nextPageUrl: '/users/myselfinfo',
      tips: 'success'
    });

  });

});
/* GET home page. */
//_id为001
//信息展示页面
router.get('/', function (req, res, next) {
  myselfinfoModel.find({ _id: '001' }, {}, function (err, result) {
    res.render('users/myselfshow', result[0]);
  });

});

module.exports = router;
