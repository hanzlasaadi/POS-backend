const express = require('express');
const productCategoryController = require('../controllers/productCategoryController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(productCategoryController.getAllProductCategory);

router.route('/:id').get(productCategoryController.getOne);

// verify all requests below and only admin can make these requests
router.use(
  authController.verify,
  authController.checkAdmin('admin', 'developer'),
);

router.route('/').post(productCategoryController.newProductCategory);
router
  .route('/:id')
  .patch(productCategoryController.updateProductCategory)
  .delete(productCategoryController.deleteProductCategory);

module.exports = router;
