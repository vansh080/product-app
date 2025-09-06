import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import favRoutes from './routes/favorites.js';
import cartRoutes from './routes/cart.js';
import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();
const app = express();

app.use(express.json({limit: '10mb'}));
app.use(cors());
app.use(morgan('dev'));

await connectDB(); // connect to MongoDB

app.get('/', (req, res) => res.send({message: 'Product API running'}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/favorites', favRoutes);
app.use('/api/cart', cartRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
