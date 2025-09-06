
import React from 'react';
import LoginPage from './pages/LoginPage';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserProfile from './pages/UserProfile';
import SellerRegistration from './pages/SellerRegistration';
import SellerProducts from './pages/SellerProducts';
import SellerOrders from './pages/SellerOrders';
import SellerRevenue from './pages/SellerRevenue';
import SellerStoreSettings from './pages/SellerStoreSettings';
import StorePage from './pages/StorePage';
import AdminManagement from './pages/AdminManagement';
import AdminLogsViewer from './pages/AdminLogsViewer';
import AdminSettings from './pages/AdminSettings';
import AdminCommissions from './pages/AdminCommissions';
import AdminIntegrations from './pages/AdminIntegrations';
import AdminLayout from './components/admin/AdminLayout';
import SellerLayout from './components/seller/SellerLayout';
import { useAuth } from './contexts/AuthContext';
import { useRouter } from './contexts/RouterContext';
import Header from './components/Header';
import CartSidePanel from './components/CartSidePanel';
import RegistrationSuccess from './pages/RegistrationSuccess';

const Navigate: React.FC<{ to: string }> = ({ to }) => {
  const { navigate } = useRouter();
  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
};

// --- Page router for routes that exist inside a standard layout ---
const PageRouter: React.FC = () => {
    const { path } = useRouter();
    const { user } = useAuth();

    if (path.startsWith('/products/')) {
        const parts = path.split('/');
        const productId = parts[2];
        if (productId) {
            return <ProductDetail productId={productId} />;
        }
    }
    
    if (path.startsWith('/store/')) {
        const parts = path.split('/');
        const storeId = parts[2];
        if (storeId) {
            return <StorePage storeId={storeId} />;
        }
    }

    switch (path) {
        // Protected Routes
        case '/dashboard':
            return <Dashboard />;
        case '/checkout':
            return <Checkout />;
        case '/order-confirmation':
            return <OrderConfirmation />;
        case '/profile':
            return <UserProfile />;
        case '/seller-registration':
            return <SellerRegistration />;
        case '/seller/products':
            return <SellerProducts />;
        case '/seller/orders':
            return <SellerOrders />;
        case '/seller/revenue':
            return <SellerRevenue />;
        case '/seller/store-settings':
            return <SellerStoreSettings />;
        case '/admin/management':
            return user?.role === 'ADMIN' ? <AdminManagement /> : <Navigate to="/dashboard" />;
        case '/admin/logs':
            return user?.role === 'ADMIN' ? <AdminLogsViewer /> : <Navigate to="/dashboard" />;
        case '/admin/settings':
            return user?.role === 'ADMIN' ? <AdminSettings /> : <Navigate to="/dashboard" />;
        case '/admin/commissions':
            return user?.role === 'ADMIN' ? <AdminCommissions /> : <Navigate to="/dashboard" />;
        case '/admin/integrations':
            return user?.role === 'ADMIN' ? <AdminIntegrations /> : <Navigate to="/dashboard" />;
        
        // Public Route
        case '/products':
            return <ProductCatalog />;

        // Fallback for authenticated users
        case '/':
        default:
            return <Navigate to="/dashboard" />;
    }
};

const App: React.FC = () => {
  const { user } = useAuth();
  const { path } = useRouter();

  // Handle routes with special full-page layouts first.
  // These are managed outside the standard app layout wrappers.
  if (path === '/login') {
    return user ? <Navigate to="/dashboard" /> : <LoginPage />;
  }
  if (path === '/registration-success') {
    return <RegistrationSuccess />;
  }

  // --- Unauthenticated User Flow ---
  if (!user) {
    if (path === '/') return <Landing />;
    
    // Allow public browsing of products & stores with a standard header
    if (path.startsWith('/products') || path.startsWith('/store')) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8 flex justify-center">
            <div className="w-full">
                <PageRouter />
            </div>
          </main>
          <CartSidePanel />
        </div>
      );
    }

    // For any other route, redirect unauthenticated users to landing page
    return <Navigate to="/" />;
  }

  // --- Authenticated User Flow ---
  // The user is guaranteed to be authenticated from this point on.

  // Admin section with its own dedicated layout
  if (user.role === 'ADMIN' && (path.startsWith('/admin') || path === '/dashboard')) {
      return (
          <AdminLayout>
              <PageRouter />
          </AdminLayout>
      );
  }
  
  // Approved Seller section with its own dedicated layout
  if (user.role === 'SELLER' && user.sellerStatus === 'APPROVED' && (path.startsWith('/seller') || path === '/dashboard')) {
      return (
          <SellerLayout>
              <PageRouter />
          </SellerLayout>
      );
  }

  // Default layout for authenticated users (Customers, Pending/Rejected Sellers)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="w-full">
            <PageRouter />
        </div>
      </main>
      <footer className="mt-8 pb-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Blife Healthy. All rights reserved.</p>
      </footer>
      <CartSidePanel />
    </div>
  );
};

export default App;