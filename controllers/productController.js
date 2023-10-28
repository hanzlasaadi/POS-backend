const ProductCategory = require('../models/productCategoryModel');
const Product = require('../models/productModel');

exports.newProduct = async (req, res, next) => {
  try {
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

    if (!newProduct) throw new Error("New roduct Category could'nt be created");

    res.status(201).json({
      status: 'success',
      message: 'New Product successfully added',
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
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
      status: 'error',
      message: error.message,
    });
  }
};
