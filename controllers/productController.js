const ProductCategory = require('../models/productCategoryModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');

exports.newProduct = catchAsync(async (req, res, next) => {
  const { _id } = await ProductCategory.findOne({
    name: req.body.productCategory,
  });
  const productData = {
    name: req.body.name,
    productsList: req.body.productsList,
    productCategory: _id,
    available: req.body.available,
    image: req.body.image,
    createdDate: req.body.createdDate,
  };

  const newProduct = await Product.create(productData);

  if (!newProduct)
    return next(new AppError(403, "New Product Category could'nt be created"));

  return res.status(201).json({
    status: 'success',
    message: 'New Product successfully added',
    data: newProduct,
  });
});

// exports.getAllProducts = catchAsync(async (req, res, next) => {
//   const productsData = await Product.find(req.query);
//   if (!productsData) return next(new AppError(404, 'No Data could be found!'));
//   return res.status(200).json({
//     status: 'success',
//     length: productsData.length,
//     message: 'Data Successfully Found!',
//     data: productsData,
//   });
// });

exports.getAllProduct = factory.getAll(Product);

exports.getOneProduct = factory.getOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
