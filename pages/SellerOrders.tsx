
import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { useRouter } from '../contexts/RouterContext';
import { OrderItemStatus } from '../types';

const SellerOrders: React.FC = () => {
    const { user } = useAuth();
    const { getOrdersByStoreId, updateOrderItemStatus } = useOrder();
    const { navigate } = useRouter();

    if (user?.role !== 'SELLER' || user?.sellerStatus !== 'APPROVED' || !user.storeId) {
        return <div className="text-center p-8">You do not have permission to view this page.</div>;
    }

    const sellerOrders = getOrdersByStoreId(user.storeId);

    const handleStatusChange = (orderId: string, productId: number, status: OrderItemStatus) => {
        updateOrderItemStatus(orderId, productId, status);
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-6">
                &larr; Back to Dashboard
            </Button>
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
                    <p className="text-gray-500 text-sm">Manage incoming orders for your products.</p>
                </CardHeader>
                <CardContent>
                    {sellerOrders.length > 0 ? (
                        <div className="space-y-4">
                            {sellerOrders.map(order => (
                                <div key={order.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">Order ID: {order.id}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600">Customer: {order.userId}</p>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="space-y-3">
                                        {order.items.map(item => (
                                            <div key={item.product.id} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-2 flex-1">
                                                     <img src={`${item.product.imageUrl}&w=64&h=64&fit=crop`} alt={item.product.name} className="w-10 h-10 rounded-md object-cover" />
                                                    <div>
                                                        <p className="font-medium text-gray-700">{item.product.name}</p>
                                                        <p className="text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <select 
                                                        value={item.status} 
                                                        onChange={(e) => handleStatusChange(order.id, item.product.id, e.target.value as OrderItemStatus)}
                                                        className="rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 text-xs py-1"
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">You have no orders for your products yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SellerOrders;