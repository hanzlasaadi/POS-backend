/* eslint-disable node/no-unpublished-require */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const db = require('../db');

const ProductCategory = require(`${__dirname}/../models/productCategoryModel`);
const Product = require(`${__dirname}/../models/productModel`);

dotenv.config({ path: `${__dirname}/../config.env` });

const arg = process.argv.find(
  (el) => el === '--import' || el === '--delete' || el === '--update',
);
console.log('Fuck yes: ', arg);

// const allData = JSON.parse(
//   fs.readFileSync(`${__dirname}/productCategory.json`),
// );
const productData = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));
const productCategoryData = JSON.parse(
  fs.readFileSync(`${__dirname}/productCategory.json`),
);

const DB = process.env.DB_URL.replace('<password>', db);

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

    const { _id } = await ProductCategory.findOne({
      name: productData[17].productCategory,
    });
    const toBeImportedData = {
      name: productData[17].name,
      productsList: productData[17].productsList,
      productCategory: _id,
      available: productData[17].available,
      image: productData[17].image,
    };
    await Product.create(toBeImportedData);

    // await Product.create(productData[17]);
    // productData.forEach((el, i) => {
    //   console.log(productData[17]);
    // });
    console.log('Sucessfully imported data');
  } catch (error) {
    console.log(error.message, 'errrrr');
  }
  process.exit();
};

const updateData = async () => {
  try {
    await mongoose.connect(DB).then(() => {
      console.log('DB connection sucessfull!!!');
    });

    const updatedDoc = await ProductCategory.findOneAndUpdate(
      { priority: 0 },
      { access: ['pos'] },
      {
        new: true,
        runValidators: true,
      },
    );

    // const updatedDoc = await ProductCategory.find({ priority: 1 });

    // await Product.create(productData[17]);
    // productData.forEach((el, i) => {
    //   console.log(productData[17]);
    // });
    console.log('Sucessfully updated data');
    console.log(updatedDoc);
  } catch (error) {
    console.log(error.message, 'errrrr');
  }
  process.exit();
};

if (arg === '--import') importData();
// else if (arg === '--delete') deleteData();
else if (arg === '--update') updateData();
