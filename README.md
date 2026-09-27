import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

const token = localStorage.getItem('token');
if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;

const initialUserState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const initialCartState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
const initialWishlistState = localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : [];

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('user', JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
        axios.defaults.headers.common.Authorization = `Bearer ${action.payload.token}`;
      }
      return action.payload;
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
      return null;
    default:
      return state;
  }
};

const cartReducer = (state = initialCartState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.find(item => item._id === action.payload._id);
      return existing ? state.map(item => item._id === action.payload._id ? { ...item, quantity: item.quantity + 1 } : item) : [...state, { ...action.payload, quantity: 1 }];
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.payload);
    case 'UPDATE_CART':
      return state.map(item => item._id === action.payload._id ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

const wishlistReducer = (state = initialWishlistState, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      return state.find(item => item._id === action.payload._id) ? state : [...state, action.payload];
    case 'REMOVE_FROM_WISHLIST':
      return state.filter(item => item._id !== action.payload);
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

store.subscribe(() => {
  localStorage.setItem('cart', JSON.stringify(store.getState().cart));
  localStorage.setItem('wishlist', JSON.stringify(store.getState().wishlist));
});

export default store;
