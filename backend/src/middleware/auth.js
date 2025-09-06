import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
  if (!token) {
    res.status(401);
    return res.json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      return res.json({ message: 'Not authorized, user not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    return res.json({ message: 'Token is not valid', error: err.message });
  }
};
