const factory = require('./factoryHandlers');
const Cash = require('../models/cashModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getTodaysCashDoc = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const startDate = today;
  const endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const [cashData] = await Cash.find({
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  if (!cashData) return next(new AppError(404, "Could'nt find today's doc!"));

  return res.status(200).json({
    status: 'success',
    data: cashData,
  });
});

exports.createTodaysCashDoc = catchAsync(async (req, res, next) => {
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

  if (
    existingDocument === null ||
    existingDocument === undefined ||
    existingDocument === false
  ) {
    // Create the document
    const newCashDoc = new Cash({
      drawerDeposits: [],
      drawerAmount: 0,
      lockerDeposits: [],
      lockerAmount: 0,
    });

    const createdDoc = await newCashDoc.save();
    // await existingDocument.create();
    // console.log('Document updated for the day.');
    return res.status(200).json({
      status: 'success',
      data: createdDoc,
    });
  }
  // Handle the case where the document for the day does not exist
  return next(new AppError(403, 'Document for the day already exits!'));
});

exports.updateTodaysCashDoc = catchAsync(async (req, res, next) => {
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

  if (existingDocument) {
    // Update the document
    existingDocument.drawerLimit = 70;
    await existingDocument.save();
    // console.log('Document updated for the day.');
    return res.status(200).json({
      status: 'success',
      message: 'Document updated for the day.',
      data: existingDocument,
    });
  }
  // Handle the case where the document for the day does not exist
  return next(new AppError(404, 'Document not found for the day.'));
});

exports.getAllCashDocs = factory.getAll(Cash);

exports.getOneCashDoc = factory.getOne(Cash);

exports.deleteCashDoc = factory.deleteOne(Cash);
