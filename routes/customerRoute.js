/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const customerController = require('../controllers/customerController');
const authController = require('../controllers/authController');

const router = express.Router();

//PARAM Middleware
// router.param('id', customerController.checkId);

// Don't need to be logged in;;;
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// router.route('/verifyToken').get(authController.verifyToken);

//You need to be logged in after this line;;;
router.use(authController.verify);
// ☝ This verifies all routes after this middleware
router.route('/order').post(customerController.getCheckoutSession);
router.route('/logout').get(authController.logout);
router.patch(
  '/updateMe',
  // customerController.uploadUserPhoto,
  // customerController.resizePhoto,
  customerController.updateMe,
);
router.delete('/deleteMe', customerController.deleteMe);
router.patch('/updatePassword', authController.updatePassword);
router.get('/me', customerController.getMe, customerController.getOneUser);

router.use(authController.checkAdmin('websiteadmin', 'developer'));
// ☝ This allows all routes after this middleware only for admins
router
  .route('/')
  .get(customerController.getAllUsers)
  .post(customerController.addNewUser);

router
  .route('/:id')
  .get(customerController.getOneUser)
  .patch(customerController.updateUser)
  .delete(customerController.deleteUser);

module.exports = router;
