
import React from 'react';
import { useRouter } from '../../contexts/RouterContext';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';
import { HomeIcon } from '../icons/HomeIcon';
import { PackageIcon } from '../icons/PackageIcon';
import { ShoppingBagIcon } from '../icons/ShoppingBagIcon';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { StoreIcon } from '../icons/StoreIcon';
import { LogOutIcon } from '../icons/LogOutIcon';

const NavLink: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode; active?: boolean }> = ({ href, icon, children, active }) => {
    const { navigate } = useRouter();
    const activeClasses = 'bg-emerald-100 text-emerald-700';
    const inactiveClasses = 'text-gray-600 hover:bg-gray-100';
    return (
        <a
            href={`#${href}`}
            onClick={(e) => { e.preventDefault(); navigate(href); }}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${active ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className="ml-3">{children}</span>
        </a>
    );
};

const SellerSidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const { path, navigate } = useRouter();
    const { getStoreByUserId } = useStore();

    const store = user ? getStoreByUserId(user.id) : undefined;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!store) return null;

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r">
            <div className="flex items-center p-4 border-b h-16">
                <img className="h-10 w-10 rounded-lg object-cover" src={store.profileImageUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${store.storeName}`} alt="Store logo" />
                <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800 truncate">{store.storeName}</p>
                    <p className="text-xs text-gray-500">Seller Dashboard</p>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink href="/dashboard" icon={<HomeIcon className="h-5 w-5" />} active={path === '/dashboard'}>Dashboard</NavLink>
                <NavLink href="/seller/products" icon={<PackageIcon className="h-5 w-5" />} active={path === '/seller/products'}>Products</NavLink>
                <NavLink href="/seller/orders" icon={<ShoppingBagIcon className="h-5 w-5" />} active={path === '/seller/orders'}>Orders</NavLink>
                <NavLink href="/seller/revenue" icon={<DollarSignIcon className="h-5 w-5" />} active={path === '/seller/revenue'}>Revenue</NavLink>
                <NavLink href="/seller/store-settings" icon={<SettingsIcon className="h-5 w-5" />} active={path === '/seller/store-settings'}>Store Settings</NavLink>
            </nav>
            <div className="p-4 border-t space-y-2">
                 <a
                    href={`#/store/${store.storeId}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/store/${store.storeId}`); }}
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100"
                >
                    <StoreIcon className="h-5 w-5" />
                    <span className="ml-3">View My Store</span>
                </a>
                 <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100"
                >
                    <LogOutIcon className="h-5 w-5" />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SellerSidebar;