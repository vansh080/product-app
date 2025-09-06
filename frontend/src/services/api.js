const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

let token = null;
const defaultHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export default {
  setToken: (t) => { token = t; },
  get: async (path) => {
    const res = await fetch(`${API_BASE}${path}`, { headers: defaultHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API GET error');
    return data;
  },
  post: async (path, body) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(body || {})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API POST error');
    return data;
  },
  del: async (path) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: defaultHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API DELETE error');
    return data;
  }
};
