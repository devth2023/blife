

import React from 'react';
import { useRouter } from '../../contexts/RouterContext';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../icons/Logo';
import { HomeIcon } from '../icons/HomeIcon';
import { UserCheckIcon } from '../icons/UserCheckIcon';
import { PackageIcon } from '../icons/PackageIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { FileTextIcon } from '../icons/FileTextIcon';
import { LogOutIcon } from '../icons/LogOutIcon';
import { PercentIcon } from '../icons/PercentIcon';
import { PlugIcon } from '../icons/PlugIcon';

const NavLink: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode; active?: boolean }> = ({ href, icon, children, active }) => {
    const { navigate } = useRouter();
    const activeClasses = 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300';
    const inactiveClasses = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700';
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

const AdminSidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const { path, navigate } = useRouter();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700">
            <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
                <Logo className="h-8 w-8 text-emerald-600" />
                <span className="ml-2 font-bold text-xl text-gray-800 dark:text-white">Blife Healthy</span>
            </div>
            <div className="flex items-center p-4 border-b dark:border-gray-700">
                <img className="h-10 w-10 rounded-full object-cover" src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`} alt="Admin avatar" />
                <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">Administrator</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink href="/dashboard" icon={<HomeIcon className="h-5 w-5" />} active={path === '/dashboard'}>Dashboard</NavLink>
                <NavLink href="/admin/management" icon={<UserCheckIcon className="h-5 w-5" />} active={path === '/admin/management'}>Store Management</NavLink>
                <NavLink href="/admin/commissions" icon={<PercentIcon className="h-5 w-5" />} active={path === '/admin/commissions'}>Commissions</NavLink>
                <NavLink href="/products" icon={<PackageIcon className="h-5 w-5" />} active={path.startsWith('/products')}>Products</NavLink>
                <NavLink href="/admin/integrations" icon={<PlugIcon className="h-5 w-5" />} active={path === '/admin/integrations'}>Integrations</NavLink>
                <NavLink href="/admin/settings" icon={<SettingsIcon className="h-5 w-5" />} active={path === '/admin/settings'}>Site Settings</NavLink>
                <NavLink href="/admin/logs" icon={<FileTextIcon className="h-5 w-5" />} active={path === '/admin/logs'}>System Logs</NavLink>
            </nav>
            <div className="p-4 border-t dark:border-gray-700">
                 <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <LogOutIcon className="h-5 w-5" />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;