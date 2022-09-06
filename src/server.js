const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

//const usersRouter = require('./controllers/users');
const authRouter = require('./controllers/landing/auth');
//backoffice
const backofficeAuthRouter = require('./controllers/backoffice/auth');
const backofficeUserRouter = require('./controllers/backoffice/users');
const backofficeRoleRouter = require('./controllers/backoffice/roles');
const backofficePharmaRouter = require('./controllers/backoffice/pharmas');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/backoffice/auth', backofficeAuthRouter);
app.use('/api/backoffice/users', backofficeUserRouter);
app.use('/api/backoffice/roles', backofficeRoleRouter);
app.use('/api/backoffice/pharmas', backofficePharmaRouter);

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
