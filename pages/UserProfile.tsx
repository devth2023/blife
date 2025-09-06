
import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { Order, OrderItem } from '../types';

const OrderHistoryCard: React.FC<{ order: Order }> = ({ order }) => {
    const getItemStatusBadge = (status: OrderItem['status']) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800';
            case 'Processing':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };
    
    return (
        <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-semibold text-gray-800">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
            <hr className="my-2" />
            <div className="space-y-3">
                {order.items.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 flex-1">
                            <img src={`${item.product.imageUrl}&w=64&h=64&fit=crop`} alt={item.product.name} className="w-10 h-10 rounded-md object-cover" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-700">{item.product.name}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-500">Qty: {item.quantity}</p>
                                     <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getItemStatusBadge(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="font-medium w-20 text-right">฿{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                ))}
            </div>
             <div className="text-right mt-2 pt-2 border-t">
                <p className="font-bold text-gray-800">Total: ฿{order.total.toLocaleString()}</p>
            </div>
        </div>
    );
};


const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const { getOrdersByUserId } = useOrder();
    
    // This should not happen on a protected route, but for type safety
    if (!user) return null; 

    const userOrders = getOrdersByUserId(user.id);

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center">Your Profile</h1>
            
            {/* Profile Information */}
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</label>
                                <Input id="fullname" type="text" placeholder="John Doe" />
                            </div>
                             <div className="space-y-1">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                                <Input id="email" type="email" value={user.email} disabled />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Update Profile</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Order History */}
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Order History</h2>
                </CardHeader>
                <CardContent>
                    {userOrders.length > 0 ? (
                        <div className="space-y-4">
                           {userOrders.map(order => <OrderHistoryCard key={order.id} order={order} />)}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfile;