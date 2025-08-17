/**
 * Task 1
 */
const fs = require("fs");
const path = require("path");
const { validationErrorMessages } = require("./constants");

/**
 * Get Product info and its reviews
 * @param {Number} productId - Product id
 */
async function getProductInformationByProductId(productId, dataPaths) {

}

/**
 * TIP: Use the following code to test your implementation
 */
(async () => {
  try {
    const productsPath = path.resolve(__dirname, "./data/task1/products.json");
    const reviewsPath = path.resolve(__dirname, "./data/task1/reviews.json");
    const customersPath = path.resolve(__dirname, "./data/task1/customers.json");
    const imagesPath = path.resolve(__dirname, "./data/task1/images.json");
    const dataPaths = {
      productsPath,
      reviewsPath,
      customersPath,
      imagesPath
    }
    const product = await getProductInformationByProductId(1, dataPaths);
    console.log(JSON.stringify(product, null, 3));
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  getProductInformationByProductId,
};
