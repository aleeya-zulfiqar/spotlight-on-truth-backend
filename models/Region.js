const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Gaza"
  slug: { type: String, required: true }, // e.g., "gaza"
  overview: { type: String, default: '' },
  coordinates: {
    // can be GeoJSON center or bounding box
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  tags: { type: [String], default: [] },
}, {
    timestamps: true
});

regionSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.models.Region || mongoose.model('Region', regionSchema);