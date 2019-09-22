var express = require('express');
var router = express.Router();
const articleModel = require('../models/articleModel');
const myselfinfoModel = require('../models/myselfinfoModel');
router.get('/', function (req, res, next) {
  articleModel.find(function (err, result) {
    if (err) {
      console.error(err);
    }
    var article2 = result;
    myselfinfoModel.find(function (err, result) {
      if (err) {
        console.error(err);
      }
      var myselfinfo2 = result;
      res.render('index', { 'acticle': article2, 'myinfo': myselfinfo2[0] });
    });

  });

});


module.exports = router;
