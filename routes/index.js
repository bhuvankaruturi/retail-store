var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('main', { title: 'Best clothing store' });
});

/* Register a user */
router.post('/signup', function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return next(err);
    }
    passport.authenticate('local')(req, res, function(){
      res.render("items/index", {username: req.body.username});
    });
  });
});

router.get('/items', function(req, res, next) {
  res.render('items');
});

module.exports = router;
