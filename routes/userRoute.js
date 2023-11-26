/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

//PARAM Middleware
// router.param('id', userController.checkId);

// Don't need to be logged in;;;
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.route('/verifyToken').get(authController.verifyToken);

//You need to be logged in after this line;;;
router.use(authController.verify);
// ☝ This verifies all routes after this middleware
router.route('/logout').get(authController.logout);
router.patch(
  '/updateMe',
  // userController.uploadUserPhoto,
  // userController.resizePhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updatePassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getOneUser);

router.use(authController.checkAdmin('admin', 'developer'));
// ☝ This allows all routes after this middleware only for admins
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addNewUser);

router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
