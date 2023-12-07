const mongoose = require('mongoose');

function slugify(str) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}

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
  image: {
    type: String,
    default: function () {
      return `${slugify(this.name)}.jpg`;
    },
  },
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
