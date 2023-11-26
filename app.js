/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const productRoute = require('./routes/productRoute');
const productCategoryRoute = require('./routes/productCategoryRoute');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const saleRoute = require('./routes/saleRoute');
const cashRoute = require('./routes/cashRoute');

const app = express();

// enable all cors requests
app.use(cors());

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/productCategory', productCategoryRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/sale', saleRoute);
app.use('/api/v1/cash', cashRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on the server!`));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
