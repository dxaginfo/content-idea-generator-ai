import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import alertReducer from './features/alert/alertSlice';
import ideaReducer from './features/ideas/ideaSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    ideas: ideaReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;