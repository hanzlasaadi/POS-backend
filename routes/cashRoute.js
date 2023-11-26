const express = require('express');
const cashController = require('../controllers/cashController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(
  authController.verify,
  authController.checkAdmin('workerVIP', 'admin', 'developer'),
);

router
  .route('/')
  .get(cashController.getTodaysCashDoc)
  .patch(cashController.updateTodaysCashDoc)
  .post(cashController.createTodaysCashDoc);

router.route('/all').get(cashController.getAllCashDocs);

router
  .route('/:id')
  .get(cashController.getOneCashDoc)
  .delete(cashController.deleteCashDoc);

module.exports = router;
