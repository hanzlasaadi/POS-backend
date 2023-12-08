/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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

const updateData = async () => {
  try {
    await mongoose.connect(DB).then(() => {
      console.log('DB connection sucessfull!!!');
    });
    const documents = await ProductCategory.find();
    const docs = [];

    for (const document of documents) {
      const defaultImage = `${slugify(document.name)}.jpg`;
      console.log(defaultImage);
      await ProductCategory.findByIdAndUpdate(
        document._id,
        { image: defaultImage },
        {
          new: true,
          runValidators: true,
        },
      );
    }

    // const updatedDoc = await ProductCategory.find({ priority: 1 });

    // await Product.create(productData[17]);
    // productData.forEach((el, i) => {
    //   console.log(productData[17]);
    // });
    console.log('Sucessfully updated data');
    // console.log(updatedDoc);
  } catch (error) {
    console.log(error.message, 'errrrr');
  } finally {
    process.exit();
  }
};

if (arg === '--import') importData();
// else if (arg === '--delete') deleteData();
else if (arg === '--update') updateData();
