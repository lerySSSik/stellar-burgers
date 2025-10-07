import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients-slice';
import constructorReducer from './slices/constructor-slice';
import orderReducer from './slices/order-slice';
import feedReducer from './slices/feed-slice';
import authReducer from './slices/auth-slice';
import userOrdersReducer from './slices/user-orders-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  auth: authReducer,
  userOrders: userOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;
