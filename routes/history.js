var router = require('express').Router();
var authObj = require('../util/auth');
var moment = require('moment');
var History = require('../models/history');

router.get('/', authObj.isLoggedIn, function(req, res, next){
    History.findOne({userid: req.user._id}).populate('items.itemid').exec(function(err, doc){
        if (err) {
            err = "Something went wrong while retrieving user's purchase history";
            return next(err);
        }
        let history = doc ? doc : {items: []};
        return res.render('history/index', {history: history, moment: moment});
    });
});

module.exports = router;