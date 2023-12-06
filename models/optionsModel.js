const mongoose = require('mongoose');

const optionsSchema = mongoose.Schema({
  type: String,
  image: String,
  price: Number,
});

const stepsToChooseSchema = mongoose.Schema({
  // custom: { type: Boolean, default: false },
  // customType: { type: String, default: '' },
  stepName: String,
  shortName: String,
  options: [optionsSchema],
});

const stepsSchema = mongoose.Schema({
  subCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'A product must have a referance to a specific product!'],
  },
  stepsToChoose: [stepsToChooseSchema],
});

// stepsSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'subCategory',
//     select: 'name',
//     model: 'Product',
//   });
//   next();
// });

const Step = mongoose.model('Step', stepsSchema);

module.exports = Step;
