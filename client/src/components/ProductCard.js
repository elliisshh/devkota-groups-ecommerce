import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const addToCart = () => dispatch({ type: 'ADD_TO_CART', payload: product });

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <Link to={`/product/${product._id}`} className="block relative h-48 bg-gray-200 overflow-hidden">
        <img src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300x200'} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform" />
        {product.originalPrice && product.price < product.originalPrice && <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded">Sale</span>}
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="hover:text-blue-600"><h3 className="font-semibold text-lg truncate">{product.name}</h3></Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || 'Quality product from DEVKOTA GROUPS.'}</p>
        <div className="flex items-center gap-2 mb-3"><div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <FaStar key={i} size={14} fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'} />)}</div><span className="text-gray-600 text-sm">({product.reviews?.length || 0})</span></div>
        <div className="flex items-center justify-between gap-2"><div><span className="text-2xl font-bold text-blue-600">${Number(product.price).toFixed(2)}</span>{product.originalPrice && <span className="text-gray-400 line-through ml-2">${Number(product.originalPrice).toFixed(2)}</span>}</div><button onClick={addToCart} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded">Add to Cart</button></div>
      </div>
    </article>
  );
};

export default ProductCard;
