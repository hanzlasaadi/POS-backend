/* eslint-disable import/no-extraneous-dependencies */
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');
// const validation = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true,
    minLength: [3, 'Name must not be less than 4 characters'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    trim: true,
    lowerCase: true,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: [4, 'Password must be greater than 4 characters!!'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your passwords'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password must match! Try Again!!!',
    },
  },
  passwordResetTokenHash: String,
  passwordTokenExpires: Date,
  passwordChangeTimestamp: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    default: 'worker',
    enum: {
      values: ['worker', 'admin', 'developer'],
      message: 'Role must only contain worker or admin',
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;

  return next();
});

// eslint-disable-next-line consistent-return
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeTimestamp = Date.now() - 2000; // this DATE must be less than the token issued DATE

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

userSchema.methods.checkChangedPassword = function (jwtTime) {
  if (this.passwordChangeTimestamp) {
    const changeTime = parseInt(
      this.passwordChangeTimestamp.getTime() / 1000,
      10,
    );

    // True (password was changed recently - deny access)
    return jwtTime < changeTime;
  }

  // False (password timestamp not present - allow access)
  return false;
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenHash = hashToken;

  this.passwordTokenExpires = Date.now() + 10 * 1000 * 60;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
