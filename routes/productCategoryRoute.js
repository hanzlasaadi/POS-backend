const express = require('express');
const productCategoryController = require('../controllers/productCategoryController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(productCategoryController.getAllProductCategory)
  .post(productCategoryController.newProductCategory);

router
  .route('/:id')
  .get(productCategoryController.getOne)
  .patch(productCategoryController.updateProductCategory)
  .delete(productCategoryController.deleteProductCategory);

module.exports = router;
