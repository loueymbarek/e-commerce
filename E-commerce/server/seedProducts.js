const mongoose = require('mongoose');
const csv = require('csvtojson');
const Product = require('./models/Product'); // adjust path if needed
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URL);

  // Use the correct absolute or relative path
  const products = await csv().fromFile('C:/Users/HP/Desktop/e-commerce/semantic-search-for-e-commerce/dataset/D-b-nhams-Womens-Wdding-Coll-ctions-Data.csv');
  // OR (if you want to use relative path from server folder)
  // const products = await csv().fromFile('../../semantic-search-for-e-commerce/dataset/D-b-nhams-Womens-Wdding-Coll-ctions-Data.csv');

  // Map CSV fields to your Product model fields
  const formatted = products.map(p => ({
    name: p.name,
    company: p.company,
    category: p.category,
    colour: p.colour,
    description: p.description,
    image: p.image,
    product_url: p.product_url,
    price: parseFloat(p.price) || 0,
  }));

  await Product.insertMany(formatted);
  console.log('Products seeded!');
  process.exit();
}

seed();