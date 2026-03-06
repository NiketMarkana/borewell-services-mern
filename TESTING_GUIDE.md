# How to Test All App Functionality

This guide provides step-by-step instructions to test and verify all the features of the Borewell Services MERN application.

## Prerequisites
Ensure that you have set up the project and your MongoDB database as described in the `SETUP_GUIDE.md` and that your `.env` file is properly configured.

## Step 1: Start the Application
1. Open a terminal in the project root directory (`borewell-services-mern`).
2. Run the following command to start both the backend and frontend servers:
   ```bash
   npm run dev
   ```
3. Wait for the terminal to display that the server is running on port 5000 and MongoDB is connected. The frontend will be available at `http://localhost:5173`.

## Step 2: Access the Application
1. Open your web browser and navigate to `http://localhost:5173`.
2. You will land on the **Homepage**. Here you can scroll to see:
   - The main hero section.
   - Quick links to Borewell Services, HDPE/PVC Pipes, Submersible Motors, and Maintenance guides.

## Step 3: Test User Registration
To interact with services and products, you need a user account.
1. Click on **Register** in the top navigation bar.
2. Fill in the form:
   - **Name**: Test User
   - **Phone**: 1234567890
   - **Email**: testuser@example.com
   - **Password**: password123
3. Click the **Register** button. If you are redirected or see a success message, the account was created successfully.

## Step 4: Test User Login
1. Click on **Login** in the top navigation bar.
2. Enter the credentials you just created:
   - **Email**: testuser@example.com
   - **Password**: password123
3. Click the **Login** button. You should now be logged in (the top navigation bar will change to show your name and options like "Orders" and "Logout").

## Step 5: Test Borewell Service Booking
1. Click on **Borewell Services** in the top navigation bar.
2. Fill out the service request form:
   - **Date**: Select a future date.
   - **Full Address**: Enter a sample address.
   - **Location Description**: Provide details about the site.
   - **Expected Depth**: e.g., 200 feet.
   - **Additional Notes**: Try adding some extra details.
3. Click **Submit Request**. A success alert should appear.

## Step 6: Test Product Ordering
1. Click on **Products** in the top navigation bar.
2. Select a category (e.g., HDPE Pipes, PVC Pipes, Submersible Motors).
3. Fill out the product order form details:
   - **Quantity**: e.g., 50.
   - **Unit**: (e.g., feet or meters).
   - **Expected Price / Budget**: Enter a value.
   - **Additional Details**: Add your requirements.
   - **Contact details**: Ensure phone/email is correct.
4. Click to place the order. A success alert should appear.

## Step 7: View Your Orders
1. Click on **Orders** (or your profile icon -> Orders) in the top navigation bar.
2. You should see a list of both the Service Requests and Product Orders you just placed.
3. Notice that their status will initially be **Pending**.

## Step 8: Test Admin Functionality
To test how an administrator manages orders, you need to log out and log in with the admin account.

1. Click **Logout** in the top navigation bar.
2. Click **Login** and enter the admin credentials (these were created during the database seeding process):
   - **Email**: admin@borewell.com
   - **Password**: admin123
3. Click the **Login** button.
4. You will now see an **Admin** tab or option in the navigation. Click on it to go to the **Admin Dashboard**.
5. In the Admin Dashboard, you will see a list of all orders from all users, including the ones you just created.
6. **Change Status**: Try changing the status of an order from *Pending* to *In Process* or *Approved* using the dropdown next to an order. Click the update button.
7. The order status will update, and a history log of the status change will be saved.

## Step 9: Verify Order Status Update
1. Log out from the admin account.
2. Log back in with your test user account (`testuser@example.com`).
3. Click on **Orders**.
4. Check the order you updated as the admin. The status should reflect the change (e.g., it now says *In Process*).

## Step 10: Explore Maintenance Instructions
1. Click on **Maintenance** in the top navigation bar.
2. Review the provided guidelines, "Do's and Don'ts", and warnings about when to call for service for Borewells, Submersible Pumps, and Pipes.

By completing these steps, you will have successfully tested all core functionalities of the Borewell Services application.
