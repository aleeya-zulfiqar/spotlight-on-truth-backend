require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');

const regions = [
  { name: 'Gaza', slug: 'gaza', overview: 'Gaza Strip - humanitarian & political crisis', coordinates: { type: 'Point', coordinates: [34.45, 31.52] }, tags: ['palestine', 'conflict'] },
  { name: 'Sudan', slug: 'sudan', overview: 'Sudan - political upheaval and humanitarian crisis', coordinates: { type: 'Point', coordinates: [30.44, 15.55] }, tags: ['conflict', 'humanitarian'] },
  { name: 'Kashmir', slug: 'kashmir', overview: 'Kashmir - contested region in South Asia', coordinates: { type: 'Point', coordinates: [74.0, 34.0] }, tags: ['kashmir', 'dispute'] },
];

const run = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    for (const r of regions) {
      const exists = await Region.findOne({ slug: r.slug });
      if (!exists) {
        await Region.create(r);
        console.log('Inserted region:', r.slug);
      } else {
        console.log('Exists:', r.slug);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();