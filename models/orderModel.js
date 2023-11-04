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

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
