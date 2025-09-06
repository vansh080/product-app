# Backend - Product API

## Setup
1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Seed DB (only first time):
   ```bash
   npm run seed
   ```
4. Start server:
   ```bash
   npm run dev   # development with nodemon
   # or
   npm start     # production run
   ```

## Important endpoints
- `POST /api/auth/register` { email, password } -> register (returns token)
- `POST /api/auth/login` { email, password } -> login (returns token)
- `GET /api/products` -> get products (supports ?search=&category=)
- `GET /api/products/:id` -> product details
- `POST /api/favorites` { productId } -> add favorite (Authorization: Bearer <token>)
- `GET /api/favorites` -> list favorites (Authorization: Bearer <token>)
- `DELETE /api/favorites/:id` -> remove favorite (Authorization: Bearer <token>)
- `POST /api/cart` { productId, qty } -> add to cart
- `GET /api/cart` -> get cart
- `DELETE /api/cart/:productId` -> remove from cart
- `POST /api/cart/checkout` -> dummy checkout

## Notes
- Use a strong `JWT_SECRET` in production.
- Do not commit `.env` with real secrets.
