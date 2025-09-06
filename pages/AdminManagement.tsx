
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { useUserManagement } from '../contexts/UserManagementContext';
import { User, UserRole, SellerStatus, StoreApplication, StoreStatus } from '../types';

const StoreManagementTab: React.FC = () => {
    const { applications, updateApplicationStatus } = useStore();
    const { getUserById, updateUser } = useUserManagement();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StoreStatus | 'ALL'>('ALL');

    const handleUpdateStatus = (app: StoreApplication, newStatus: StoreStatus) => {
        updateApplicationStatus(app.storeId, newStatus);
        const newSellerStatus = newStatus === 'APPROVED' ? 'APPROVED' : newStatus === 'REJECTED' ? 'REJECTED' : 'PENDING';
        updateUser(app.userId, { sellerStatus: newSellerStatus, role: newStatus === 'APPROVED' ? 'SELLER' : 'CUSTOMER' });
    }

    const filteredApplications = useMemo(() => {
        return applications
            .filter(app => statusFilter === 'ALL' || app.status === statusFilter)
            .filter(app => app.storeName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [applications, statusFilter, searchTerm]);

    const getStatusVariant = (status: StoreStatus) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'danger';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                    placeholder="Search store name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="flex h-10 w-full sm:w-auto rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Store Name</th>
                            <th scope="col" className="px-6 py-3">Owner Email</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.map(app => (
                            <tr key={app.storeId} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{app.storeName}</td>
                                <td className="px-6 py-4">{getUserById(app.userId)?.email || 'N/A'}</td>
                                <td className="px-6 py-4"><Badge variant={getStatusVariant(app.status)}>{app.status}</Badge></td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {app.status === 'PENDING' && (
                                        <>
                                            <Button size="sm" onClick={() => handleUpdateStatus(app, 'APPROVED')}>Approve</Button>
                                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(app, 'REJECTED')}>Reject</Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UserManagementTab: React.FC = () => {
    const { users, updateUser } = useUserManagement();
    const [searchTerm, setSearchTerm] = useState('');

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        updateUser(userId, { role: newRole });
    };

    const handleSellerStatusChange = (userId: string, newStatus: SellerStatus) => {
        // This is a simplified update. A real app might need more logic
        // e.g., if you change a seller to 'NONE', what happens to their store?
        updateUser(userId, { sellerStatus: newStatus });
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [users, searchTerm]);
    
    const getSellerStatusVariant = (status: SellerStatus) => {
        switch(status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'danger';
            default: return 'default';
        }
    }

    return (
        <div className="space-y-4">
             <Input 
                placeholder="Search user email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">User Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Seller Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 text-xs py-1"
                                        disabled={user.role === 'ADMIN'}
                                    >
                                        <option value="CUSTOMER">Customer</option>
                                        <option value="SELLER">Seller</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                     <Badge variant={getSellerStatusVariant(user.sellerStatus)}>{user.sellerStatus}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminManagement: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('stores');

    if (user?.role !== 'ADMIN') {
        return <div className="text-center p-8">You do not have permission to view this page.</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Command Center</h1>
            <p className="text-gray-500 mb-6">Manage stores and users across the platform.</p>
            <Card>
                <CardHeader>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="stores">Store Management</TabsTrigger>
                            <TabsTrigger value="users">User Management</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    {activeTab === 'stores' && <StoreManagementTab />}
                    {activeTab === 'users' && <UserManagementTab />}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminManagement;