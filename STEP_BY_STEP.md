# STEP-BY-STEP: Explanation and file-by-file guide (high level)

This file explains the purpose of each major file and the important lines so you can learn line-by-line what each part does.

## Backend (backend/)
- package.json (type: "module"): ensures Node uses ES modules so imports use `import ... from ...`.
- .env.example: example environment variables (MONGODB_URI, JWT_SECRET, PORT).
- src/index.js
  - Imports: express, cors, morgan, dotenv — set up server and middleware.
  - connectDB(): connects to MongoDB using src/config/db.js.
  - app.use('/api/auth', authRoutes) etc.: mounts routers for authentication, products, favorites, cart.
  - error middlewares (notFound, errorHandler) handle errors uniformly.
- src/config/db.js: uses mongoose.connect with MONGODB_URI and handles connection errors.
- src/models/Product.js: Mongoose Product schema (title, description, price, category, image).
- src/models/User.js: Mongoose User schema (email, hashed password, favorites array, cart array).
- src/routes/auth.js: Register and Login endpoints.
  - POST /api/auth/register: validates email, checks if user exists, hashes password with bcrypt, saves user.
  - POST /api/auth/login: finds user by email, compares password, returns JWT token (signed with JWT_SECRET).
- src/middleware/auth.js:
  - protect middleware: reads Authorization header, verifies JWT, sets req.userId to the logged-in user id.
- src/routes/products.js:
  - GET /api/products: supports query parameters: search (name), category and returns products list.
  - GET /api/products/:id: validates ID and returns product details or 404.
- src/routes/favorites.js:
  - Protected routes: POST to add favorite, GET to list favorites, DELETE to remove favorite.
  - Uses User model favorites array (stores product ObjectIds).
- src/routes/cart.js:
  - Protected routes: manage user's cart (add, read, remove items) and POST /checkout to simulate checkout and clear cart.
- scripts/seed.js:
  - Reads seed/products.json and inserts into DB if products collection is empty.
- seed/products.json: 30 sample products with image URLs that are publicly reachable.

## Frontend (frontend/)
- Uses Vite + React (ES module imports).
- package.json: vite dev/build scripts.
- src/main.jsx: React entry, BrowserRouter and mounts App.
- src/App.jsx: App layout and routes (Home, ProductPage, Favorites, Cart, Auth).
- src/services/api.js: fetch wrapper — handles default headers, token injection, GET/POST/DELETE helpers; centralizes API base URL.
- src/components/ProductCard.jsx: reusable product card with Favorite and Add to Cart buttons. Favorite button calls backend API and toggles UI.
- src/pages/Home.jsx: Product listing + search input + category dropdown + simple client-side filters and server-side queries (search & category forwarded to backend query params).
- src/pages/ProductPage.jsx: fetches /api/products/:id and shows details.
- src/pages/Favorites.jsx: shows user favorites by calling GET /api/favorites (protected).
- src/pages/Cart.jsx: manage cart items; Checkout button calls POST /api/cart/checkout and clears cart on success.
- src/pages/Auth.jsx: Login & Register forms with email validation and helpful error messages (e.g. "User already registered").

## How the auth & favorites link together (important)
- Backend: JWT tokens are issued at login/register and expected on protected requests in the Authorization header as `Bearer <token>`.
- Frontend: api.setToken(token) stores token in memory/localStorage and api helper attaches it to fetch requests automatically.

## Running locally (overview)
1. Backend
   - create a `.env` file (copy `.env.example`) and set `MONGODB_URI` and `JWT_SECRET`.
   - `npm install`
   - `npm run seed` (only once) to insert 30 default products
   - `npm run dev` to start backend (nodemon) or `npm start` to run once.

2. Frontend
   - `npm install`
   - `npm run dev` to start Vite dev server
   - Open browser at http://localhost:5173 (default Vite port). Frontend expects backend at http://localhost:5000 (you can configure API base URL in frontend/src/services/api.js).

## Production readiness notes
- Backend uses environment variables for secrets and DB connection; do not commit `.env` to git.
- Passwords are hashed using bcrypt.
- Errors are caught and returned with consistent HTTP status codes and messages.
- Input validation is present on critical endpoints (auth, product id checks).
- Frontend gracefully shows error messages returned from backend.

---
If you want a per-line commentary for any **single file**, tell me which file and I will paste a line-by-line explanation for that file next.
