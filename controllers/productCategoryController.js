const productCategoryModel = require('../models/productCategoryModel');

exports.newProductCategory = async (req, res, next) => {
  try {
    const productCategoryData = {
      name: req.body.name,
      available: req.body.available,
      image: req.body.image,
      createdDate: req.body.createdDate,
    };
    // if (!reqReview);

    // req.body = productCategoryData;

    await productCategoryModel.create(productCategoryData);
    res.status(200).json({
      status: 'success',
      message: 'successfully saved data!',
      data: productCategoryData,
    });
  } catch (error) {
    res.status(404).json({
      status: 'Uncaught Error Found!',
      message: error.message,
    });
  }
};

exports.getAllProductCategories = async (req, res, next) => {
  try {
    const productCategoriesData = await productCategoryModel.find();
    res.status(200).json({
      status: 'success',
      message: 'Data Successfully Found!',
      data: productCategoriesData,
    });
  } catch (error) {
    res.status(404).json({
      status: 'Uncaught Error Found!',
      message: error.message,
    });
  }
};
