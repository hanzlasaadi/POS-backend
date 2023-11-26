require('dotenv').config({ path: `./config.env` });
const mongoose = require('mongoose');

const cashSchema = mongoose.Schema({
  drawerLimit: {
    type: Number,
    default: process.env.DRAWER_LIMIT,
    // required: [true, 'Set the limit for the maximum money in drawer'],
  },
  drawerDeposits: [{ type: Number }],
  drawerAmount: Number,
  // noOfLockerDeposits: Number,
  lockerDeposits: [{ type: Number }],
  lockerAmount: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

// cashSchema.pre('save', function (next) {
//   console.log('before saving cash: ', this);
//   next();
// });

const Cash = mongoose.model('Cash', cashSchema);

module.exports = Cash;
