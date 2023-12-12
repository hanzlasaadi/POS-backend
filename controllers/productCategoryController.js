/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const sharp = require('sharp');
const productCategoryModel = require('../models/productCategoryModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `./public/images/categories`);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `category-${req.params.id}-${Date.now()}.${ext}`);
//   },
// });
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

  req.file.filename = `category-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 75 })
    .toFile(`./public/images/categories/${req.file.filename}`);

  const updatedDoc = await productCategoryModel.findByIdAndUpdate(
    req.params.id,
    { image: req.file.filename },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(201).json({
    status: 'success',
    data: updatedDoc,
  });
});

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
