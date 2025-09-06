import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from '../contexts/RouterContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { CreditCardIcon } from '../components/icons/CreditCardIcon';

const Checkout: React.FC = () => {
    const { cartItems, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const { createOrder } = useOrder();
    const { navigate } = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            // Should not happen if this is a protected route, but good practice
            alert("You must be logged in to place an order.");
            return;
        }
        // In a real app, this would process payment BEFORE saving the order
        console.log('Placing order with items:', cartItems);
        createOrder(cartItems, user.id);
        clearCart();
        navigate('/order-confirmation');
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center animate-fade-in max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h1>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500 mb-4">You need to add items to your cart before you can check out.</p>
                        <Button onClick={() => navigate('/products')}>
                            Continue Shopping
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
             <Button variant="outline" onClick={() => navigate('/products')} className="mb-6">
                &larr; Back to Products
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Shipping & Payment Form */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Shipping & Payment Details</h2>
                    </CardHeader>
                    <CardContent>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            {/* Shipping section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Shipping Address</h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</label>
                                        <Input id="fullname" type="text" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                                        <Input id="address" type="text" placeholder="123 Healthy St." required />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
                                            <Input id="city" type="text" placeholder="Bangkok" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="postal-code" className="text-sm font-medium text-gray-700">Postal Code</label>
                                            <Input id="postal-code" type="text" placeholder="10110" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <hr />

                            {/* Payment section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Information</h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label htmlFor="cardholder-name" className="text-sm font-medium text-gray-700">Cardholder Name</label>
                                        <Input id="cardholder-name" type="text" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="card-number" className="text-sm font-medium text-gray-700">Card Number</label>
                                        <div className="relative">
                                            <Input id="card-number" type="text" placeholder="•••• •••• •••• 1234" required className="pl-10" />
                                            <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label htmlFor="expiry-date" className="text-sm font-medium text-gray-700">Expiry Date</label>
                                            <Input id="expiry-date" type="text" placeholder="MM / YY" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="cvc" className="text-sm font-medium text-gray-700">CVC</label>
                                            <Input id="cvc" type="text" placeholder="123" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <div className="row-start-1 lg:row-start-auto">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Order Summary</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center space-x-2">
                                            <img src={`${item.product.imageUrl}&w=64&h=64&fit=crop`} alt={item.product.name} className="w-10 h-10 rounded-md object-cover" />
                                            <div>
                                                <p className="font-medium text-gray-800">{item.product.name}</p>
                                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">฿{(item.product.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>฿{subtotal.toLocaleString()}</span>
                            </div>
                            <Button type="submit" form="checkout-form" className="w-full mt-6">
                                Place Order
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Checkout;