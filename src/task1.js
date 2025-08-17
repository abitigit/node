/**
 * Task 1
 */
const fs = require("fs");
const path = require("path");
const { validationErrorMessages } = require("./constants");

function readFileSync(path) {
  const data = fs.readFileSync(path, "utf8");
  return JSON.parse(data);
}

function getAllProducts(dataPaths) {
  return readFileSync(dataPaths.productsPath).products;
}

function getAllReviews(dataPaths) {
  return readFileSync(dataPaths.reviewsPath).reviews;
}

function getAllCustomers(dataPaths) {
  return readFileSync(dataPaths.customersPath).customers;
}

function getAllImages(dataPaths) {
  return readFileSync(dataPaths.imagesPath).images;
}

/**
 * Get Product info and its reviews
 * @param {Number} productId - Product id
 */
async function getProductInformationByProductId(productId, dataPaths) {
    if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error(validationErrorMessages.productIdValidation);
    }

    const products = getAllProducts(dataPaths);
    const reviews = getAllReviews(dataPaths);
    const customers = getAllCustomers(dataPaths);
    const images = getAllImages(dataPaths);

    const product = products.find(p => p.id === productId);

    if (!product) {
        throw new Error(validationErrorMessages.productNotFound);
    }

    const productReviews = reviews.filter(r => r.product_id === productId);

    const enrichedReviews = productReviews.map(review => {
        const customer = customers.find(c => c.id === review.customer_id);
        const reviewImages = images.filter(image => review.images.includes(image.id));

        const { credit_card, ...customerWithoutCreditCard } = customer;
                const encodedPhoneNumber = Buffer.from(String(customerWithoutCreditCard.phone_number)).toString('base64');

        return {
            ...review,
            customer: {
                ...customerWithoutCreditCard,
                phone_number: encodedPhoneNumber
            },
            images: reviewImages
        };
    });

    enrichedReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const { reviews: _, ...productWithoutReviews } = product;

    return {
        ...productWithoutReviews,
        reviews: enrichedReviews
    };
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
