import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  ProtectedRoute,
  PublicRoute,
  ModalRoute,
  OrderInfo,
  IngredientDetails
} from '@components';
import { useDispatch } from '../../services/store';
import { checkAuth } from '../../services/slices/auth-slice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <ModalRoute title='Детали заказа'>
                <OrderInfo />
              </ModalRoute>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <ModalRoute title='Детали ингредиента'>
                <IngredientDetails />
              </ModalRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ModalRoute title='Детали заказа'>
                  <OrderInfo />
                </ModalRoute>
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
