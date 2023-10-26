const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: [true, 'A tour must have a name e.g., Hunza Valley'],
    trim: true,
  },
  productCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory',
    required: [true, 'A product must have a referance to a product category!'],
  },
  available: { type: Boolean, default: true },
  image: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
