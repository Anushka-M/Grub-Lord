var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var app = express();

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName: 'session', 
  secret: 'blargadeeblargblarg', 
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
}));

var index = require('./routes/index');
var users = require('./routes/users');
var signUp = require('./routes/signUp');
var login = require('./routes/login');
var authenticateUser = require('./routes/authenticateUser');
var logout = require('./routes/logout');
var homePage = require('./routes/homePage');
var resetPassword = require('./routes/resetPassword');
var postRecipe = require('./routes/postRecipe');
var forgotPasswordSendEmail = require('./routes/forgotPasswordSendEmail');

app.use('/', index);
app.use('/users', users);
app.use('/signup', signUp);
app.use('/login', login);
app.use('/authenticateuser', authenticateUser);
app.use('/homePage', homePage);
app.use('/logout', logout);
app.use('/resetpassword', resetPassword);
app.use('/postRecipe', postRecipe);
app.use('/forgotPasswordSendEmail', forgotPasswordSendEmail);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
