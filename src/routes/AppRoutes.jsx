import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/common/ScrollToTop.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import RequireAuth from './RequireAuth.jsx';
import AdminProtectedRoute from './AdminProtectedRoute.jsx';

import Home from '../pages/customer/Home.jsx';
import Shop from '../pages/customer/Shop.jsx';
import ProductDetails from '../pages/customer/ProductDetails.jsx';
import Cart from '../pages/customer/Cart.jsx';
import Checkout from '../pages/customer/Checkout.jsx';
import OrderSuccess from '../pages/customer/OrderSuccess.jsx';
import Contact from '../pages/customer/Contact.jsx';
import Login from '../pages/customer/Login.jsx';
import Register from '../pages/customer/Register.jsx';
import Account from '../pages/customer/Account.jsx';
import Orders from '../pages/customer/Orders.jsx';
import NotFound from '../pages/customer/NotFound.jsx';

import AdminLogin from '../pages/admin/AdminLogin.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import ProductsList from '../pages/admin/ProductsList.jsx';
import ProductForm from '../pages/admin/ProductForm.jsx';
import OrdersList from '../pages/admin/OrdersList.jsx';
import OrderDetails from '../pages/admin/OrderDetails.jsx';
import Settings from '../pages/admin/Settings.jsx';

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
        <Route path="/account/orders" element={<RequireAuth><Orders /></RequireAuth>} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductsList />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/:id/edit" element={<ProductForm />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
}
