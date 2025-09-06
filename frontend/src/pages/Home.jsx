import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (category) q.set("category", category);
      const data = await api.get("/products?" + q.toString());
      setProducts(data);

      const cats = Array.from(new Set(data.map((p) => p.category))).filter(Boolean);
      setCategories(cats);
    } catch (err) {
      alert("Error loading products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch every 2 key presses
  useEffect(() => {
    if (search.length % 2 === 0) {
      fetchProducts();
    }
  }, [search, category]);

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-10 min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0 drop-shadow-md">
          🛍️ Products
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/80 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/80 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-700 text-lg text-center mt-16">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onFavoriteChange={fetchProducts} />
          ))}
        </div>
      )}

      {/* Loader Styles */}
      <style>
        {`
          .loader {
            border-top-color: #3490dc;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
