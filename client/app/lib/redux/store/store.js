import { configureStore } from '@reduxjs/toolkit';
import cookieReducer from '../features/cookie/cookieSlice';

const store = configureStore({
  reducer: {
    cookie: cookieReducer,
  },
});

export default store;