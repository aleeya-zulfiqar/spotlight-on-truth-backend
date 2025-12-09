// api/utils/fixIndexes.js
require('dotenv').config();
const mongoose = require('mongoose');
const Region = require('../models/Region');

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, {});

  console.log('Connected to MongoDB for index fix.');

  try {
    const coll = Region.collection;
    console.log('Existing indexes on regions collection:');
    const idxs = await coll.indexes();
    console.dir(idxs, { depth: null });

    // Drop all non-_id indexes (be careful)
    console.log('Dropping non-_id indexes on regions collection...');
    for (const idx of idxs) {
      if (idx.name !== '_id_') {
        console.log(`Dropping index: ${idx.name}`);
        try {
          await coll.dropIndex(idx.name);
        } catch (e) {
          console.warn('Failed to drop index', idx.name, e.message);
        }
      }
    }

    // Recreate indexes according to Mongoose schema
    console.log('Syncing Mongoose indexes (recreate indexes defined by schema)...');
    await Region.syncIndexes();

    console.log('Index fix complete.');
  } catch (err) {
    console.error('Error during index fix:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();