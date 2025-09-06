import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return alert("Enter a valid email");
    if (password.length < 6) return alert("Password must be at least 6 characters");

    setLoading(true);
    try {
      const path = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(path, { email, password });
      if (res?.token) {
        api.setToken(res.token);
        localStorage.setItem("token", res.token);
        if (onLogin) onLogin(res.token);
        navigate("/");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-600">
          {isLogin ? "Welcome Back 👋" : "Create an Account ✨"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Don’t have an account?" : "Already registered?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
