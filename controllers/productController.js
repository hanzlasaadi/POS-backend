// const ProductCategory = require('../models/productCategoryModel');
const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');
const ProductCategory = require('../models/productCategoryModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCategoryImage = upload.single('image');

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `product-${req.params.productId}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 75 })
    .toFile(`./public/images/products/${req.file.filename}`);

  const updatedDoc = await ProductCategory.findById(req.params.subCategoryId);
  const newList = updatedDoc.productsList.map((doc) => {
    if (doc._id === req.params.subCategoryId) {
      doc.image = req.file.filename;
      return doc;
    }
    return doc;
  });
  updatedDoc.productsList = newList;
  const newDoc = await updatedDoc.save();

  return res.status(201).json({
    status: 'success',
    data: newDoc,
  });
});

exports.newProduct = catchAsync(async (req, res, next) => {
  // const { _id } = await ProductCategory.findOne({
  //   name: req.body.productCategory,
  // });
  const productData = {
    name: req.body.name,
    productsList: req.body.productsList,
    productCategory: req.body.productCategory,
    steps: req.body.steps,
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

exports.statsProduct = catchAsync(async (req, res, next) => {
  const ProductData = await Product.aggregate([
    // First Stage
    {
      $match: {
        createdDate: {
          $gte: new Date('2023-10-30'),
          $lt: new Date('2023-12-31'),
        },
      },
    },
    // Second Stage
    {
      $group: {
        _id: { createdDate: '$createdDate', name: '$name' },
        // name: { name: '$name' },
        // name: { $sum: { $multiply: ['$price', '$quantity'] } },
        // averageQuantity: { $avg: '$quantity' },
        // count: { $sum: 1 },
      },
    },
    // Third Stage
    // {
    //   $sort: { totalSaleAmount: -1 },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: ProductData,
  });
});
