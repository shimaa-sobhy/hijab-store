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
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          theme="light"
          progressStyle={{ background: 'var(--pink)' }}
          toastClassName="ds-toast"
        />
      </CartProvider>
    </AuthProvider>
  );
}
