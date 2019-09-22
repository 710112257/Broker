var express = require('express');
var router = express.Router();
var noticeModel = require('../models/noticeModel');
var myselfinfoModel = require('../models/myselfinfoModel');

/* GET home page. */
router.get('/', function (req, res, next) {
 var notice,myself;
 noticeModel.aggregate([{$match:{}},{$sort:{time:-1}}], function (err, result) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result);
      notice=result;

      myselfinfoModel.find({'_id':'001'}, {}, function (err, result) {
        myself=result[0];

        res.render('gbook',{'notice':notice,'myself':myself});
      });
     
    });

  });


module.exports = router;
