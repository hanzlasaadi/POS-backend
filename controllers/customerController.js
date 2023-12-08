/* eslint-disable import/no-extraneous-dependencies */
// const multer = require('multer');
// const sharp = require('sharp');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const factory = require('./factoryHandlers');
const Customer = require('../models/customerModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//PARAM Middleware
// exports.checkId = (req, res, next, val) => {
//   console.log('Param middleware is working');
//   if (val > tours.length - 1 || val < 0) {
//     return res.status(404).send({
//       status: 'fail',
//       message: 'Invalid id'
//     });
//   }
//   next();
// };

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `public/img/users`);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

// storing uploaded image file in memory
// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.split('/')[0] === 'image') {
//     cb(null, true);
//   } else {
//     cb(
//       new AppError(400, 'Please upload an image. Example: .jpeg / .jpg'),
//       false
//     );
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

function filterObject(obj, ...fields) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (fields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
}

// exports.uploadUserPhoto = upload.single('photo');

// exports.resizePhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 50 })
//     .toFile(`public/img/users/${req.file.filename}`);

//   return next();
// });

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Customer.findByIdAndUpdate(req.user._id, { active: false });
  // console.log(req.user._id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Deny access if user enters password or confirm password
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError(400, "Can't change password!!!"));
  }
  // 2. Filter the req.body object to only contain required fields
  const filteredObj = filterObject(req.body, 'name', 'email');
  if (req.file) filteredObj.photo = req.file.filename;

  // update data on the database;
  const updatedUser = await Customer.findByIdAndUpdate(
    req.user._id,
    filteredObj,
    {
      new: true,
      runValidators: true,
    },
  );

  // 3. Find user and update & send response
  return res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(Customer);

exports.getOneUser = factory.getOne(Customer);

exports.updateUser = factory.updateOne(Customer);

exports.deleteUser = factory.deleteOne(Customer);

exports.addNewUser = (req, res) => {
  res.status(500).json({
    status: 'Access Denied',
    message: 'This route is not defined. Please use signup instead!!!',
  });
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Customer.findById(req.params.tourId);
  // console.log(tour);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,

    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,

    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    customer_email: req.user.email,

    client_reference_id: req.params.tourId,

    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
