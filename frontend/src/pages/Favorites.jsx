import React, { useEffect, useState } from "react";
import api from "../services/api.js";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavs = async () => {
    setLoading(true);
    try {
      const data = await api.get("/favorites");
      setFavorites(data);
    } catch (err) {
      alert("Error fetching favorites: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavs();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await api.del("/favorites/" + id);
      fetchFavs();
    } catch (err) {
      alert("Error removing favorite: " + err.message);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">❤️ Your Favorites</h1>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-gray-600 text-lg">You don’t have any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-200"
            >
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-48 sm:h-56 object-cover rounded-t-2xl transform hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-40">
                <h3 className="font-semibold text-gray-800 line-clamp-2 text-lg">{p.title}</h3>
                <p className="text-blue-600 font-bold mt-2 text-lg">₹ {p.price}</p>
                <button
                  onClick={() => removeFavorite(p._id)}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
