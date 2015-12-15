var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

// HTTP verbs not supported by browsers
var methodOverride = require('method-override');

// ODM for MongoDB
var mongoose = require('mongoose');

// Sessions and authentication
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');

// Routes
var routes = require('./routes/index');
var contacts = require('./routes/contacts');
var auth = require('./routes/auth');

// Database
var mongoUri = process.env.MONGOURI || 'mongodb://localhost/expressdb';
// Creating connection
mongoose.connect(mongoUri);

var conn = mongoose.connection;

conn.on('connecting', function () {
  console.log('Mongoose connecting to ' + mongoUri);
});

conn.on('connected', function () {
  console.log('Successfully connected to ' + mongoUri);
});

conn.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

conn.on('disconnected', function () {
  console.log('Mongoose disconnected!');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  conn.close(function () {
    console.log('Mongoose connection finished. App termination');
    process.exit(0);
  });
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(cookieParser());

// Adding sessions middleware
app.use(session({
  secret: 'grumpy cat',
  resave: true,
  saveUninitialized: false

}));

// Sass styles
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public', 'stylesheets'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/stylesheets'  // <link rel="stylesheets" href="stylesheets/app.css"/>
}));

// For serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/accounts');
passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Routes middleware
app.use('/', routes);
app.use('/contacts/', contacts);
app.use('/auth/', auth);

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
