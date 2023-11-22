const mongoose = require('mongoose');

const productsListSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Menu item must have a name e.g., Cheesecake'],
  },
  image: String,
  price: {
    type: Number,
    required: [true, 'A Menu item must have a price tag e.g., 99.9$'],
  },
  description: String,
  stock: Number,
  discount: {
    type: Number,
    default: 0,
    validate: {
      validator: function (val) {
        return val <= this.price;
      },
      message: 'Discount ({VALUE}) must be lower than the price.',
    },
  },
  available: { type: Boolean, default: true },
  custom: { type: Boolean, default: false },
  customType: { type: String, default: '' },
});

const productSchema = mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: [true, 'A Product type must have a name: Milk Flavour, Pizza'],
    trim: true,
  },
  productsList: [productsListSchema],
  available: { type: Boolean, default: true },
  image: String,
  productCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory',
    required: [true, 'A product must have a referance to a product category!'],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose Middleware - Query
productSchema.pre(/^find/, function (next) {
  this.find({ available: { $ne: false } });
  next();
});

// Populate product categories before send tour responses
// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'productCategory',
//     select: '-__v',
//     model: 'ProductCategory',
//   });
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
