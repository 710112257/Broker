var express = require('express');
var router = express.Router();
var shareModel = require('../models/pictureModel');

/* GET home page. */
router.get('/', function (req, res, next) {
    shareModel.find({}, {}, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        /* title = result; */
        res.render('share', { 'share': result });
    })

});

module.exports = router;
