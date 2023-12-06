const express = require('express');
const authController = require('../controllers/authController');
const optionController = require('../controllers/optionController');

const router = express.Router();

router.route('/').get(optionController.getAllOptions);

router.use(authController.verify);
router.use(authController.checkAdmin('workerVIP', 'admin', 'developer'));

router.route('/').post(optionController.createOption);

router
  .route('/:id')
  .get(optionController.getOne)
  .delete(optionController.deleteOption)
  .patch(optionController.updateOption);

module.exports = router;
