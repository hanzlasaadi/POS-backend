const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId; //hack for geting reviews for one Tour

    // Making "API Features" Instance
    const features = new APIFeatures(Model.find(filter), req.query);

    // Running all class methods;
    features.filter().limitFields().sort().paginate();

    // Executing Query;
    const documents = await features.query;

    res.send({
      status: 'success',
      results: documents.length,
      data: {
        data: documents,
      },
    });
  });

exports.getOne = (Model, populateObj) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    // only if we need to populate (case of Tour Controller)
    if (populateObj) query = query.populate(populateObj);

    const document = await query;

    if (!document) {
      return next(
        new AppError(404, 'No document could be found with this ID!!!'),
      );
    }

    return res.send({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      next(new AppError(404, 'The document could not be found!!!'));
    }

    res.status(204).json({
      status: 'success',
      data: {
        document: null,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newTour = await Model.create(req.body);

    if (!newTour)
      return next(new AppError(401, 'New Document could not be created!!!'));

    return res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
