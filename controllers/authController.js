// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const sendEmail = require('../utils/email');
// const Email = require('../utils/email');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.SECRET_JWT, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const tokenAndSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);
  const cookieOpts = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOpts.secure = true;

  res.cookie('jwt', token, cookieOpts);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const signupUrl = `${req.protocol}://${req.get('host')}/me`;

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // const mail = new Email(newUser, signupUrl);
  // mail.welcomeMail();

  tokenAndSendResponse(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email & password are present
  if (!email || !password)
    return next(new AppError(400, 'Enter an email and password!!!'));

  // 2. Check if email & password are correct
  const user = await User.findOne({ email }).select('+password');
  console.log('login user: ', user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(401, 'Invalid email or password!!!'));
  }

  // 3. Generate token if true
  // 4. Send response
  return tokenAndSendResponse(user, 200, res);
});

// exports.logout = () => logout();

exports.verify = catchAsync(async (req, res, next) => {
  let token;
  // 1. Getting token and checking if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError(401, 'Please Login!!!'));

  // 2. Verification of the token
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT,
  );

  // 3. Checking if user still exists
  const freshUser = await User.findById(decodedData.id);
  // console.log(freshUser);

  // 4. Check if user changed password after the token was issued.
  if (freshUser.checkChangedPassword(decodedData.iat))
    return next(new AppError('User changed password recently, Login again!!!'));

  // Every Test is passed and user is verified
  res.locals.user = freshUser;
  req.user = freshUser;
  return next();
});

exports.verifyToken = catchAsync(async (req, res, next) => {
  let token;
  // 1. Getting token and checking if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError(401, 'Please Login!!!'));

  // 2. Verification of the token
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT,
  );

  // 3. Checking if user still exists
  const freshUser = await User.findById(decodedData.id);
  // console.log(freshUser);

  // 4. Check if user changed password after the token was issued.
  if (freshUser.checkChangedPassword(decodedData.iat))
    return next(new AppError('User changed password recently, Login again!!!'));

  // Every Test is passed and user is verified
  // res.locals.user = freshUser;
  // req.user = freshUser;
  return res.status(200).json({
    status: 'success',
    data: freshUser,
  });
});

exports.isLoggedIn = async function (req, res, next) {
  // 1. Checking if token is there
  if (req.cookies.jwt) {
    try {
      // 2. Verification of the token
      const decodedData = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET_JWT,
      );

      // 3. Finding user by token & checking if they still exists
      const freshUser = await User.findById(decodedData.id);
      if (!freshUser) return next();
      // console.log(freshUser);

      // 4. Check if user changed password after the token was issued.
      if (freshUser.checkChangedPassword(decodedData.iat)) return next();

      // Every Test is passed and user is verified
      res.locals.user = freshUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  return next();
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'Logged Out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.checkAdmin =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(403, 'You are NOT authorized to perform this acton'),
      );

    return next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Check if user entered an email
  if (!req.body.email) return next(new AppError(404, 'Enter an email!'));

  // Find user based on the email POSTed
  const newUser = await User.findOne({ email: req.body.email });
  if (!newUser)
    return next(new AppError(404, 'Email not correct. No user found'));

  // Generate the password reset token
  const resetToken = newUser.generatePasswordResetToken();
  await newUser.save({ validateBeforeSave: false });

  // Send email with certain options
  // const resetURL = `${req.protocol}://${req.get(
  //   'host',
  // )}/api/v1/users/resetPassword/${resetToken}`;

  // const resetMessage = `Forgot your password? Click this link to reset your password and confirm it: ${resetURL}. If you didn't forget your password, ignore this email!`;

  try {
    // await sendEmail({
    //   email: newUser.email,
    //   subject: 'Your password reset link. (Valid for only 10 min)',
    //   message: resetMessage
    // });
    // const mail = new Email(newUser, resetURL);
    // await mail.forgotPassMail();
    return res.status(200).json({
      status: 'success',
      message: 'Your password has been reset',
      resetToken: resetToken,
    });
  } catch (err) {
    newUser.passwordResetTokenHash = undefined;
    newUser.passwordTokenExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(
      new AppError(
        500,
        'Password could not be changed. Please try another time!',
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Encrypt token
  const reqToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Get user based on the token & verify token expiration
  const newUser = await User.findOne({
    passwordResetTokenHash: reqToken,
    passwordTokenExpires: { $gt: Date.now() },
  });
  if (!newUser) return next(new AppError(403, 'Token is invalid or expired!'));

  newUser.password = req.body.password;
  newUser.passwordConfirm = req.body.passwordConfirm;
  newUser.passwordResetTokenHash = undefined;
  newUser.passwordTokenExpires = undefined;
  await newUser.save();
  // update passwordChangedAt, password properties
  // Done at userModel "pre hook"

  // Send JWT & log user in
  return tokenAndSendResponse(newUser, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from database based on id
  // console.log(req.user);
  const crrUser = await User.findOne({ email: req.user.email }).select(
    '+password',
  );
  // console.log(crrUser);
  if (!crrUser)
    return next(new AppError(403, 'Not authorized to update pass!'));

  // 2. Check if POSTed crr password is correct
  if (
    !(await crrUser.correctPassword(req.body.currentPassword, crrUser.password))
  ) {
    return next(new AppError(403, 'Enter the correct current password!'));
  }
  // 3. If so, update password
  crrUser.password = req.body.newPassword;
  crrUser.passwordConfirm = req.body.confirmNewPassword;
  await crrUser.save();

  // 4. Log user in, send JWT
  return tokenAndSendResponse(crrUser, 201, res);
});
