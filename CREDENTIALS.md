# Project Credentials

This file contains the default and test login credentials for the Borewell Services application.

## Admin Access
- **Email:** `admin@borewell.com`
- **Password:** `admin123`
- **Role:** Admin (Full access to dashboard and order management)

## Employee Access
- **Email:** `employee@borewell.com`
- **Password:** `employee123`
- **Role:** Employee (Access to view and update order status)
> [!NOTE]
> If this user doesn't exist, you can create a new user and promote them using the Admin Dashboard or by manually updating the `role` field in the database.

## Test User Access
- **Email:** `testuser@example.com`
- **Password:** `password123`
- **Role:** User (Can place orders and track their own status)

---
**Security Warning:** Change these passwords in a production environment. Do not commit sensitive production credentials to version control.
