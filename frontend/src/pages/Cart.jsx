import React, { useEffect, useState } from "react";
import api from "../services/api.js";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await api.get("/cart");
      setCart(data);
    } catch (err) {
      alert("Error fetching cart: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const remove = async (productId) => {
    try {
      await api.del("/cart/" + productId);
      fetchCart();
    } catch (err) {
      alert("Error removing item: " + err.message);
    }
  };

  const checkout = async () => {
    try {
      await api.post("/cart/checkout", {});
      alert("Checkout successful (dummy)");
      fetchCart();
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Your Cart</h1>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading cart...</p>
      ) : cart.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl transition duration-200"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
              />
              <div className="flex-1 w-full">
                <h3 className="text-lg font-semibold text-gray-800">{item.product.title}</h3>
                <p className="text-gray-500 mt-1">Quantity: {item.qty}</p>
                <p className="text-blue-600 font-bold mt-2">₹ {item.product.price}</p>
              </div>
              <button
                onClick={() => remove(item.product._id)}
                className="mt-2 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 border-t pt-6">
            <h2 className="text-xl sm:text-2xl font-bold">Total: ₹ {total}</h2>
            <button
              onClick={checkout}
              className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
