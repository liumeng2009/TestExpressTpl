var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multiparty=require('connect-multiparty');
var mongoose=require('mongoose');
var session=require('express-session');
var mongoStore=require('connect-mongo')(session);

var routes = require('./routes/index');
var admin = require('./routes/admin');

var app = express();

var dbUrl='mongodb://127.0.0.1:12345/dbSF';
mongoose.connect(dbUrl);

// view engine setup
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multiparty());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
  secret:'dbSF',
  store:new mongoStore({
    url:dbUrl,
    collection:'sessions'
  }),
  resave:false,
  saveUninitialized:false
}));
app.use(function(req,res,next){
  var _user=req.session.user;
  app.locals.user=_user;

  if(req.query.err){
    app.locals.err=req.query.err;
  }
  else{
    delete app.locals.err;
  }

  next();
});


app.use('/', routes);
app.use('/admin', admin);


app.locals.moment=require('moment');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.locals.pretty=true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

//http://idlelife.org/archives/808
