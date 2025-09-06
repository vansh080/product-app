import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Add to cart: POST /api/cart { productId, qty }
router.post('/', protect, async (req, res) => {
  const { productId, qty = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId is required' });
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const existing = req.user.cart.find(i => i.product.toString() === productId);
    if (existing) {
      existing.qty = existing.qty + parseInt(qty);
    } else {
      req.user.cart.push({ product: productId, qty: parseInt(qty) });
    }
    await req.user.save();
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
});

// Get cart
router.get('/', protect, async (req, res) => {
  await req.user.populate('cart.product');
  res.json(req.user.cart || []);
});

// Remove from cart
router.delete('/:productId', protect, async (req, res) => {
  const { productId } = req.params;
  req.user.cart = req.user.cart.filter(i => i.product.toString() !== productId);
  await req.user.save();
  res.json({ message: 'Removed from cart' });
});

// Checkout (dummy)
router.post('/checkout', protect, async (req, res) => {
  try {
    // Here you could integrate with payment gateway. For now, just clear cart and return success.
    req.user.cart = [];
    await req.user.save();
    res.json({ message: 'Checkout successful (dummy)', success: true });
  } catch (err) {
    res.status(500).json({ message: 'Checkout failed', error: err.message });
  }
});

export default router;
