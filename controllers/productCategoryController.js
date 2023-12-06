const productCategoryModel = require('../models/productCategoryModel');
const factory = require('./factoryHandlers');

exports.newProductCategory = async (req, res, next) => {
  try {
    const productCategoryData = {
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

exports.getAllProductCategory = factory.getAll(productCategoryModel);

// exports.createProductCategory = factory.createOne(productCategoryModel);

exports.getOne = factory.getOne(productCategoryModel);

exports.updateProductCategory = factory.updateOne(productCategoryModel);

exports.deleteProductCategory = factory.deleteOne(productCategoryModel);
