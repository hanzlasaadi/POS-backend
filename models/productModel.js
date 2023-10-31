const mongoose = require('mongoose');

const productsListSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Menuitem must have a name e.g., Cheesecake'],
  },
  image: String,
  price: {
    type: Number,
    required: [true, 'A Menuitem must have a price tag e.g., 99.9$'],
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
