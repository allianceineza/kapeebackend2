# Kapee Backend

A Node.js backend for an e-commerce application built with TypeScript, Express, and MongoDB.

## Features

- User authentication and authorization
- Product management
- Category management
- Shopping cart
- Order management
- Contact form
- File uploads with Cloudinary

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables
4. Run the development server: `npm run dev`
5. Build for production: `npm run build`
6. Start production server: `npm start`

## Environment Variables

- PORT: Server port (default: 5000)
- JWT_SECRET: JWT secret key
- EMAIL_USER: Gmail address for sending emails
- EMAIL_PASS: Gmail app password
- CLOUDINARY_CLOUD_NAME: Cloudinary cloud name
- CLOUDINARY_API_KEY: Cloudinary API key
- CLOUDINARY_API_SECRET: Cloudinary API secret

## API Endpoints

### User
- POST /api/user/SignupForm - Register a new user
- POST /api/user/login - Login
- GET /api/user/getAllUsers - Get all users (admin)
- GET /api/user/getUserById/:id - Get user by ID
- DELETE /api/user/deleteUser/:id - Delete user (admin)
- DELETE /api/user/bulkDeleteUsers - Bulk delete users (admin)
- PUT /api/user/updateUserRole/:id - Update user role (admin)
- GET /api/user/getUserStats - Get user statistics (admin)

### Product
- POST /api/product/create - Create product (admin)
- GET /api/product/getAll - Get all products
- GET /api/product/get/:id - Get product by ID
- PUT /api/product/update/:id - Update product (admin)
- DELETE /api/product/delete/:id - Delete product (admin)

### Category
- POST /api/category/create - Create category (admin)
- GET /api/category/getAll - Get all categories
- GET /api/category/get/:id - Get category by ID
- PUT /api/category/update/:id - Update category (admin)
- DELETE /api/category/delete/:id - Delete category (admin)

### Cart
- POST /api/cart/add - Add to cart
- GET /api/cart/get - Get cart
- DELETE /api/cart/remove/:productId - Remove from cart
- PUT /api/cart/update - Update cart item

### Order
- POST /api/order/create - Create order
- GET /api/order/getUserOrders - Get user orders
- GET /api/order/getAll - Get all orders (admin)
- PUT /api/order/updateStatus/:id - Update order status (admin)

### Contact
- POST /api/contact/submit - Submit contact form
- GET /api/contact/getAll - Get all contacts (admin)
