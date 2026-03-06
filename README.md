# Borewell Services & Pipes – MERN

Full-stack MERN app for borewell services and HDPE/PVC/Submersible products with user/admin roles, order tracking, and maintenance guides.

## Stack
- **Backend:** Node.js, Express, MongoDB Atlas (Mongoose), JWT auth, bcrypt
- **Frontend:** React 18 + Vite, React Router

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed (v18+)
- MongoDB Atlas account (free tier)

### 2. Environment Setup
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

### 3. Installation
From the project root, run:
```bash
npm install
npm run install-all
```

### 4. Database Seeding
Initialize the database with default products and an admin user:
```bash
cd backend
npm run seed
```

### 5. Running the Application
From the project root:
```bash
npm run dev
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:5000](http://localhost:5000)

## 🔑 Default Credentials

For testing purposes, you can use the following accounts:
- **Admin:** `admin@borewell.com` / `admin123`
- **User:** `testuser@example.com` / `password123`

*See [CREDENTIALS.md](./CREDENTIALS.md) for full details.*

## Features
- Role-based access control (Admin, Employee, User).
- Submit and track Borewell service requests.
- Browse and order HDPE, PVC, and Submersible products.
- Real-time status updates with history tracking.
- Comprehensive maintenance guides for all service types.
