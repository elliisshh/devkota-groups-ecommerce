import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');

  const loadProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError('Product could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    navigate('/cart');
  };

  const addToWishlist = () => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const submitReview = async e => {
    e.preventDefault();
    if (!user) return setReviewMessage('Please log in to submit a review.');
    try {
      await axios.post(`/api/products/${id}/review`, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      setReviewMessage('Thanks! Your review has been added.');
      await loadProduct();
    } catch (err) {
      setReviewMessage(err.response?.data?.message || 'Could not post review.');
    }
  };

  if (loading) return <div className="container py-12 text-center">Loading product...</div>;
  if (error || !product) return <div className="container py-12 text-center"><p className="text-red-600 mb-4">{error || 'Product not found.'}</p><Link to="/products" className="text-blue-600">Back to products</Link></div>;

  return (
    <div className="container py-12">
      <div className="bg-white rounded-lg shadow-md p-6 grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/600x450'} alt={product.name} className="w-full h-96 object-contain rounded bg-gray-50" />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">{product.category || 'DEVKOTA GROUPS'}</p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description || 'No description available.'}</p>
          <p className="text-3xl font-bold text-blue-600 mb-2">${Number(product.price).toFixed(2)}</p>
          {product.originalPrice && <p className="text-gray-400 line-through mb-4">${Number(product.originalPrice).toFixed(2)}</p>}
          <p className="mb-6 text-sm text-gray-600">{product.stock > 0 ? `${product.stock} items available` : 'Currently out of stock'}</p>

          <div className="flex gap-3 mb-6">
            <button disabled={!product.stock} onClick={addToCart} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold">Add to Cart</button>
            <button onClick={addToWishlist} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">Wishlist</button>
          </div>

          <div className="border-t pt-6 text-sm text-gray-600">
            <p>Seller: {product.seller?.name || 'DEVKOTA GROUPS'}</p>
            <p className="mt-2">Rating: {Number(product.rating || 0).toFixed(1)} / 5</p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {product.reviews?.length ? (
          <div className="space-y-4 mb-8">
            {product.reviews.map((rev, i) => (
              <div key={i} className="border-b pb-4">
                <p className="font-semibold">{rev.userName || 'Customer'}</p>
                <p className="text-yellow-500">{'★'.repeat(rev.rating || 0)}</p>
                <p className="text-gray-700 mt-2">{rev.comment || 'Great product.'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mb-8">No reviews yet. Be the first to review this product.</p>
        )}

        <form onSubmit={submitReview} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Rating</label>
            <select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="border rounded px-3 py-2 w-full md:w-40">
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Comment</label>
            <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} rows="4" className="w-full border rounded px-3 py-2" placeholder="Write your review..." required />
          </div>

          {reviewMessage && <p className="text-sm text-green-700 bg-green-100 p-3 rounded">{reviewMessage}</p>}

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetail;
