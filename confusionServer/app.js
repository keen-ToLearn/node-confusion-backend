var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session)
var passport = require('passport')
var authenticate = require('./authenticate')
var config = require('./config')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');

const dbUrl = config.mongoUrl;

const connect = mongoose.connect(dbUrl)

connect.then(db => {
  console.log('Connection established with MongoDB')
},
err => console.log(err));

var app = express();

app.all('*', (req, res, next) => {
  if(req.secure)
    return next();
  else
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// W3 Express Sessions - using express session instead of cookieParser
// app.use(cookieParser('12345-67890-09876-54321'));

// W3 - Express JWT - using jwt instead of sessions
// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }))

app.use(passport.initialize())
// app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth_functionBeforeExpressSessionUserAuth(req, res, next) {
  console.log('request headers:', req.headers)
  console.log('request signedCookies:', req.signedCookies)
  console.log('request session:', req.session)

  // W3 Express Session - using express session instead of signedCookies
  // if(!req.signedCookies.user) {
  if(!req.session.user) {
    var authHeader = req.headers.authorization;

    if(!authHeader) {
      var err = new Error('You are not authenticated!')
      
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }

    var auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    var username = auth[0]
    var password = auth[1]

    if(username == 'admin' && password == 'password') {
      // W3 Express Session - using res.session instead of res.cookie 
      // res.cookie('user', 'admin', { signed: true })
      req.session.user = 'admin'
      next()
    }
    else {
      var err = new Error('You are not authenticated!')
      
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }
  }
  else {
    // W3 Express Session - using express session instead of signedCookies
    // if(req.signedCookies.user === 'admin')
    if(req.session.user === 'admin')
      next()
    else {
      // unlikely case as cookie already set
      var err = new Error('You are not authenticated!')
      
      err.status = 401
      return next(err)
    }
  }
}

// W3 - Express Session User Auth
function auth(req, res, next) {
  if(!req.user) {
    var err = new Error('You are not authenticated!')
    err.status = 403
    return next(err)
  }
  else
    next()
}

// W3 - Express JWT - applying auth to specific end points
// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
