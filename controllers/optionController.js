const Option = require('../models/optionsModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');

exports.getAllOptions = factory.getAll(Option);

exports.createOption = factory.createOne(Option);

exports.getOne = factory.getOne(Option);

exports.updateOption = factory.updateOne(Option);

exports.deleteOption = factory.deleteOne(Option);
