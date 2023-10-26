const Product = require('../models/productModel');

exports.newProduct = async (req, res, next) => {
  const productData = {
    name: req.body.name,
    productCategory: (await Product.findOne({ name: req.body.productCategory }))
      .id,
    available: req.body.available,
    image: req.body.rating,
    createdDate: req.body.createdDate,
  };
  // if (!reqReview);

  await Product.create(productData);

  res.status(200).json({
    status: 'success',
    message: 'New Product successfully added',
    data: productData,
  });
  // next();
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const productsData = await Product.find();
    res.status(200).json({
      status: 'success',
      message: 'Data Successfully Found!',
      data: productsData,
    });
  } catch (error) {
    res.status(404).json({
      status: 'Uncaught Error Found!',
      message: error.message,
    });
  }
};
