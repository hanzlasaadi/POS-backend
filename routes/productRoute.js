const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

// unprotected routes

router.route('/').get(productController.getAllProduct);

router.route('/:id').get(productController.getOneProduct);

// protected routes (admin and developer)
router.use(
  authController.verify,
  authController.checkAdmin('worker', 'admin', 'developer'),
);

router.route('/stats').get(productController.statsProduct);

router.route('/').post(productController.newProduct);

router
  .route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
