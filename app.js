var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var User = require('./models/user');

// Routes import
var indexRouter = require('./routes/index');
var itemsRouter = require('./routes/items');
var cartRouter = require('./routes/cart');

// connect to database retail_store
var mongooseOptions =  {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
mongoose.connect('mongodb://127.0.0.1:27017/retail_store', mongooseOptions);

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
}));
app.use(express.static(path.join(__dirname, '/public')));
// bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

<<<<<<< HEAD
// populate res.locals to use them in ejs templates
=======
app.use('/', indexRouter);
app.use('/login',loginRouter);

// catch 404 and forward to error handler
>>>>>>> b7a3d0ac7c744357cbef945cdf9ec4d8841be4c5
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
})

app.use('/', indexRouter);
app.use('/items', itemsRouter);
app.use('/cart', cartRouter);

app.use(function(req, res, next) {
  res.status(404);
  next("Not found");
});

module.exports = app;