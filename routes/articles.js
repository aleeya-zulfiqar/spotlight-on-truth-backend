const express = require('express');
const Article = require('../models/Article');
const Region = require('../models/Region');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const asyncHandler = require('../middleware/asyncHandler');

// GET all articles
router.get('/', async (req, res) => {
  const articles = await Article.find().sort('-createdAt');
  res.json(articles);
});

// GET article by slug
router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug }).populate('region', 'name slug');
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// GET one article by ID
router.get('/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// GET all articles for a region
router.get('/region/:slug', async (req, res) => {
  const articles = await Article.find({ regionSlug: req.params.slug }).sort('-createdAt');
  res.json(articles);
});

// CREATE article admin-only
router.post('/', auth, requireRole('admin'), asyncHandler(async (req, res) => {
  const article = await Article.create(req.body);
  res.json(article);
}));

// UPDATE article admin-only
router.put('/:id', auth, requireRole('admin'), asyncHandler(async (req, res) => {
  const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
}));

// DELETE article admin-only
router.delete('/:id', auth, requireRole('admin'), asyncHandler(async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}));

module.exports = router;