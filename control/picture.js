var express = require('express');
var router = express.Router();
var pictureModel = require('../models/pictureModel');
var multer = require('multer');
var path = require('path');
var upload = multer({
    dest: path.join(__dirname, '../public/mylife-share')
});
var fs = require('fs');
var dateformat = require('dateformat');

//上传
router.post('/add-picture', upload.single('upload'), function (req, resp, next) {
    console.log(req.body);
    var oldPath = req.file.path;
    var extName = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));//获得后缀.jpg
    var newName = new Date().getTime() + '-' + parseInt(Math.random() * 10) + extName;//图片名称存入数据库
    var newPath = path.join(req.file.destination, newName);
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('图片上传成功！')
    });
    console.log(req.body);
    req.body.upload = newName;
    req.body.time=dateformat(new Date(),'yyyy年mm月dd日 H时MM分ss秒');
    pictureModel.create(req.body, function (err, result) {
      if (err) {
        console.log(err);
        return
      }
      resp.render('users/msg', {
        msg: '上传成功:',
        nextPageName: '图片列表',
        nextPageUrl: '/users/picture',
        tips: 'success'
      });
    });
});

router.get('/add-picture', function (req, res, next) {
    res.render('users/add-picture', {});
});

router.get('/', function (req, res, next) {
    pictureModel.find({}, function (err, result) {
        console.log("result是"+result);
        if (err) {
            console.error(err);
        }
        res.render('users/picture', { 'result': result });
    });
});

module.exports = router;