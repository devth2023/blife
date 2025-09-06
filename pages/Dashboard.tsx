

import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/icons/Logo';
import { useRouter } from '../contexts/RouterContext';
import { useOrder } from '../contexts/OrderContext';
import { useUserManagement } from '../contexts/UserManagementContext';
import { useStore } from '../contexts/StoreContext';
import { StatCard } from '../components/ui/StatCard';
import { DollarSignIcon } from '../components/icons/DollarSignIcon';
import { ShoppingBagIcon } from '../components/icons/ShoppingBagIcon';
import { UserCheckIcon } from '../components/icons/UserCheckIcon';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { ClipboardListIcon } from '../components/icons/ClipboardListIcon';
import { UserPlusIcon } from '../components/icons/UserPlusIcon';
import { StoreIcon } from '../components/icons/StoreIcon';


const CustomerFeatures = [
    { title: 'Order History', subtitle: 'ดูประวัติการสั่งซื้อของคุณ', path: '/profile' },
    { title: 'Manage Profile', subtitle: 'อัปเดตข้อมูลส่วนตัว', path: '/profile' },
    { title: 'Saved Addresses', subtitle: 'จัดการที่อยู่จัดส่ง', path: '/saved-addresses' },
    { title: 'Support Center', subtitle: 'ติดต่อฝ่ายสนับสนุน', path: '/support-center' },
];

