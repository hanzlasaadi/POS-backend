const mongoose = require('mongoose');

const commodityOptions = mongoose.Schema({
  stepName: String,
  type: String,
  price: Number,
  selected: Boolean,
});

const commoditySchema = mongoose.Schema({
  barcode: {
    type: String,
    required: [true, 'A commodity must have a barcode'],
  },
  name: {
    type: String,
    required: [true, 'A commodity must have a name (Veggie Pizza / Meat Wrap)'],
  },
  options: [commodityOptions],
  subCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [
      true,
      'A Commodity must have a reference to the subcategory of that product (Milk Flavour, Fruit Flavour, etc)',
    ],
  },
  // productId: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'ProductsList',
  //   required: [
  //     true,
  //     'A Commodity must have a reference to the product itselt from the productsList Schema (Veggie Pizza, Meat Pizza, etc)',
  //   ],
  // },
  productPrice: {
    type: Number,
    required: [true, 'A commodity must have a price'],
  },
  unit: {
    type: Number,
    default: 1,
  },
  totalSalePrice: Number,
  available: Boolean,
});

const orderSchema = mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now,
  },
  workerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [
      true,
      'A Commodity must have a reference to the subcategory of that product (Milk Flavour, Fruit Flavour, etc)',
    ],
  },
  paymentType: {
    type: String,
    enum: ['Cash', 'Credit', 'Online'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'An order must have a total price'],
  },
  clientPay: {
    type: Number,
    // validate: {
    //   validator: function (val) {
    //     return val >= this.totalPrice;
    //   },
    //   message: 'Customer Payment ({VALUE}) must be higher than the price.',
    // },
    required: [true, 'An order must contain how much the customer payed!'],
  },
  change: Number,
  count: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['cancelled', 'pending', 'completed'],
    required: [
      true,
      'An order must have a status: cancelled / pending / completed',
    ],
  },
  commodityList: [commoditySchema],
  // tax: {
  //   type: Number,
  //   required: [true, 'Provide tax percenage with the order!'],
  // },
  // typeOfOrder: {
  //   type: String,
  //   enum: ['eatin', 'takeaway', 'delivery'],
  //   required: [
  //     true,
  //     'Specify which type of order is this![Eat In, Take Away, Delivery]',
  //   ],
  // },
});

commoditySchema.pre('save', function (next) {
  if (this.productPrice) {
    this.totalSalePrice = this.productPrice * this.unit;
  }
  next(); // Continue with the save operation
});

orderSchema.pre('save', function (next) {
  if (this.totalPrice && this.clientPay) {
    this.change = this.clientPay - this.totalPrice;
  }
  next(); // Continue with the save operation
});

orderSchema.pre('save', function (next) {
  if (this.totalPrice) {
    this.totalPrice *= this.count;
  }
  next(); // Continue with the save operation
});

// orderSchema.pre('save', function (next) {
//   if (this.totalPrice && this.tax) {
//     const taxPrice = (this.tax * this.totalPrice) / 100;
//     this.totalPrice += taxPrice;
//   }
//   next(); // Continue with the save operation
// });

// Populate product categories before send tour responses
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'workerId',
    select: 'name email role',
    model: 'User',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
