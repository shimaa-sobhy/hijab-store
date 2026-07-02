import React from 'react';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          pauseOnHover
          draggable={false}
          theme="light"
          toastClassName="ds-toast"
          bodyClassName="ds-toast__body"
          progressClassName="ds-toast__progress"
          closeButton={false}
          icon={false}
        />
      </CartProvider>
    </AuthProvider>
  );
}
