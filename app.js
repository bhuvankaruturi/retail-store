var createError = require('http-errors');
var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');

var indexRouter = require('./routes/index');
var itemsRouter = require('./routes/items');

mongoose.connect('mongodb://127.0.0.1:27017/', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
// express-session to maintain session ids
app.use(expressSession({
  secret: "does not matter what I set this to",
  resave: false,
  saveUninitialized: false
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// populate res.locals to use them in ejs templates
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
})

app.use('/', indexRouter);
app.use('/items', itemsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;