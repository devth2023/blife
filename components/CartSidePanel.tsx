
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../types';
import { Button } from './ui/Button';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { useRouter } from '../contexts/RouterContext';

const CartItemCard: React.FC<{ item: CartItem }> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    return (
        <div className="flex items-start space-x-4 py-4">
            <img src={`${item.product.imageUrl}&w=128&h=128&fit=crop`} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
            <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-800">{item.product.name}</h3>
                <p className="text-sm text-gray-500">฿{item.product.price.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                    <div className="flex items-center border rounded-md">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
                    </div>
                </div>
            </div>
            <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-600 p-1">
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

const CartSidePanel: React.FC = () => {
    const { isCartOpen, closeCart, cartItems, subtotal } = useCart();
    const { navigate } = useRouter();

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };
    
    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeCart}
            ></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
                        <button onClick={closeCart} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100" aria-label="Close cart">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <p className="text-gray-500">Your cart is empty.</p>
                            <Button variant="outline" className="mt-4" onClick={closeCart}>Continue Shopping</Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto px-4 divide-y">
                                {cartItems.map(item => <CartItemCard key={item.product.id} item={item} />)}
                            </div>
                            <div className="p-4 border-t space-y-4 bg-gray-50">
                                <div className="flex justify-between font-semibold text-gray-800">
                                    <span>Subtotal</span>
                                    <span>฿{subtotal.toLocaleString()}</span>
                                </div>
                                <Button className="w-full" onClick={handleCheckout}>Proceed to Checkout</Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidePanel;