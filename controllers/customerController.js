/* eslint-disable import/order */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
// const multer = require('multer');
// const sharp = require('sharp');
const pKey = require('../stripeKey');
const stripe = require('stripe')(pKey);
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
  // const CustomerLoggedIn = await Customer.findById(req.params.customerId);
  // console.log(tour);
  console.log(req.body);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,

    success_url: `https://foodeliciousbristol.co.uk/`,

    cancel_url: `https://foodeliciousbristol.co.uk/`,
    mode: 'payment',

    // customer_email: 'hanzla@protonmail.com',

    // client_reference_id: req.params.tourId,

    line_items: req.body.products.map((comm) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: comm.name,
        },
        unit_amount: comm.productPrice * 100,
      },
      quantity: comm.unit,
    })),
    shipping_address_collection: {
      allowed_countries: ['GB'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'gbp',
          },
          display_name: 'Free shipping',
          delivery_estimate: {
            maximum: {
              unit: 'hour',
              value: 1,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 299,
            currency: 'gbp',
          },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            maximum: {
              unit: 'hour',
              value: 1,
            },
          },
        },
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    sessionId: session.id,
    session,
  });
});
