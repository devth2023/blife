
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider } from './contexts/RouterContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { StoreProvider } from './contexts/StoreContext';
import { ProductProvider } from './contexts/ProductContext';
import { UserManagementProvider } from './contexts/UserManagementContext';
import { LogProvider } from './contexts/LogContext';
import { ReviewProvider } from './contexts/ReviewContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RouterProvider>
      <LogProvider>
        <AuthProvider>
          <UserManagementProvider>
            <StoreProvider>
              <ProductProvider>
                <CartProvider>
                  <OrderProvider>
                    <ReviewProvider>
                      <App />
                    </ReviewProvider>
                  </OrderProvider>
                </CartProvider>
              </ProductProvider>
            </StoreProvider>
          </UserManagementProvider>
        </AuthProvider>
      </LogProvider>
    </RouterProvider>
  </React.StrictMode>
);