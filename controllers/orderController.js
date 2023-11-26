const Cash = require('../models/cashModel');
const Order = require('../models/orderModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');

const updateCashDoc = async (order, next) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const startDate = today;
  const endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const [existingDocument] = await Cash.find({
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  if (!existingDocument)
    return next(new AppError(400, 'Could not find cash doc for today!'));

  if (!(order.discountedPrice === 0)) {
    existingDocument.drawerDeposits.push(order.discountedPrice);
    existingDocument.drawerAmount += order.discountedPrice;
  } else {
    existingDocument.drawerDeposits.push(order.totalPrice);
    existingDocument.drawerAmount += order.totalPrice;
  }

  const total = existingDocument.drawerDeposits.reduce(
    (acc, crr) => acc + crr,
    0,
  );

  if (total > process.env.DRAWER_LIMIT) {
    console.log('limit reached!');
    existingDocument.lockerDeposits.push(process.env.LOCKER_SUBMIT);
    existingDocument.lockerAmount += process.env.LOCKER_SUBMIT;
    existingDocument.drawerAmount -= process.env.LOCKER_SUBMIT;
  }

  console.log(order, 'orderToBeUpdated!');
  console.log(existingDocument, 'cashDocToBeUpdated!');
  console.log(total, 'totalDrawerDeps!');

  // Update the document
  // existingDocument.drawerLimit = 70;
  const updatedDoc = await existingDocument.save();
  // console.log('Document updated for the day.');
  return updatedDoc;
};

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

exports.createOrder = catchAsync(async (req, res, next) => {
  const newDoc = await Order.create(req.body);

  if (!newDoc)
    return next(new AppError(401, 'New Order could not be created!!!'));

  const updatedCash = await updateCashDoc(newDoc, next);
  if (!updatedCash)
    return next(new AppError(400, 'Could not update cash!, but order created'));

  return res.status(201).json({
    status: 'success',
    orderData: newDoc,
    cashData: updatedCash,
  });
});

// exports.updateOrder = catchAsync(async (req, res, next) => {
//   let cashDoc = null;

//   const orderToBeUpdated = await Order.findById(req.params.id);

//   const newDocument = await Order.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!newDocument)
//     return next(new AppError(403, 'Order could not be updated!'));

//   if (!(orderToBeUpdated.totalPrice === req.body.totalPrice)) {
//     cashDoc = await updateCashDoc(newDocument, next);
//     if (!cashDoc)
//       return next(
//         new AppError(400, 'Could not update cash! but updated Order'),
//       );
//   }

//   return res.status(201).json({
//     status: 'success',
//     orderData: newDocument,
//     cashDoc,
//   });
// });

exports.getAllOrders = factory.getAll(Order);

exports.getOne = factory.getOne(Order);

exports.updateOrder = factory.updateOne(Order);

exports.deleteOrder = factory.deleteOne(Order);
