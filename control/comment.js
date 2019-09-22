var express = require('express');
var router = express.Router();
var commentModel = require('../models/commentModel');
var answerModel = require('../models/answerModel');
var ObjectId = require('mongodb').ObjectId;
//批量删除评论
router.get('/delmany-comment', function (req, res, next) {
  var arrdel = [];
  var arr2 = [];
  var ids = req.query.id.split('_');
  for (var a = 0; a < ids.length; a++) {
    arrdel.push(ObjectId(ids[a]));
    arr2.push(ids[a]);
  }
  commentModel.deleteMany({ '_id': { $in: arrdel } }, function (err, result) {
    answerModel.deleteMany({ 'commentid': { $in: arr2 } }, function (err, result) {
      if (err) {
        console.error(err);
      }
      res.render('users/msg', {
        msg: '批量删除成功:',
        nextPageName: '评论列表',
        nextPageUrl: '/users/comment',
        tips: 'success'
      });
    });

  });
});
//点击删除评论
router.get('/del-comment', function (req, res, next) {
  var commentid = req.query.id;
  commentModel.deleteOne({ '_id': ObjectId(req.query.id) }, function (err, result) {
    if (err) {
      console.error(err);
    }
    answerModel.deleteMany({ 'commentid': commentid }, function (err, result) {
      res.render('users/msg', {
        msg: '删除成功:',
        nextPageName: '评论列表',
        nextPageUrl: '/users/comment',
        tips: 'success'
      });
    });

  });
});
router.get('/', function (req, res, next) {
  commentModel.aggregate([{ $match: {} }, { $sort: { time: -1 } }], function (err, result) {
    if (err) {
      console.error(err);
    }
    var comment = result;
    res.render('users/comment', { 'comment': comment });
  });

});

module.exports = router;
