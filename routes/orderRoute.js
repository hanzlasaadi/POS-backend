const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.route('/stats').get(orderController.stats);

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
