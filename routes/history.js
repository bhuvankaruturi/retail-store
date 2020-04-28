var router = require('express').Router();
var authObj = require('../util/auth');
var moment = require('moment');
var History = require('../models/history');

// TODO: replace json response with res.render
router.get('/', authObj.isLoggedIn, function(req, res, next){
    History.findOne({userid: req.user._id}).populate('items.itemid').exec(function(err, doc){
        if (err) {
            err = "Something went wrong while retrieving user's purchase history";
            return next(err);
        }
        return res.render('history/index', {history: doc, moment: moment});
    });
});

module.exports = router;