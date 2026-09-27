import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Initial state
const initialUserState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const initialCartState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

// User Reducer
const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.token);
      return action.payload;
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    default:
      return state;
  }
};

// Cart Reducer
const cartReducer = (state = initialCartState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item._id === action.payload._id);
      if (existingItem) {
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.payload);
    case 'UPDATE_CART':
      return state.map(item =>
        item._id === action.payload._id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case 'CLEAR_CART':
      localStorage.removeItem('cart');
      return [];
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

// Save cart to localStorage whenever it changes
store.subscribe(() => {
  localStorage.setItem('cart', JSON.stringify(store.getState().cart));
});

export default store;
