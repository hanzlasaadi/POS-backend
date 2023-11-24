const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');

exports.checkBody = (req, res, next) => {
  if (!req.body)
    return res.status(400).send({
      status: 'fail',
      message: 'Add JSON body in the request',
    });

  return next();
};

exports.stats = catchAsync(async (req, res, next) => {
  const { period } = req.query;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let startDate;
  let endDate;

  if (period === 'today') {
    startDate = today;
    endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  } else if (period === 'lastWeek') {
    const lastWeek = new Date();
    lastWeek.setUTCHours(0, 0, 0, 0);
    lastWeek.setDate(lastWeek.getDate() - 7);

    startDate = lastWeek;
    endDate = new Date(lastWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
  } else if (period === 'lastMonth') {
    const lastMonth = new Date(today);
    lastMonth.setUTCHours(0, 0, 0, 0);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    startDate = lastMonth;
    endDate = new Date(today);
  } else {
    // Handle invalid period argument
    return res.status(400).json({
      status: 'error',
      message: 'Invalid period argument',
    });
  }

  const orderData = await Order.find({
    createdDate: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  return res.status(200).json({
    status: 'success',
    length: orderData.length,
    orderData,
  });
});

exports.getAllSales = factory.getAll(Order);

exports.createOrder = factory.createOne(Order);

exports.getAllOrders = factory.getAll(Order);

exports.getOne = factory.getOne(Order);

exports.updateOrder = factory.updateOne(Order);

exports.deleteOrder = factory.deleteOne(Order);
