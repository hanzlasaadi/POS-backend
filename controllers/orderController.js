const Order = require('../models/orderModel');
const factory = require('./factoryHandlers');

exports.checkBody = (req, res, next) => {
  if (!req.body)
    return res.status(400).send({
      status: 'fail',
      message: 'Add JSON body in the request',
    });

  return next();
};

exports.createOrder = factory.createOne(Order);

exports.getAllOrders = factory.getAll(Order);

exports.getOne = factory.getOne(Order);

exports.updateOrder = factory.updateOne(Order);

exports.deleteOrder = factory.deleteOne(Order);
