# DEVKOTA GROUPS E-commerce Platform

## Overview
A full-stack e-commerce application for DEVKOTA GROUPS - your trusted online marketplace for buying and selling products, similar to Amazon.

## Project Structure

```
devkota-groups-ecommerce/
├── server/              # Backend (Node.js + Express)
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── index.js        # Server entry point
├── client/             # Frontend (React + Redux)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   └── store.js    # Redux store
│   └── package.json
└── package.json        # Root dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/elliisshh/devkota-groups-ecommerce.git
   cd devkota-groups-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Setup environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configurations
   ```

4. **Start MongoDB**
   ```bash
   # Ensure MongoDB is running locally or set MONGODB_URI in .env
   ```

5. **Run the application**
   ```bash
   # Terminal 1 - Start backend
   npm run dev

   # Terminal 2 - Start frontend
   npm run client
   ```

   Or use `npm install -g concurrently` and run both simultaneously:
   ```bash
   npm run build
   ```

## Features

### Current Features
- ✅ User authentication (Register/Login)
- ✅ Product catalog and search
- ✅ Shopping cart management
- ✅ Product filtering by category
- ✅ User profile management
- ✅ Order history

### Coming Soon
- 🔄 Payment integration (Stripe)
- 🔄 Product reviews and ratings
- 🔄 Wishlist functionality
- 🔄 Seller dashboard
- 🔄 Admin panel
- 🔄 Email notifications
- 🔄 Order tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/search/query` - Search products

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId/add` - Add item to cart
- `DELETE /api/cart/:userId/remove/:productId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/:userId` - Get user orders

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Payment**: Stripe (coming soon)
- **File Upload**: Multer

### Frontend
- **Library**: React 18
- **State Management**: Redux
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: React Icons

## Contributing
Feel free to submit issues and enhancement requests!

## License
MIT License

## Support
For support, email: support@devkotagroups.com
