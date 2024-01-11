import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authentication/authReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
