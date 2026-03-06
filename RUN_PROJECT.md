# 🚀 How to Run the Project - Step by Step

## ✅ Prerequisites Check

Before starting, make sure you have:
- [x] Node.js installed (check with `node -v`)
- [x] MongoDB Atlas account and cluster set up
- [x] `.env` file configured in `backend/` folder with correct MongoDB Atlas connection string

---

## 📋 Step-by-Step Instructions

### Step 1: Open Terminal/PowerShell

Navigate to your project root directory:
```bash
cd "C:\Users\niket\OneDrive\Desktop\sem 6\project 1\borewell-services-mern"
```

**Expected:** You should see the project folder in your terminal.

---

### Step 2: Verify .env File Exists

Check if `backend/.env` file exists and has correct content:

```bash
# In PowerShell, check if file exists:
Test-Path backend\.env

# Or view the file (don't show password):
Get-Content backend\.env
```

**Expected Output:**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/borewell-services?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
```

**⚠️ If `.env` doesn't exist:** Create it in `backend/` folder with the above content (replace with your actual MongoDB Atlas credentials).

---

### Step 3: Install Dependencies (First Time Only)

If you haven't installed dependencies yet, run:

```bash
npm install
npm run install-all
```

**Expected Output:**
```
added 50 packages, and audited 51 packages in 10s

> borewell-services-mern@1.0.0 install-all
> cd backend && npm install && cd ../frontend && npm install

added 200 packages, and audited 201 packages in 15s