const SellerStatusCard: React.FC = () => {
    const { user } = useAuth();
    const { navigate } = useRouter();
    
    if (user?.sellerStatus === 'PENDING') {
        return (
             <div className="mb-8 p-6 bg-yellow-100/50 rounded-lg border border-yellow-200 text-center">
                <h2 className="text-xl font-semibold text-yellow-800">Application Pending Review</h2>
                <p className="text-yellow-700 mt-1">Your application to become a seller is currently under review. We'll notify you soon!</p>
            </div>
        )
    }

    if (user?.sellerStatus === 'NONE' || user?.sellerStatus === 'REJECTED') {
        return (
             <div className="mb-8 p-6 bg-emerald-100/50 rounded-lg border border-emerald-200 text-center">
                <h2 className="text-xl font-semibold text-gray-800">Want to sell your products?</h2>
                <p className="text-gray-600 mt-1 mb-4">Join our community of sellers and grow your business.</p>
                <Button onClick={() => navigate('/seller-registration')}>
                    Become a Seller
                </Button>
            </div>
        )
    }
    
    return null;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const renderContent = () => {
      switch (user?.role) {
          case 'SELLER':
            if (user.sellerStatus === 'APPROVED') {
                return { title: '', features: [], showStatusCard: false }; // This is now handled in the dedicated seller block below
            }
            // For pending/rejected sellers, show a limited view
            return { title: 'Your Dashboard', features: [], showStatusCard: true };
          case 'ADMIN':
              return { title: '', features: [], showStatusCard: false }; // Handled by dedicated admin block
          case 'CUSTOMER':
          default:
              return { title: 'Your Dashboard', features: CustomerFeatures, showStatusCard: true };
      }
  }

  const { title, features, showStatusCard } = renderContent();
  
  if (user?.role === 'ADMIN') {
      const { orders } = useOrder();
      const { users } = useUserManagement();
      const { applications } = useStore();

      const {
        totalRevenue,
        totalOrders,
        totalUsers,
        pendingApprovals,
        salesLast7Days,
        recentActivity,
      } = useMemo(() => {
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);
        const usersCount = users.filter(u => u.role !== 'ADMIN').length;
        const approvals = applications.filter(app => app.status === 'PENDING').length;

        const salesData = Array(7).fill(0).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            const daySales = orders
                .filter(o => o.date.startsWith(dateString))
                .reduce((sum, order) => sum + order.total, 0);
            return { name: d.toLocaleDateString('en-US', { weekday: 'short' }), value: daySales };
        }).reverse();

        // FIX: Add `as const` to help TypeScript infer discriminated unions for type narrowing.
        const orderActivities = orders.slice(0, 5).map(o => ({ type: 'ORDER' as const, data: o, date: new Date(o.date) }));
        const userActivities = users.filter(u => u.role !== 'ADMIN').slice(0, 5).map(u => ({ type: 'USER' as const, data: u, date: new Date() })); // Mock date for users
        const storeActivities = applications.slice(0, 5).map(s => ({ type: 'STORE' as const, data: s, date: new Date(s.submittedAt) }));
        
        const activity = [...orderActivities, ...userActivities, ...storeActivities]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5);

        return {
            totalRevenue: revenue,
            totalOrders: orders.length,
            totalUsers: usersCount,
            pendingApprovals: approvals,
            salesLast7Days: salesData,
            recentActivity: activity
        };
      }, [orders, users, applications]);


      return (
          <div className="space-y-8">
              <div>
                  <h1 className="text-3xl font-bold text-gray-800">Admin Command Center</h1>
                  <p className="text-gray-500 mt-1">Platform overview and real-time analytics.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard title="Total Revenue" value={`฿${totalRevenue.toLocaleString()}`} icon={<DollarSignIcon className="h-5 w-5 text-gray-400" />} />
                  <StatCard title="Total Orders" value={totalOrders.toLocaleString()} icon={<ShoppingBagIcon className="h-5 w-5 text-gray-400" />} />
                  <StatCard title="Total Users" value={totalUsers.toLocaleString()} icon={<UserPlusIcon className="h-5 w-5 text-gray-400" />} />
                  <StatCard title="Pending Approvals" value={pendingApprovals.toLocaleString()} icon={<UserCheckIcon className="h-5 w-5 text-gray-400" />} />
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Sales Last 7 Days</h2>
                    <Card>
                        <CardContent className="p-4">
                            <SimpleBarChart data={salesLast7Days} />
                        </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            {recentActivity.map((act, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        {act.type === 'ORDER' && <ClipboardListIcon className="h-5 w-5 text-gray-500"/>}
                                        {act.type === 'USER' && <UserPlusIcon className="h-5 w-5 text-gray-500"/>}
                                        {act.type === 'STORE' && <StoreIcon className="h-5 w-5 text-gray-500"/>}
                                    </div>
                                    <div className="text-sm">
                                        {act.type === 'ORDER' && <p>New order <span className="font-semibold">{act.data.id}</span> for ฿{act.data.total.toLocaleString()}</p>}
                                        {act.type === 'USER' && <p>New user <span className="font-semibold">{act.data.email}</span> registered.</p>}
                                        {act.type === 'STORE' && <p>Store <span className="font-semibold">{act.data.storeName}</span> submitted an application.</p>}
                                        <p className="text-xs text-gray-400">{act.date.toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                  </div>
              </div>
          </div>
      );
  }
  
  if (user?.role === 'SELLER' && user.sellerStatus === 'APPROVED') {
        const { getOrdersByStoreId } = useOrder();
        const sellerOrders = getOrdersByStoreId(user.storeId || '');
        
        const { totalRevenue, totalOrders } = useMemo(() => {
            const revenue = sellerOrders.reduce((sum, order) => {
                const orderTotalForStore = order.items.reduce((itemSum, item) => itemSum + (item.product.price * item.quantity), 0);
                return sum + orderTotalForStore;
            }, 0);
            return { totalRevenue: revenue, totalOrders: sellerOrders.length };
        }, [sellerOrders]);

        return (
             <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's a summary of your store's performance.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <StatCard title="Total Revenue" value={`฿${totalRevenue.toLocaleString()}`} icon={<DollarSignIcon className="h-5 w-5 text-gray-400" />} />
                    <StatCard title="Total Orders" value={totalOrders.toLocaleString()} icon={<ShoppingBagIcon className="h-5 w-5 text-gray-400" />} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
                   <Card>
                       <CardContent className="p-0">
                           <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Order ID</th>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Items</th>
                                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {sellerOrders.slice(0, 5).map(order => (
                                        <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                            <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{order.items.length}</td>
                                            <td className="px-6 py-4 text-right">฿{order.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                {sellerOrders.length === 0 && <p className="text-center p-8 text-gray-500">You have no orders yet.</p>}
                           </div>
                       </CardContent>
                   </Card>
                </div>
            </div>
        );
  }

  // Fallback for Customers and Pending/Rejected Sellers
  return (
    <div className="w-full max-w-2xl animate-fade-in mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center space-y-2">
            <Logo className="h-12 w-12 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500 text-sm text-center">จัดการเส้นทางสุขภาพและธุรกิจของคุณได้ที่นี่ ({user?.role})</p>
          </div>
        </CardHeader>
        <CardContent className="text-center px-4 sm:px-6">
          {showStatusCard && <SellerStatusCard />}

          {features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                {features.map((feature) => (
                <div 
                    key={feature.title} 
                    className={`p-4 border rounded-lg transition-colors ${feature.path !== '#' ? 'hover:bg-emerald-50/50 cursor-pointer' : 'opacity-50'}`}
                    onClick={() => feature.path !== '#' && navigate(feature.path)}
                    aria-disabled={feature.path === '#'}
                >
                    <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.subtitle}</p>
                </div>
                ))}
            </div>
          )}
          
          <Button onClick={handleLogout} className="w-full sm:w-auto" variant="outline">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;