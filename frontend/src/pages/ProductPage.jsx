import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import { FiShoppingCart, FiStar } from "react-icons/fi";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/products/" + id);
        setProduct(data);
      } catch (err) {
        alert("Error loading product: " + err.message);
      }
    }
    load();
  }, [id]);

  if (!product)
    return (
      <p className="text-center py-20 text-gray-600 text-lg">
        Loading product...
      </p>
    );

  const handleAddToCart = async () => {
    try {
      await api.post("/cart", { productId: product._id, qty: 1 });
      alert("Added to cart");
    } catch (err) {
      alert("Error adding to cart: " + err.message);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-20 py-10 min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100">
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-purple-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-full max-w-md object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900">{product.title}</h2>

            {/* Rating */}
            <div className="flex items-center gap-1 text-yellow-500 mt-2">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={i < (product.rating || 4) ? "fill-yellow-500" : ""}
                />
              ))}
              <span className="text-gray-600 text-sm ml-2">
                {product.rating || 4}.0 / 5
              </span>
            </div>

            <p className="mt-4 text-gray-700 text-lg leading-relaxed">
              {product.description || "No description available."}
            </p>

            <p className="mt-4 text-2xl font-bold text-blue-600">
              ₹ {product.price}
            </p>
            <p className="mt-2 text-green-600 font-medium">
              ✅ In stock. Available for delivery.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
