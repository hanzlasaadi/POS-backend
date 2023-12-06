const mongoose = require('mongoose');

const optionsSchema = mongoose.Schema({
  type: String,
  image: String,
  price: Number,
});

const stepsToChooseSchema = mongoose.Schema({
  custom: { type: Boolean, default: false },
  customType: { type: String, default: '' },
  stepName: String,
  options: [optionsSchema],
});

const productCategorySchema = mongoose.Schema({
  access: {
    type: [String],
    required: [true, 'Specify the access either website or POS'],
  },
  priority: {
    type: Number,
    required: true,
  },
  name: {
    // unique: true,
    type: String,
    required: [true, 'A tour must have a name e.g., Milkshakes, Cakes, etc'],
    trim: true,
  },
  available: { type: Boolean, default: true },
  typeOfFood: {
    type: String,
  },
  stepsToChoose: [stepsToChooseSchema],
  // typeOfProducts: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Product',
  //   required: [
  //     true,
  //     'A product category (Bubble tea) must have a referance to a product type (milk, fruit, etc)!',
  //   ],
  // },
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
