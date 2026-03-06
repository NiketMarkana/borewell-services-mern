# Complete Setup Guide - Borewell Services MERN Project

## 📋 Prerequisites

### 1. Install Node.js
- Download Node.js LTS from: https://nodejs.org/
- Run the installer with default options
- Verify installation:
  ```bash
  node -v
  npm -v
  ```
  You should see version numbers (e.g., v18.x.x or higher)

---

## 🌐 MongoDB Atlas Setup (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://cloud.mongodb.com/
2. Click **"Sign Up"** or **"Log In"** if you already have an account
3. Sign up with your email or Google account

### Step 2: Create a Free Cluster
1. After login, click **"Build a Database"**
2. Choose **"FREE"** (M0) shared cluster
3. Select any cloud provider and region (choose closest to you)
4. Click **"Create"**
5. Wait 1-3 minutes for cluster creation

### Step 3: Create Database User
1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username**: `borewellUser` (or any name you prefer)
   - **Password**: Create a strong password (e.g., `Borewell@123!`)
   - **⚠️ IMPORTANT**: Save this password! You'll need it in `.env` file
5. Under **"Database User Privileges"**, select **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Configure Network Access (Allow Your IP)
1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - ⚠️ For production, use specific IPs only
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select:
   - **Driver**: Node.js
   - **Version**: Latest (4.1 or later)
4. Copy the connection string (looks like):
   ```
   mongodb+srv://borewellUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. **Replace `<password>`** with your actual password (the one you created in Step 3)
6. **Add database name** at the end (before `?`):
   ```
   mongodb+srv://borewellUser:YourPassword123!@cluster0.xxxxx.mongodb.net/borewell-services?retryWrites=true&w=majority&appName=Cluster0
   ```
7. **Save this complete connection string** - you'll use it in Step 7

---

## 🚀 Project Setup Steps

### Step 6: Navigate to Project Folder
Open PowerShell or Command Prompt and navigate to your project:
```bash
cd "C:\Users\niket\OneDrive\Desktop\sem 6\project 1\borewell-services-mern"
```

### Step 7: Create Backend Environment File
1. Navigate to backend folder:
   ```bash
   cd backend
   ```
2. Create `.env` file:
   ```bash
   # In PowerShell:
   New-Item -Path .env -ItemType File
   
   # Or use Notepad:
   notepad .env
   ```
3. Add this content to `.env` file (replace with YOUR Atlas connection string from Step 5):
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://borewellUser:YourPassword123!@cluster0.xxxxx.mongodb.net/borewell-services?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   JWT_EXPIRE=7d
   ```
   **⚠️ Replace:**
   - `borewellUser` with your actual username
   - `YourPassword123!` with your actual password
   - `cluster0.xxxxx` with your actual cluster URL
4. Save and close the file

### Step 8: Install All Dependencies
Go back to project root:
```bash
cd ..
```

Install dependencies:
```bash
# Install root dependencies (concurrently package)
npm install

# Install backend and frontend dependencies
npm run install-all
```

