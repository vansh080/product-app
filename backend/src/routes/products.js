import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products?search=&category=
router.get('/', async (req, res) => {
  const { search, category, limit = 30, page = 1 } = req.query;
  const query = {};
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  if (category) {
    query.category = category;
  }
  try {
    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});

export default router;
