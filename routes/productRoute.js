const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProduct)
  .post(productController.newProduct);

router
  .route('/:id')
  .get(productController.getOneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
