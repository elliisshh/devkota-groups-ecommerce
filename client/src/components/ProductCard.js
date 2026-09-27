import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.thumbnail || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform"
        />
        {product.originalPrice && product.price < product.originalPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded">
            Sale
          </div>
        )}
      </div>
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="hover:text-blue-600">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={14} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-gray-600 text-sm">({product.reviews?.length || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
