/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// const ProductCategory = require(`${__dirname}/../models/productCategoryModel`);
const Product = require(`${__dirname}/../models/productModel`);

dotenv.config({ path: `${__dirname}/../config.env` });

const arg = process.argv.find((el) => el === '--import' || el === '--delete');
console.log('Fuck yes: ', arg);

// const allData = JSON.parse(
//   fs.readFileSync(`${__dirname}/productCategory.json`),
// );
const allData = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));

const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASS);

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => {
//     console.log('DB connection sucessfull!!!');
//   });

const deleteData = async () => {
  try {
    await mongoose.connect(DB).then(() => {
      console.log('DB connection sucessfull!!!');
    });

    await Product.deleteMany();
    console.log('Sucessfully deleted');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const importData = async () => {
  try {
    await mongoose.connect(DB).then(() => {
      console.log('DB connection sucessfull!!!');
    });

    await Product.create(allData);
    console.log('Sucessfully imported data');
  } catch (error) {
    console.log(error.message, 'errrrr');
  }
  process.exit();
};

if (arg === '--import') importData();
else if (arg === '--delete') deleteData();
