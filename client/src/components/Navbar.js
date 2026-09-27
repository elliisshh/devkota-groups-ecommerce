import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaHome } from 'react-icons/fa';
import { MdSearch } from 'react-icons/md';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector(state => state.user);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${searchQuery}`;
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <FaHome /> DEVKOTA GROUPS
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 mx-8">
            <div className="flex bg-white text-black rounded">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600">
                <MdSearch size={20} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-6">
            <Link to="/cart" className="flex items-center gap-2 hover:text-yellow-300">
              <FaShoppingCart size={20} /> Cart
            </Link>
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 hover:text-yellow-300">
                <FaUser size={20} /> {user.name}
              </Link>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="hover:text-yellow-300">Login</Link>
                <Link to="/register" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">Register</Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          <Link to="/products" className="hover:text-yellow-300">All Products</Link>
          <a href="#" className="hover:text-yellow-300">Electronics</a>
          <a href="#" className="hover:text-yellow-300">Fashion</a>
          <a href="#" className="hover:text-yellow-300">Home & Garden</a>
          <a href="#" className="hover:text-yellow-300">Sports</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
