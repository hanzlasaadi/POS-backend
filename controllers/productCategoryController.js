const productCategoryModel = require('../models/productCategoryModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');

exports.newProductCategory = async (req, res, next) => {
  try {
    const productCategoryData = {
      access: req.body.access,
      priority: req.body.priority,
      name: req.body.name,
      available: req.body.available,
      typeOfFood: req.body.typeOfFood,
      stepsToChoose: req.body.stepsToChoose,
      image: req.body.image,
      createdDate: req.body.createdDate,
    };
    // if (!reqReview);

    // req.body = productCategoryData;

    const newProductCategory =
      await productCategoryModel.create(productCategoryData);

    if (!newProductCategory)
      throw new Error("New Product Category could'nt be created");
    res.status(201).json({
      status: 'success',
      message: 'New Product Category successfully saved!',
      data: productCategoryData,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// exports.getAllProductCategories = async (req, res, next) => {
//   try {
//     const productCategoriesData = await productCategoryModel.find();
//     res.status(200).json({
//       status: 'success',
//       message: 'Data Successfully Found!',
//       data: productCategoriesData,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };

exports.getAllProductCategory = catchAsync(async (req, res, next) => {
  const { access } = req.query;

  // Making "API Features" Instance
  const features = new APIFeatures(productCategoryModel.find(), req.query);

  // Running all class methods;
  features.filter().limitFields().sort().paginate();

  // Executing Query;
  let documents = await features.query;

  if (access) {
    documents = documents.filter((doc) => doc.access.includes(access));
  }

  res.send({
    status: 'success',
    results: documents.length,
    data: documents,
  });
});

// exports.createProductCategory = factory.createOne(productCategoryModel);

exports.getOne = factory.getOne(productCategoryModel);

exports.updateProductCategory = factory.updateOne(productCategoryModel);

exports.deleteProductCategory = factory.deleteOne(productCategoryModel);
