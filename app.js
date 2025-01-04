// app.js
const createError = require('http-errors');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const indexRouter = require('./routes/index');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logging middleware
app.use(logger('dev'));

// Enable parsing request data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Enable database session store
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './session.sqlite'
} );
const myStore = new SequelizeStore({
    db: sequelize
} );


// Enable sessions
app.use(session({
  secret: 'somesecretkey',
  store: myStore, // default is memory store
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  cookie: { maxAge: 10 * 60 * 1000 } // milliseconds
}));

// Sync the session store
myStore.sync();

// Routing
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
