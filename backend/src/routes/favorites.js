import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Add favorite: POST /api/favorites { productId }
router.post('/', protect, async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId is required' });
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const user = req.user;
    if (user.favorites.some(id => id.toString() === productId)) {
      return res.json({ message: 'Already in favorites' });
    }
    user.favorites.push(productId);
    await user.save();
    res.status(201).json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding favorite', error: err.message });
  }
});

// Get favorites for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorites', error: err.message });
  }
});

// DELETE /api/favorites/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const productId = req.params.id;
    req.user.favorites = req.user.favorites.filter(id => id.toString() !== productId);
    await req.user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite', error: err.message });
  }
});

export default router;
