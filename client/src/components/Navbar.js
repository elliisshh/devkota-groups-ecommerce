import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaUser, FaHome, FaHeart } from 'react-icons/fa';
import { MdSearch } from 'react-icons/md';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);
  const wishlist = useSelector(state => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 whitespace-nowrap"><FaHome /> DEVKOTA GROUPS</Link>
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="flex bg-white text-black rounded">
              <input type="search" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 outline-none" />
              <button className="px-4 bg-orange-500 rounded-r hover:bg-orange-600"><MdSearch size={20} /></button>
            </div>
          </form>
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="flex items-center gap-1 hover:text-yellow-300" title="Wishlist"><FaHeart /> ({wishlist.length})</Link>
            <Link to="/cart" className="flex items-center gap-1 hover:text-yellow-300" title="Shopping Cart"><FaShoppingCart /> ({cart.length})</Link>
            {user ? (
              <>
                <div className="dropdown relative group">
                  <button className="flex items-center gap-1 hover:text-yellow-300"><FaUser /> {user.name}</button>
                  <div className="absolute right-0 hidden group-hover:block bg-white text-black rounded shadow-lg">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Seller Dashboard</Link>
                    <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-100">Add Product</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
            )}
          </div>
        </div>
        <div className="flex gap-6 mt-4 text-sm flex-wrap">
          <Link to="/products" className="hover:text-yellow-300">All Products</Link>
          <Link to="/products?category=Electronics" className="hover:text-yellow-300">Electronics</Link>
          <Link to="/products?category=Fashion" className="hover:text-yellow-300">Fashion</Link>
          <Link to="/products?category=Home%20&%20Garden" className="hover:text-yellow-300">Home & Garden</Link>
          <Link to="/products?category=Sports" className="hover:text-yellow-300">Sports</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
