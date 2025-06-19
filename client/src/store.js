import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import ideaReducer from './features/ideas/ideaSlice';
import alertReducer from './features/alert/alertSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideaReducer,
    alert: alertReducer
  }
});