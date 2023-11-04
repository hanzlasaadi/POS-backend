const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.route('/').get(orderController.getAllSales);

router.route('/:id').patch(orderController.updateOrder);

module.exports = router;
