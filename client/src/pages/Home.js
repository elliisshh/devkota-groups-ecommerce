import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBox, FaTruck, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const features = [
    { icon: <FaBox />, title: 'Wide Selection', desc: 'Millions of products from trusted sellers' },
    { icon: <FaTruck />, title: 'Fast Shipping', desc: 'Free shipping on orders over $50' },
    { icon: <FaShieldAlt />, title: 'Secure', desc: '100% secure transactions with buyer protection' }
  ];

  const categories = [
    { name: 'Electronics', icon: '📱', query: 'Electronics' },
    { name: 'Fashion', icon: '👕', query: 'Fashion' },
    { name: 'Home & Garden', icon: '🏠', query: 'Home & Garden' },
    { name: 'Sports', icon: '⚽', query: 'Sports' }
  ];

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to DEVKOTA GROUPS</h1>
          <p className="text-xl md:text-2xl mb-8">Shop millions of products at unbeatable prices</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center gap-2">Shop Now <FaArrowRight /></Link>
            <Link to="/admin/products" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold">Become a Seller</Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose DEVKOTA GROUPS?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.query} to={`/products?category=${cat.query}`} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition cursor-pointer">
                <div className="text-5xl mb-3">{cat.icon}</div>
                <h3 className="text-xl font-semibold">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Shopping?</h2>
          <p className="text-xl text-gray-600 mb-8">Discover amazing deals and products from trusted sellers worldwide.</p>
          <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-block">Explore All Products</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
