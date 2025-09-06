
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { StatCard } from '../components/ui/StatCard';
import { DollarSignIcon } from '../components/icons/DollarSignIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { Button } from '../components/ui/Button';

type CommissionStatus = 'Paid' | 'Pending' | 'Cancelled';

interface Commission {
    id: string;
    orderId: string;
    sellerId: string;
    sellerEmail: string;
    commissionAmount: number;
    orderTotal: number;
    tier: number;
    date: string;
    status: CommissionStatus;
}

const mockCommissionsData: Commission[] = [
    { id: 'COM-001', orderId: 'BLIFE-1678886400001', sellerId: 'user-1678886400001', sellerEmail: 'seller.approved@example.com', commissionAmount: 189, orderTotal: 1890, tier: 1, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Paid' },
    { id: 'COM-002', orderId: 'BLIFE-1678886400002', sellerId: 'user-1678886400001', sellerEmail: 'seller.approved@example.com', commissionAmount: 85, orderTotal: 850, tier: 1, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Paid' },
    { id: 'COM-003', orderId: 'BLIFE-1678886400003', sellerId: 'user-1678886400001', sellerEmail: 'seller.approved@example.com', commissionAmount: 45, orderTotal: 450, tier: 1, date: new Date().toISOString(), status: 'Pending' },
    { id: 'COM-004', orderId: 'BLIFE-1678886400004', sellerId: 'user-1678886400001', sellerEmail: 'seller.approved@example.com', commissionAmount: 12, orderTotal: 120, tier: 1, date: new Date().toISOString(), status: 'Pending' },
];


const AdminCommissions: React.FC = () => {
    const { user } = useAuth();
    const [commissions, setCommissions] = useState<Commission[]>(mockCommissionsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
    
    if (user?.role !== 'ADMIN') {
        return <div className="text-center p-8">You do not have permission to view this page.</div>;
    }

    const filteredCommissions = useMemo(() => {
        return commissions.filter(c => 
            c.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.sellerEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, commissions]);

    const handleSelectCommission = (commissionId: string) => {
        setSelectedCommissions(prev => 
            prev.includes(commissionId)
                ? prev.filter(id => id !== commissionId)
                : [...prev, commissionId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allPendingIds = filteredCommissions
                .filter(c => c.status === 'Pending')
                .map(c => c.id);
            setSelectedCommissions(allPendingIds);
        } else {
            setSelectedCommissions([]);
        }
    };

    const handlePayout = () => {
        if (selectedCommissions.length === 0) return;
        setCommissions(prev => 
            prev.map(c => 
                selectedCommissions.includes(c.id) ? { ...c, status: 'Paid' } : c
            )
        );
        setSelectedCommissions([]);
    };

    const getStatusVariant = (status: CommissionStatus) => {
        switch (status) {
            case 'Paid': return 'success';
            case 'Pending': return 'warning';
            case 'Cancelled': return 'danger';
        }
    };

    const totalCommissionPaid = commissions.reduce((sum, c) => c.status === 'Paid' ? sum + c.commissionAmount : sum, 0);
    const totalCommissionPending = commissions.reduce((sum, c) => c.status === 'Pending' ? sum + c.commissionAmount : sum, 0);
    const pendingCommissionCount = filteredCommissions.filter(c => c.status === 'Pending').length;

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Commission Tracking</h1>
                <p className="text-gray-500 mt-1">Monitor and manage seller commissions.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <StatCard 
                    title="Total Commission Paid" 
                    value={`฿${totalCommissionPaid.toLocaleString()}`} 
                    icon={<DollarSignIcon className="h-5 w-5 text-gray-400" />} 
                />
                <StatCard 
                    title="Pending Payout" 
                    value={`฿${totalCommissionPending.toLocaleString()}`} 
                    icon={<ClockIcon className="h-5 w-5 text-gray-400" />} 
                />
            </div>

            <Card>
                <CardHeader>
                    <h2 className="font-semibold text-lg">Current Commission Rates</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                            <p className="font-medium text-gray-800">Tier 1 (Direct Sales)</p>
                            <p className="text-xs text-gray-500">Commission earned from products you sell directly.</p>
                        </div>
                        <span className="font-bold text-xl text-emerald-600">10%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                            <p className="font-medium text-gray-800">Tier 2 (Referrals)</p>
                            <p className="text-xs text-gray-500">Commission earned from sales made by sellers you refer.</p>
                        </div>
                        <span className="font-bold text-xl text-emerald-600">5%</span>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-semibold">Commission History</h2>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Input 
                                placeholder="Search by Order ID or Seller..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-grow"
                            />
                            <Button onClick={handlePayout} disabled={selectedCommissions.length === 0}>
                                Payout ({selectedCommissions.length}) Selected
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 w-12">
                                        <input 
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                            onChange={handleSelectAll}
                                            checked={pendingCommissionCount > 0 && selectedCommissions.length === pendingCommissionCount}
                                            disabled={pendingCommissionCount === 0}
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3">Order ID</th>
                                    <th scope="col" className="px-6 py-3">Seller</th>
                                    <th scope="col" className="px-6 py-3">Commission</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCommissions.map(c => (
                                    <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            {c.status === 'Pending' && (
                                                <input 
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={selectedCommissions.includes(c.id)}
                                                    onChange={() => handleSelectCommission(c.id)}
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{c.orderId}</td>
                                        <td className="px-6 py-4">{c.sellerEmail}</td>
                                        <td className="px-6 py-4 font-semibold text-emerald-700">฿{c.commissionAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">{new Date(c.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusVariant(c.status)}>{c.status}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCommissions.length === 0 && <p className="text-center text-gray-500 py-8">No commissions match your search.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminCommissions;