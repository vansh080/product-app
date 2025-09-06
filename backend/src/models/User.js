import mongoose from 'mongoose';

const CartItem = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: { type: Number, default: 1 }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [CartItem]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
