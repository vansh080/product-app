import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, default: 'general' },
  image: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
