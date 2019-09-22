var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var articleModel = require('../models/articleModel');
var multer = require('multer');
var path = require('path');
var upload = multer({
  dest: path.join(__dirname, '../public/article-imgs/')
});
var fs = require('fs');
var dateformat = require('dateformat');
//批量删除文章
router.get('/delmany-article', function (req, res, next) {
  var arrdel=[];
  var ids = req.query.id.split('_');
  for(var a=0;a<ids.length;a++){
    arrdel.push(ObjectId(ids[a]));
  }
  articleModel.deleteMany({ '_id': {$in: arrdel} }, function (err, result) {
    if (err) {
      console.error(err);
    }
    res.render('users/msg', {
      msg: '批量删除成功:',
      nextPageName: '文章列表',
      nextPageUrl: '/users/article',
      tips: 'success'
    });
  });
});
//点击删除文章
router.get('/del-article', function (req, res, next) {
  articleModel.deleteOne({ '_id': ObjectId(req.query.id) }, function (err, result) {
    if (err) {
      console.error(err);
    }
    res.render('users/msg', {
      msg: '删除成功:',
      nextPageName: '文章列表',
      nextPageUrl: '/users/article',
      tips: 'success'
    });
  });
});
//点击修改文章
router.get('/edit-article', function (req, res, next) {
  articleModel.find({ '_id': ObjectId(req.query.id) }, {}, function (err, result) {
    if (err) {
      console.error(err);
    }
    res.render('users/edit-article', { 'result': result[0], 'checked': 'checked' });
  });
});
//提交修改文章
router.post('/edit-article', upload.single('upload'),function (req, res, next) {
  if(req.file!=null){
  var oldPath = req.file.path;
  var extName = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));//获得后缀.jpg
  var newName = new Date().getTime() + '-' + parseInt(Math.random() * 10) + extName;//头像名称，需要存入数据库
  var newPath = path.join(req.file.destination, newName);
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('文章图片上成功，已经导入' + newPath);
  });
  req.body.upload = newName;
  }
  var _id=req.body._id;
  delete(req.body._id);
  articleModel.updateOne({ '_id': ObjectId(_id) }, { $set: req.body }, function (err, result) {
    if (err) {
      res.render('users/msg', {
        msg: '修改失败:' + err,
        nextPageName: '文章列表',
        nextPageUrl: '/users/article',
        tips: 'danger'
      });
      return;
    }
    res.render('users/msg', {
      msg: '修改成功:',
      nextPageName: '文章列表',
      nextPageUrl: '/users/article',
      tips: 'success'
    });
  });
});

//提交文章页面到数据库
router.post('/add-article', upload.single('upload'), function (req, res, next) {
  var oldPath = req.file.path;
  var extName = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));//获得后缀.jpg
  var newName = new Date().getTime() + '-' + parseInt(Math.random() * 10) + extName;//头像名称，需要存入数据库
  var newPath = path.join(req.file.destination, newName);
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('文章图片上成功，已经导入' + newPath);
  });
  req.body.upload = newName;
  req.body.commentcount = 0;
  req.body.time = dateformat(new Date(), 'yyyy年mm月dd日 H时MM分ss秒');
  req.body.count=0;
  console.log(req.body);

  articleModel.create(req.body, function (err, result) {
    if (err) {
      console.log(err);
      return
    }
    res.render('users/msg', {
      msg: '上传成功:',
      nextPageName: '文章列表',
      nextPageUrl: '/users/article',
      tips: 'success'
    });

  });
});
//点击读取get添加文章页面
router.get('/add-article', function (req, res, next) {
  res.render('users/add-article', {});
});
/* GET home page. */
router.get('/', function (req, res, next) {
  articleModel.aggregate([{$match:{}},{$sort:{time:-1}}], function (err, result) {
    if (err) {
      console.error(err);
    }
    res.render('users/article', { 'result': result });
  });

});

module.exports = router;