**If `install-all` doesn't work, install manually:**
```bash
# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

### Step 9: Seed Database (Create Admin User & Products)
```bash
cd backend
npm run seed
```

**Expected output:**
```
MongoDB Connected
Admin user created: admin@borewell.com
Products seeded successfully
```

**Admin Login Credentials Created:**
- **Email**: `admin@borewell.com`
- **Password**: `admin123`

### Step 10: (Optional) Frontend Environment Configuration
If you want to explicitly set API URL (usually not needed):
```bash
cd ../frontend
notepad .env
```

Add (optional):
```env
VITE_API_BASE=http://localhost:5000/api
```

Go back to root:
```bash
cd ..
```

---

## ▶️ Running the Project

### Step 11: Start Both Servers
From project root:
```bash
npm run dev
```

**Expected output:**
```
[0] Server running on port 5000
[0] MongoDB Connected
[1] 
[1]   VITE v5.x.x  ready in xxx ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
```

**Two servers are now running:**
- ✅ **Backend API**: http://localhost:5000
- ✅ **Frontend App**: http://localhost:5173

### Step 12: Open in Chrome
1. Open **Google Chrome**
2. Go to: **http://localhost:5173**
3. You should see the **Home page** with cards for:
   - Borewell Services
   - HDPE Pipe Products
   - PVC Pipe Products
   - Submersible Motor Products
   - Maintenance

---

## 🎯 How to Use the Application

### As a Regular User (Browse Without Login)
1. **Home Page**: View all service cards
2. **Products Page**: Browse HDPE, PVC, and Submersible products
3. **Maintenance Page**: Read maintenance guides
4. **Contact Page**: View company information

### As a Registered User
1. **Register**: Click "Register" → Fill form → Submit
2. **Login**: Use your credentials
3. **Submit Borewell Service Request**:
   - Go to **Services** page
   - Fill form (name, mobile, date, address, depth, etc.)
   - Click "Send Request"
4. **Order Products**:
   - Go to **Products** page
   - Select category (HDPE/PVC/Submersible)
   - Click on a product
   - Fill order form (price, quantity, unit, details, contact)
   - Click "Submit Order"
5. **View Orders**:
   - Go to **Orders** page
   - See all your orders with status badges
   - View status history with timestamps

### As Admin
1. **Login** with:
   - Email: `admin@borewell.com`
   - Password: `admin123`
2. **Access Admin Dashboard**:
   - Click "Admin" in navigation (only visible to admin)
   - View all orders (service + product)
3. **Update Order Status**:
   - Select an order
   - Choose new status from dropdown
   - Click "Update Status"
   - Status history is automatically updated with timestamp

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node -v` works)
- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string copied and updated in `.env`
- [ ] All dependencies installed (`npm install` completed)
- [ ] Database seeded (`npm run seed` successful)
- [ ] Both servers running (`npm run dev` shows no errors)
- [ ] Frontend opens in Chrome at http://localhost:5173
- [ ] Can browse products without login
- [ ] Can register/login
- [ ] Can submit orders
- [ ] Admin can access dashboard

---

## 🐛 Troubleshooting

### Issue: "MongoDB connection error"
- **Solution**: Check your `.env` file connection string
- Make sure password is URL-encoded (replace special chars like `@` with `%40`)
- Verify network access in Atlas allows your IP

### Issue: "Port 5000 already in use"
- **Solution**: Change `PORT=5000` to another port (e.g., `PORT=5001`) in `.env`
- Update frontend `.env` if you set `VITE_API_BASE`

### Issue: "Cannot find module"
- **Solution**: Run `npm install` in the specific folder (backend or frontend)

### Issue: "JWT_SECRET not defined"
- **Solution**: Make sure `.env` file exists in `backend` folder with `JWT_SECRET` defined

### Issue: Frontend can't connect to backend
- **Solution**: 
  - Check backend is running on port 5000
  - Check `VITE_API_BASE` in `frontend/.env` matches backend URL
  - Check browser console for CORS errors

---

## 📝 Expected Output Screenshots Description

### Home Page
- Hero section with company name
- Four main cards: Borewell Services, HDPE Products, PVC Products, Submersible Products
- Navigation bar with: Home, Products, Services, Maintenance, Orders, Contact, Login/Register

### Products Page
- Tabs for HDPE, PVC, Submersible categories
- Product cards with name, price, description
- "Order Now" button on each product
- Order form modal with: Price, Quantity, Unit dropdown, Additional Details, Mobile, Email

### Services Page
- Borewell service request form with fields:
  - Name, Mobile Number, Preferred Date
  - Address, Location Description
  - Depth (feet), Additional Requirements
  - "Send Request" button

### Orders Page (User)
- List of all user orders
- Status badges (color-coded): Pending (gray), Approved (blue), Processing (yellow), etc.
- Status history timeline showing when status changed
- Order details (items, contact info, dates)

### Admin Dashboard
- Two sections: Service Orders, Product Orders
- Table/list view of all orders
- Status dropdown for each order
- "Update Status" button
- Order details view

### Maintenance Page
- Three cards:
  1. Borewell Maintenance (Do's, Don'ts, Call Service If)
  2. HDPE & PVC Pipes Maintenance
  3. Submersible Motor Maintenance

---

## 🎓 Next Steps

1. **Customize Content**: Update company info in `frontend/src/components/Layout.jsx` and `frontend/src/pages/Contact.jsx`
2. **Add Product Images**: Update product images in seed script or add image upload feature
3. **Email Notifications**: Add email service for order confirmations
4. **Payment Integration**: Add payment gateway for product orders
5. **Deploy**: Deploy backend to Heroku/Railway and frontend to Vercel/Netlify

---

**🎉 You're all set! Happy coding!**

