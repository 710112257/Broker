var express = require('express');
var router = express.Router();
var myselfinfoModel = require('../models/myselfinfoModel');

/* GET home page. */
router.get('/', function (req, res, next) {
  myselfinfoModel.find({_id:'001'}, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    res.render('about',{'myself':result[0]} );
  });
});

module.exports = router;
