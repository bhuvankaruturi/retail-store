var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('main', { title: 'Best clothing store' });
});

// TODO: modify method to render a signup form
router.get('/signup', function(req, res) {
  res.status(200).json({message: 'Please register'});
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
    passport.authenticate('local')(req, res, function(){
      res.redirect("/items");
    });
  });
});

// TODO: modify method to render a login form
router.get('/login', function(req, res) {
  res.status(200).json({message: 'Please login in'});
});

/* Authenticate and login a user */
router.post('/login', function(req, res) {
  let options = {successRedirect: '/items', failureRedirect: '/login'}
  passport.authenticate('local', options)(req, res);
});

/* Logout a user */
// TODO: implement redirection to /items page
router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({message: 'Successfully logged out'});
});

module.exports = router;
