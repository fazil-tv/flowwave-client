import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './user/userApi';
import { teamApi } from './user/teamApi';
import { adminApi } from './admin/adminApi';
import userReducer from './user/userSlice';
import adminReducer from './admin/adminSlice';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    user: userReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      teamApi.middleware, 
      adminApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
