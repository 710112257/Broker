var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var dateformat = require('dateformat');
const articleModel = require('../models/articleModel');
const commentModel = require('../models/commentModel');
const answerModel = require('../models/answerModel');
//储存回复
router.post('/answer', function (req, res, next) {
  req.body.ip = req.connection.remoteAddress;
  req.body.time = dateformat(new Date(), 'yyyy年mm月dd日 H时MM分ss秒');
  answerModel.create(req.body, function (err, result) {
  });
});
//储存评论
router.post('/comment', function (req, res, next) {
  var articleid = req.body.id;
  req.body.ip = req.connection.remoteAddress;
  req.body.time = dateformat(new Date(), 'yyyy年mm月dd日 H时MM分ss秒');
  commentModel.create(req.body, function (err, result) {
    if (err) {
      console.error(err);
    }
    commentModel.find({ 'id': articleid }, {}, function (err, result) {
      var commentcount = result.length;
      articleModel.updateOne({ '_id': ObjectId(articleid) }, { $set: { 'commentcount': commentcount } }, function (err, result) {
      });

    });

  });

});


//读取内容
router.get('/', function (req, res, next) {
  var id = req.query.id;
  //点击一次浏览量+1
  articleModel.find({ '_id': ObjectId(id) }, function (err, result) {
    var article1 = result[0];
    var counts = result[0].count;
    articleModel.update({ '_id': ObjectId(id) }, { $set: { 'count': counts + 1 } }, function (err, result) {
      commentModel.find({ 'id': id }, function (err, result) {
        var comment1 = result;
        answerModel.find({ 'id': id }, function (err, result) {
          var answer1 = result;
          res.render('info', { 'article': article1, 'comment': comment1, 'answers': answer1 });
        });
      });


    });
  });
});

module.exports = router;
