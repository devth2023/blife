import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';

const SellerRegistration: React.FC = () => {
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const { navigate } = useRouter();
    const { user, updateUserSellerStatus } = useAuth();
    const { createStoreApplication } = useStore();

    // FIX: Made handleSubmit async to await the promise from createStoreApplication
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const newApplication = await createStoreApplication(user.id, storeName, storeDescription);
        updateUserSellerStatus('PENDING', newApplication.storeId);
        
        // Navigate back to dashboard to see the updated status
        navigate('/dashboard');
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-6">
                &larr; Back to Dashboard
            </Button>
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold text-gray-800 text-center">Become a Seller</h1>
                    <p className="text-gray-500 text-sm text-center">Start your business journey with Blife Healthy.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="store-name" className="text-sm font-medium text-gray-700">Store Name</label>
                            <Input 
                                id="store-name" 
                                type="text" 
                                placeholder="My Healthy Shop" 
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="store-description" className="text-sm font-medium text-gray-700">Store Description</label>
                            <textarea
                                id="store-description"
                                placeholder="Describe what makes your store special..."
                                value={storeDescription}
                                onChange={(e) => setStoreDescription(e.target.value)}
                                required
                                rows={4}
                                className="flex w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Submit Application
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SellerRegistration;