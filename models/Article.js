const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  body: { type: String, required: true }, // Markdown or HTML
  summary: { type: String }, // AI-generated summary
  author: { type: String, default: 'Spotlight Contributor' },
  sourceUrl: { type: String },
  images: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  verified: { type: Boolean, default: false },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

articleSchema.index({ slug: 1 }, { unique: true });
articleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Article || mongoose.model('Article', articleSchema);