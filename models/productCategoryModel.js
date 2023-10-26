const mongoose = require('mongoose');

const productCategorySchema = mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: [true, 'A tour must have a name e.g., Hunza Valley'],
    trim: true,
  },
  available: { type: Boolean, default: true },
  image: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const ProductCategory = mongoose.model(
  'ProductCategory',
  productCategorySchema,
);

module.exports = ProductCategory;
