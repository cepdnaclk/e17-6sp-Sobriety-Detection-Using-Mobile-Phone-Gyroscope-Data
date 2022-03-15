var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

// setting environment variables
require('dotenv').config({path: './config.env'});

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


// setting up the mongoDB database and mongoose modules
const mongoose = require('mongoose');

/**
 * Connecting with the mongodb server
 * The API server will have the connection with the mongod server as long as the API server is up
 * refer the following link to try and make custom connections
 * https://mongoosejs.com/docs/models.html#:~:text=If%20you%20create%20a-,custom%20connection,-%2C%20use%20that%20connection%27s
 */
// mongoose.connect('mongodb://localhost:27017/remote_proctoring_system');

////////////////////////////////
// to connect to atlas mongoDB
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to mongoose...'));
// .then(() => console.log('Connected to atlas MongoDB...'))
// .catch(err => console.log(err));

// importing the modules containing the routers  (can also straight awa require as the second argument of app.use())
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var usersRouter = require('./routes/user');
var adminsRouter = require('./routes/admin');

const { rejects } = require('assert');


var app = express();

app.use(cors());


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);

//set a static folder
//this folder is the place where the server searches for the index.html file 
// first checks inside the public folder for index.html, if not found uses the route to view engine's index
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/////////////////////////////////////////////////////////////////////////////////
// insert the routes here
// app.use('/', indexRouter);  
app.use('/users', usersRouter);
app.use('/users', adminsRouter);

/////////////////////////////////////////////////////////////////////////////////

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
