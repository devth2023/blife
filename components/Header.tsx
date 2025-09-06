
import React from 'react';
import { Logo } from './icons/Logo';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { useCart } from '../contexts/CartContext';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

const Header: React.FC = () => {
  const { itemCount, toggleCart } = useCart();
  const { navigate } = useRouter();
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate(user ? '/dashboard' : '/')}
            aria-label="Go to homepage"
          >
            <Logo className="h-8 w-8 text-emerald-600" />
            <span className="font-bold text-xl text-gray-800">Blife Healthy</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              aria-label={`Open shopping cart with ${itemCount} items`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </button>
            {!user && (
                <Button size="sm" onClick={() => navigate('/login')}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;