var createError = require('http-errors');
// load modules
var fs = require('fs')
var path = require('path');
var logger = require('morgan');
var express = require('express');
var session = require('express-session');

// our router
var indexRouter = require('./routes/index');

// express main object
var app = express();

// view engine setup: add EJS folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// logging example - log only error responses
// see https://www.npmjs.com/package/morgan for full documentation
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'http.log'), { flags: 'a' })
// app.use(logger('combined', { stream: accessLogStream, skip: function (req, res) { return res.statusCode < 400 } }));

// plug the logging middleware - look for output in standard output
app.use(logger('dev'));

// enable parsing request data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// enable database session store
var Sequelize = require('sequelize')
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var sequelize = new Sequelize({
  "dialect": "sqlite",
  "storage": "./session.sqlite"
});


var myStore = new SequelizeStore({
  db: sequelize
})


// enable sessions
app.use(session({
  secret:"somesecretkey",
  store:myStore,
  resave: false, // Force save of session for each request
  saveUninitialized: false, // Save a session that is new, but has not been modified
  cookie: {maxAge: 10*60*1000 } // milliseconds!
}));

myStore.sync();


// our routing
app.use('/', indexRouter);

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
