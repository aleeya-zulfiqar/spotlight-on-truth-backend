const express = require('express');
const Region = require('../models/Region');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const asyncHandler = require('../middleware/asyncHandler');

// GET all
router.get('/', async (req, res, next) => {
  try {
    const regions = await Region.find().sort('name');
    res.json(regions);
  } catch (err) {
    next(err);
  }
});

// GET one by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const region = await Region.findOne({ slug: req.params.slug });
    if (!region) return res.status(404).json({ error: 'Region not found' });
    res.json(region);
  } catch (err) {
    next(err);
  }
});

// admin-only create region
router.post('/', auth, requireRole('admin'), asyncHandler(async (req, res) => {
  const region = await Region.create(req.body);
  res.json(region);
}));

// admin-only update region
router.put('/:id', auth, requireRole('admin'), asyncHandler(async (req, res) => {
  const region = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(region);
}));

// admin-only delete region
router.delete('/:id', auth, requireRole('admin'), asyncHandler(async (req, res) => {
  await Region.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}));

module.exports = router;