const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.verify);

router.route('/stats').get(orderController.stats);

router.use(authController.checkAdmin('worker', 'admin', 'developer'));

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.checkBody, orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOne)
  .delete(orderController.deleteOrder)
  .patch(orderController.checkBody, orderController.updateOrder);

module.exports = router;
