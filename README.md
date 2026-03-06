# Borewell Services & Pipes – MERN

Full-stack MERN app for borewell services and HDPE/PVC/Submersible products with user/admin roles, order tracking, and maintenance guides.

## Stack
- Backend: Node.js, Express, MongoDB Atlas (Mongoose), JWT auth, bcrypt
- Frontend: React 18 + Vite, React Router

## 📖 Complete Setup Guide

**👉 See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed step-by-step instructions with MongoDB Atlas setup.**

## 🚀 How to Run the Project

**👉 See [RUN_PROJECT.md](./RUN_PROJECT.md) for complete step-by-step run instructions with expected output.**

## Quick start (Summary)

### Prerequisites
- Node.js installed (v18+)
- MongoDB Atlas account (free tier)

### Steps
```bash
# 1) Install dependencies
npm install
npm run install-all

# 2) Create backend/.env file with MongoDB Atlas connection:
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/borewell-services?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# 3) Seed database (creates admin user and products)
cd backend
npm run seed
# Admin credentials: admin@borewell.com / admin123

# 4) Run both servers
cd ..
npm run dev
# Backend: http://localhost:5000
# Frontend: http://localhost:5173 (open in Chrome)
```

## Features
- Public browsing of products/services; login required to submit orders.
- Roles: user, admin (JWT protected).
- Borewell service request form (name, mobile, date, address, location description, depth, notes).
- Product ordering for HDPE, PVC, Submersible (price, qty, unit, additional details, contact).
- Status flows:
  - Service: Pending → Approved → In Process → Completed/Cancelled
  - Products: Pending → Approved → Processing → Shipped/Dispatched → Delivered/Cancelled
- Orders page for users (status history, timestamps).
- Admin dashboard to view all orders and update status with history.
- Maintenance page with Do/Avoid/Call-service tips for Borewell, HDPE/PVC, Submersible.
- Contact/About info and Amazon/Flipkart-inspired card layout.

## Expected output (UX walkthrough)
- Home: hero + cards for Borewell Services, HDPE, PVC, Submersible, Maintenance.
- Services: borewell request form, submit then see “Track in Orders”.
- Products: tabbed categories; select product → fill price/qty/unit/details/contact → submit → success toast/alert.
- Orders: list all user orders with colored status chips and history timestamps.
- Admin: list all orders, select a new status from dropdown, click Update to append history.
- Maintenance: three cards showing the provided checklists.

## API overview
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Products: `GET /api/products`, `GET /api/products/:id`
- Orders (user): `POST /api/orders/service`, `POST /api/orders/product`, `GET /api/orders/my-orders`, `GET /api/orders/:id`
- Admin: `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status`

## Notes
- Remember to change `JWT_SECRET` in production.
- `VITE_API_BASE` can be set for the frontend (defaults to http://localhost:5000/api).
- Adjust contact/company details in `frontend/src/components/Layout.jsx` and `src/pages/Contact.jsx`.

