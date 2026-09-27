# DEVKOTA GROUPS E-commerce Platform

## Overview
A full-stack e-commerce application for DEVKOTA GROUPS, built as a modern storefront with product catalog, cart, checkout, seller dashboard, and user account flows.

## Tech Stack
- Frontend: React + Redux + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT
- Payment: Stripe-ready integration point

## Local Setup

1. Clone the repo
   ```bash
   git clone https://github.com/elliisshh/devkota-groups-ecommerce.git
   cd devkota-groups-ecommerce
   ```

2. Install dependencies
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. Configure environment variables
   ```bash
   cp server/.env.example server/.env
   ```

   Example:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/devkota-ecommerce
   JWT_SECRET=replace_with_a_long_random_secret
   CLIENT_ORIGIN=http://localhost:3000
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   ```

4. Start MongoDB locally

5. Run the app
   ```bash
   npm run dev
   ```

   Frontend in separate terminal:
   ```bash
   npm run client
   ```

## Production Deployment

### Frontend (Vercel / Netlify)
- Connect the `client` app
- Add environment variables such as:
  - `REACT_APP_API_URL=https://your-backend-url.com`

### Backend (Render / Railway / Fly.io)
- Deploy the root server directory
- Set environment variables for MongoDB and Stripe
- Set `CLIENT_ORIGIN` to your deployed frontend domain

### Database (MongoDB Atlas)
- Create a MongoDB Atlas cluster
- Use the connection string in `MONGODB_URI`

### Stripe
- Create a Stripe account
- Add your publishable and secret keys to your environment
- Replace the placeholder checkout flow with a real Stripe session if needed

## Features Included
- Customer login and registration
- Product catalog and search
- Product detail page
- Cart and checkout flow
- Wishlist support
- Seller dashboard and product add form
- Order history
- JWT-protected routes
- MongoDB-backed inventory checks

## Next Recommended Features
- Real Stripe payment integration
- Admin dashboard and seller role separation
- Product image upload
- Coupon system
- Review moderation
- Order status tracking
- Email notifications

## Repository
https://github.com/elliisshh/devkota-groups-ecommerce