added 300 packages, and audited 301 packages in 20s
```

**✅ Success:** Dependencies installed successfully.

---

### Step 4: Seed Database (First Time Only)

If you haven't seeded the database yet, run:

```bash
cd backend
npm run seed
```

**Expected Output:**
```
MongoDB connected
Admin user created: admin@borewell.com / admin123
Products seeded
Seed completed
```

**✅ Success:** Database is seeded with admin user and products.

**Admin Credentials Created:**
- **Email:** `admin@borewell.com`
- **Password:** `admin123`

**Note:** If you see "Admin user already exists", that's fine - it means the database was already seeded.

---

### Step 5: Start the Application

From project root directory:

```bash
cd ..
npm run dev
```

**Expected Output:**
```
[0] Server running on port 5000
[0] MongoDB Connected
[1] 
[1]   VITE v5.x.x  ready in 500 ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
[1]   ➜  press h + enter to show help
```

**✅ Success:** Both servers are running!
- **Backend API:** http://localhost:5000
- **Frontend App:** http://localhost:5173

---

### Step 6: Open in Browser

1. Open **Google Chrome** (or any modern browser)
2. Navigate to: **http://localhost:5173**

**Expected:** Home page loads with navigation and service cards.

---

## 🎯 Expected Output - What You Should See

### 🌐 In Browser (http://localhost:5173)

#### 1. **Home Page**
- **Navigation Bar:** Home, Products, Services, Maintenance, Orders, Contact, Login/Register buttons
- **Hero Section:** Company name/logo area
- **Four Main Cards:**
  - 🚰 Borewell Services
  - 🔵 HDPE Pipe Products
  - 🟢 PVC Pipe Products
  - ⚙️ Submersible Motor Products
- **Footer:** Contact information, company details

#### 2. **Products Page** (Click "Products" in navigation)
- **Three Tabs:** HDPE, PVC, Submersible
- **Product Cards** showing:
  - Product name
  - Category badge
  - Price (e.g., ₹120/meter)
  - Description
  - "Order Now" button
- **Product List (HDPE):**
  - Sprinkler Pipe - ₹120/meter
  - Coil Pipe - ₹90/meter
  - Black Pipe - ₹80/meter
- **Product List (PVC):**
  - 0.5 to 2 INCH UPVC PIPE - ₹75/meter
  - AGRICULTURAL PVC PIPE - ₹70/meter
  - PVC PIPE - ₹65/meter
  - 3-4 INCH PVC PIPE - ₹95/meter
  - 1 INCH PVC PIPE - ₹60/meter
  - AGRICULTURAL PVC ROUND PIPE - ₹85/meter
  - HIGH QUALITY AGRICULTURAL PVC PIPE - ₹110/meter
- **Product List (Submersible):**
  - 1HP Submersible Pump - ₹8500/piece
  - 1.5HP Submersible Pump - ₹9800/piece

#### 3. **Services Page** (Click "Services" in navigation)
- **Borewell Service Request Form** with fields:
  - Name (text input)
  - Mobile Number (text input)
  - Preferred Date (date picker)
  - Address (textarea)
  - Location Description (textarea)
  - Depth in Feet (number input)
  - Additional Requirements (textarea)
  - "Send Request" button
- **Note:** You must be logged in to submit the form

#### 4. **Maintenance Page** (Click "Maintenance" in navigation)
- **Three Maintenance Cards:**

  **Card 1: Borewell Maintenance**
  - ✅ **Do:** Use regularly, install sand filter, keep cap sealed, etc.
  - ❌ **Avoid:** Over-pumping, running pump when water is low, etc.
  - 🛠 **Call Service If:** Water turns muddy, sudden drop in yield, pump vibration

  **Card 2: HDPE & PVC Pipes Maintenance**
  - ✅ **Do:** Protect from sunlight, check joints, flush pipeline
  - ❌ **Avoid:** Sharp bends, exceeding pressure, dragging pipes
  - 🛠 **Call Service If:** Cracks appear, frequent leakage, pressure drop

  **Card 3: Submersible Motor Maintenance**
  - ✅ **Do:** Ensure proper voltage, install dry-run protection, run regularly
  - ❌ **Avoid:** Frequent ON/OFF, running without water, undersized cables
  - 🛠 **Call Service If:** Motor trips, low pressure, burning smell

#### 5. **Contact Page** (Click "Contact" in navigation)
- Company information
- Contact details (phone, email, address)
- Business hours (if provided)

---

## 👤 Testing as Regular User

### 1. **Register New Account**
- Click **"Register"** in navigation
- Fill form:
  - Name: `Test User`
  - Email: `test@example.com`
  - Phone: `9876543210`
  - Password: `test123` (min 6 characters)
- Click **"Register"** button

**Expected:** Success message, automatically logged in, redirected to home page

### 2. **Browse Products (Without Login)**
- Go to **Products** page
- Click different tabs (HDPE, PVC, Submersible)
- Click on a product card

**Expected:** Product details and order form appear (but you need to login to submit)

### 3. **Submit Borewell Service Request**
- **Login** first (or register)
- Go to **Services** page
- Fill the form completely
- Click **"Send Request"**

**Expected:** Success message, form submitted, can see order in Orders page

### 4. **Order Product**
- Go to **Products** page
- Select a product (e.g., "Sprinkler Pipe")
- Fill order form:
  - Price: `120`
  - Quantity: `10`
  - Unit: `meter` (from dropdown)
  - Additional Details: `Need delivery by next week`
  - Mobile: `9876543210`
  - Email: `test@example.com`
- Click **"Submit Order"**

**Expected:** Success message, order created, can see in Orders page

### 5. **View Orders**
- Click **"Orders"** in navigation
- See list of your orders with:
  - Order ID/Date
  - Order Type (Service/Product)
  - Status Badge (color-coded):
    - 🟡 Pending (yellow/gray)
    - 🔵 Approved (blue)
    - 🟠 Processing/In Process (orange)
    - 🟢 Delivered/Completed (green)
    - 🔴 Cancelled (red)
  - Status History Timeline
  - Order Details

**Expected:** All your orders listed with current status

---

## 👨‍💼 Testing as Admin

### 1. **Login as Admin**
- Click **"Login"** in navigation
- Enter credentials:
  - Email: `admin@borewell.com`
  - Password: `admin123`
- Click **"Login"**

**Expected:** Logged in, **"Admin"** link appears in navigation

### 2. **Access Admin Dashboard**
- Click **"Admin"** in navigation (only visible when logged in as admin)

**Expected:** Admin dashboard with two sections:
- **Service Orders** table/list
- **Product Orders** table/list

### 3. **View All Orders**
- See all orders from all users
- Orders displayed with:
  - User details
  - Order details
  - Current status
  - Created date

**Expected:** Complete list of all orders in the system

### 4. **Update Order Status**
- Select an order
- Choose new status from dropdown:
  - **For Service Orders:** Pending → Approved → In Process → Completed/Cancelled
  - **For Product Orders:** Pending → Approved → Processing → Shipped/Dispatched → Delivered/Cancelled
- Click **"Update Status"** button

**Expected:** 
- Status updated successfully
- Status history automatically updated with timestamp
- User can see updated status in their Orders page

---

## 🖥️ Terminal/Console Output

### During Development (`npm run dev`)

**Expected Terminal Output:**
```
[0] Server running on port 5000
[0] MongoDB Connected
[1] VITE v5.x.x  ready in 500 ms
[1] ➜  Local:   http://localhost:5173/
```

**When API is called (you'll see in [0] terminal):**
```
[0] GET /api/products 200
[0] POST /api/auth/login 200
[0] POST /api/orders/service 201
[0] GET /api/orders/my-orders 200
```

**When Error Occurs:**
```
[0] MongoDB connection error: [error details]
[0] GET /api/products 500
```

---

## ✅ Success Indicators

### ✅ Everything Working Correctly If:
- [x] Backend shows "Server running on port 5000" and "MongoDB Connected"
- [x] Frontend shows "VITE ready" with localhost:5173
- [x] Browser opens successfully without errors
- [x] Home page loads with all cards visible
- [x] Navigation links work
- [x] Can browse products without login
- [x] Can register/login successfully
- [x] Can submit service requests when logged in
- [x] Can submit product orders when logged in
- [x] Can view orders in Orders page
- [x] Admin can access dashboard
- [x] Admin can update order statuses

---

## 🐛 Common Issues & Quick Fixes

### Issue: "Cannot find module"
**Fix:** Run `npm install` in the specific folder (backend or frontend)

### Issue: "Port 5000 already in use"
**Fix:** Change `PORT=5001` in `backend/.env` or close the process using port 5000

### Issue: "MongoDB connection error"
**Fix:** Check `.env` file has correct MongoDB Atlas connection string

### Issue: "Frontend can't connect to backend"
**Fix:** Make sure backend is running on port 5000, check `VITE_API_BASE` in `frontend/.env` if set

### Issue: Page shows blank or errors
**Fix:** Check browser console (F12) for errors, make sure both servers are running

---

## 🎉 Project Successfully Running!

When everything works:
- ✅ Both servers running (backend on 5000, frontend on 5173)
- ✅ Website loads in browser
- ✅ Can browse products and services
- ✅ Can register/login
- ✅ Can place orders
- ✅ Admin can manage orders
- ✅ Status tracking works

**Your MERN stack borewell services application is now fully functional!** 🚀

