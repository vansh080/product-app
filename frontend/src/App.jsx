import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Favorites from './pages/Favorites.jsx';
import Cart from './pages/Cart.jsx';
import Auth from './pages/Auth.jsx';
import api from './services/api.js';

export default function App() {
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token');
    return t ? { token: t } : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) api.setToken(user.token);
  }, [user]);

  const onLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    api.setToken(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/70 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          ProductApp
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-800 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className="text-gray-800 hover:text-blue-600 font-medium transition"
          >
            Favorites
          </Link>
          <Link
            to="/cart"
            className="text-gray-800 hover:text-blue-600 font-medium transition"
          >
            Cart
          </Link>
          {user ? (
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Login / Register
            </Link>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/auth"
            element={
              <Auth
                onLogin={(token) => {
                  localStorage.setItem('token', token);
                  api.setToken(token);
                  setUser({ token });
                }}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
