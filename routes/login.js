var express = require('express');
var router = express.Router();

console.log("sai");

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login clothing store' });
  });
  
  
  module.exports = router;

