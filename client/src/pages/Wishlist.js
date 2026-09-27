import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const Wishlist = () => {
  const wishlist = useSelector(state => state.wishlist || []);
  const dispatch = useDispatch();

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  if (!wishlist.length) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-gray-600">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(item => (
            <div key={item._id} className="bg-white rounded shadow p-4">
              <img src={item.thumbnail || 'https://via.placeholder.com/300x200'} alt={item.name} className="w-full h-40 object-cover rounded mb-3" />
              <h3 className="font-semibold mb-2">{item.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-3">${item.price}</p>
              <button onClick={() => removeFromWishlist(item._id)} className="w-full bg-red-500 text-white py-2 rounded">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
