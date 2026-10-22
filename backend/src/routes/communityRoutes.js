import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import asyncHandler from '../utils/asyncHandler.js';
import SearchAlert from '../models/SearchAlert.js';
import ItemRequest from '../models/ItemRequest.js';

const router = Router();
router.use(requireAuth);

router.get('/alerts/mine', asyncHandler(async (req, res) => {
  const alerts = await SearchAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { alerts } });
}));
router.post('/alerts', asyncHandler(async (req, res) => {
  const { term, radius, locality, notifyByEmail = false } = req.body || {};
  if (typeof term !== 'string' || term.trim().length < 2 || term.trim().length > 100 || !Number.isFinite(radius) || radius < 1 || radius > 25 || typeof notifyByEmail !== 'boolean' || (locality !== undefined && (typeof locality !== 'string' || locality.length > 120))) {
    const error = new Error('Provide a search term and a radius from 1 to 25 miles'); error.status = 400; throw error;
  }
  const alert = await SearchAlert.create({ user: req.user._id, term, radius, locality, notifyByEmail });
  res.status(201).json({ success: true, data: { alert } });
}));
router.get('/requests/mine', asyncHandler(async (req, res) => {
  const requests = await ItemRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { requests } });
}));
router.post('/requests', asyncHandler(async (req, res) => {
  const { category, description, locality } = req.body || {};
  if (!['Books & Media', 'Electronics', 'Furniture', 'Clothing & Shoes', 'Kitchen & Dining', 'Tools & Hardware'].includes(category) || typeof description !== 'string' || description.trim().length < 10 || description.trim().length > 1000 || (locality !== undefined && (typeof locality !== 'string' || locality.length > 120))) {
    const error = new Error('Provide a valid category and a request between 10 and 1000 characters'); error.status = 400; throw error;
  }
  const request = await ItemRequest.create({ user: req.user._id, category, description, locality });
  res.status(201).json({ success: true, data: { request } });
}));

export default router;
