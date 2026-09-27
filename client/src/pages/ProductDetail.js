import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(({ data }) => setProduct(data)).catch(() => setError('Product could not be loaded.')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container py-12 text-center">Loading product...</div>;
  if (error || !product) return <div className="container py-12 text-center"><p className="text-red-600 mb-4">{error || 'Product not found.'}</p><Link to="/products" className="text-blue-600">Back to products</Link></div>;

  const addToCart = () => { dispatch({ type: 'ADD_TO_CART', payload: product }); navigate('/cart'); };
  return <div className="container py-12"><div className="bg-white rounded-lg shadow-md p-6 grid md:grid-cols-2 gap-8">
    <img src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/600x450'} alt={product.name} className="w-full h-96 object-contain rounded bg-gray-50" />
    <div><p className="text-sm text-gray-500 mb-2">{product.category || 'DEVKOTA GROUPS'}</p><h1 className="text-4xl font-bold mb-4">{product.name}</h1><p className="text-gray-600 mb-6">{product.description || 'No description available.'}</p><p className="text-3xl font-bold text-blue-600 mb-2">${Number(product.price).toFixed(2)}</p><p className="mb-6">{product.stock > 0 ? `${product.stock} available` : 'Currently out of stock'}</p><button disabled={!product.stock} onClick={addToCart} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold">Add to Cart</button></div>
  </div></div>;
};
export default ProductDetail;
