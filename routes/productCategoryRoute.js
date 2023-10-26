const express = require('express');
const productCategoryController = require('../controllers/productCategoryController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(productCategoryController.getAllProductCategories)
  .post(productCategoryController.newProductCategory);

module.exports = router;
