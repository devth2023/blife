
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { useRouter } from '../contexts/RouterContext';
import { useProduct } from '../contexts/ProductContext';
import { StatCard } from '../components/ui/StatCard';
import { DollarSignIcon } from '../components/icons/DollarSignIcon';
import { ShoppingBagIcon } from '../components/icons/ShoppingBagIcon';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';

const SellerRevenue: React.FC = () => {
    const { user } = useAuth();
    const { getOrdersByStoreId } = useOrder();
    const { products } = useProduct();
    const { navigate } = useRouter();

    if (user?.role !== 'SELLER' || user?.sellerStatus !== 'APPROVED' || !user.storeId) {
        return <div className="text-center p-8">You do not have permission to view this page.</div>;
    }

    const sellerOrders = getOrdersByStoreId(user.storeId);

    const analytics = useMemo(() => {
        const totalRevenue = sellerOrders.reduce((sum, order) => {
            const orderTotalForStore = order.items.reduce((itemSum, item) => itemSum + (item.product.price * item.quantity), 0);
            return sum + orderTotalForStore;
        }, 0);
        
        const totalOrders = sellerOrders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        const salesLast7Days = Array(7).fill(0).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            const daySales = sellerOrders
                .filter(o => o.date.startsWith(dateString))
                .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.product.price * item.quantity, 0), 0);
            return {
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                value: daySales
            };
        }).reverse();

        const productSales = new Map<number, { name: string, quantity: number, imageUrl: string }>();
        sellerOrders.forEach(order => {
            order.items.forEach(item => {
                const existing = productSales.get(item.product.id);
                productSales.set(item.product.id, {
                    name: item.product.name,
                    quantity: (existing?.quantity || 0) + item.quantity,
                    imageUrl: item.product.imageUrl
                });
            });
        });
        const topSellingProducts = [...productSales.values()].sort((a,b) => b.quantity - a.quantity).slice(0, 5);


        return { totalRevenue, totalOrders, avgOrderValue, salesLast7Days, topSellingProducts };
    }, [sellerOrders]);

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Revenue & Analytics</h1>
                    <p className="text-gray-500">Welcome to your performance dashboard.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    &larr; Back to Dashboard
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Total Revenue" value={`฿${analytics.totalRevenue.toLocaleString()}`} icon={<DollarSignIcon className="h-5 w-5 text-gray-400" />} />
                <StatCard title="Total Orders" value={analytics.totalOrders.toLocaleString()} icon={<ShoppingBagIcon className="h-5 w-5 text-gray-400" />} />
                <StatCard title="Avg. Order Value" value={`฿${analytics.avgOrderValue.toFixed(2)}`} icon={<TrendingUpIcon className="h-5 w-5 text-gray-400" />} />
            </div>
            
            {/* Charts and Top Products */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Sales (Last 7 Days)</h2>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart data={analytics.salesLast7Days} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Top Selling Products</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topSellingProducts.length > 0 ? analytics.topSellingProducts.map(p => (
                                <div key={p.name} className="flex items-center space-x-4">
                                    <img src={`${p.imageUrl}&w=64&h=64&fit=crop`} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                                    <div>
                                        <p className="font-medium text-sm text-gray-800 truncate">{p.name}</p>
                                        <p className="text-sm text-gray-500">{p.quantity} sold</p>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-gray-500 text-center py-4">No sales data yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SellerRevenue;