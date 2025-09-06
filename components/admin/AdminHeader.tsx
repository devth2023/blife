
import React from 'react';
import { Button } from '../ui/Button';
import { useRouter } from '../../contexts/RouterContext';
import { useAuth } from '../../contexts/AuthContext';
import { MenuIcon } from '../icons/MenuIcon';
import { BellIcon } from '../icons/BellIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

const AdminHeader: React.FC = () => {
    const { navigate } = useRouter();
    const { user } = useAuth();
    
    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
            <div className="flex items-center">
                <button className="text-gray-500 focus:outline-none lg:hidden">
                    <MenuIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                    View Website
                </Button>
                <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
                    <BellIcon className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <img className="h-8 w-8 rounded-full object-cover" src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`} alt="Admin avatar" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user?.email}</span>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;