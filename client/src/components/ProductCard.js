import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const addToCart = () => dispatch({ type: 'ADD_TO_CART', payload: product });
  const addToWishlist = () => dispatch({ type: 'ADD_TO_WISHLIST', payload: product });

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <Link to={`/product/${product._id}`} className="block relative h-48 bg-gray-200 overflow-hidden group">
        <img src={product.thumbnail || 'https://via.placeholder.com/300x200'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
        {product.originalPrice && product.price < product.originalPrice && <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">Sale</span>}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="hover:text-blue-600"><h3 className="font-semibold text-lg truncate">{product.name}</h3></Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || 'Quality product'}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex text-yellow-400 text-sm">{[...Array(5)].map((_, i) => <span key={i}>{'⭐'.repeat(Math.min(i + 1, Math.floor(product.rating || 0)))}</span>)}</div>
          <span className="text-gray-600 text-xs">({product.reviews?.length || 0})</span>
        </div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-2xl font-bold text-blue-600">${Number(product.price).toFixed(2)}</span>
            {product.originalPrice && <span className="text-gray-400 line-through ml-2 text-sm">${Number(product.originalPrice).toFixed(2)}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={addToCart} disabled={!product.stock} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1"><FaShoppingCart /> Add</button>
          <button onClick={addToWishlist} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"><FaHeart /></button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
