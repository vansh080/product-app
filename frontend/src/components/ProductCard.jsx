import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function ProductCard({ product, onFavoriteChange }) {
  const [loadingFav, setLoadingFav] = useState(false);

  const handleFavorite = async () => {
    setLoadingFav(true);
    try {
      await api.post('/favorites', { productId: product._id });
      if (onFavoriteChange) onFavoriteChange();
    } catch (err) {
      alert('Error adding favorite: ' + err.message);
    } finally {
      setLoadingFav(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.post('/cart', { productId: product._id, qty: 1 });
      alert('Added to cart');
    } catch (err) {
      alert('Error adding to cart: ' + err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
      <Link to={`/product/${product._id}`} className="overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-56 object-contain p-4 bg-gray-50 hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-blue-600 font-bold text-lg mb-4">₹ {product.price}</p>

        <div className="mt-auto flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200"
          >
            Add to Cart
          </button>

          <button
            onClick={handleFavorite}
            className={`flex-1 ${
              loadingFav ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            } text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200`}
            disabled={loadingFav}
          >
            {loadingFav ? '...' : '❤ Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
}
