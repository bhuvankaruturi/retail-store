var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var History = require('../models/history');
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('main', { title: 'Best clothing store' });
});

// signup page
router.get('/signup', function(req, res) {
  return res.render('auth/signup');
});

/* Register a user */
router.post('/signup', function(req, res) {
  let user = new User({
        username: req.body.username, 
        firstname: req.body.firstname, 
        lastname: req.body.lastname 
      });
  User.register(user, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.redirect('/signup');
    }
    var userCart = new Cart({
      userid: user._id,
      items: []
    });
    var userHistory = new History({
      userid: user._id,
      items: []
    });
    userCart.save(function(err) {
      if (err) {
        console.log(err);
      }
      userHistory.save(function(err) {
        if (err) {
          console.log(err);
        }
        passport.authenticate('local')(req, res, function(){
          res.redirect("/items");
        });
      })
    });
  });
});

// login page
router.get('/login', function(req, res) {
  return res.render('auth/login');
});

/* Authenticate and login a user */
router.post('/login', function(req, res) {
  let options = {successRedirect: '/items', failureRedirect: '/login'}
  passport.authenticate('local', options)(req, res);
});

/* Logout a user */
router.get('/logout', function(req, res) {
  req.logout();
  return res.redirect('/items');
});

module.exports = router;
