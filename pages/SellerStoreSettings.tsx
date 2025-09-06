
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useRouter } from '../contexts/RouterContext';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';

const SellerStoreSettings: React.FC = () => {
    const { navigate } = useRouter();
    const { user } = useAuth();
    const { getStoreByUserId, updateStoreCustomization } = useStore();

    const [bannerUrl, setBannerUrl] = useState('');
    const [profileUrl, setProfileUrl] = useState('');
    const [themeColor, setThemeColor] = useState('#10B981');
    const [isSaved, setIsSaved] = useState(false);

    const store = user ? getStoreByUserId(user.id) : undefined;

    useEffect(() => {
        if (store) {
            setBannerUrl(store.bannerImageUrl || '');
            setProfileUrl(store.profileImageUrl || '');
            setThemeColor(store.themeColor || '#10B981');
        }
    }, [store]);

    if (!user || user.role !== 'SELLER' || user.sellerStatus !== 'APPROVED' || !store) {
         return <div className="text-center p-8">You do not have permission to view this page.</div>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateStoreCustomization(store.storeId, {
            bannerImageUrl: bannerUrl,
            profileImageUrl: profileUrl,
            themeColor: themeColor
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Store Customization</h1>
                    <p className="text-gray-500">Customize the look and feel of your public store page.</p>
                </div>
                 <Button variant="outline" onClick={() => navigate(`/store/${store.storeId}`)}>
                    View My Store
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Brand Settings</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label htmlFor="bannerUrl" className="text-sm font-medium text-gray-700">Banner Image URL</label>
                            <Input 
                                id="bannerUrl"
                                value={bannerUrl}
                                onChange={(e) => setBannerUrl(e.target.value)}
                                placeholder="https://images.unsplash.com/..."
                            />
                            <p className="text-xs text-gray-500">Recommended size: 1200x400 pixels.</p>
                        </div>
                         <div className="space-y-1">
                            <label htmlFor="profileUrl" className="text-sm font-medium text-gray-700">Profile / Logo Image URL</label>
                            <Input 
                                id="profileUrl"
                                value={profileUrl}
                                onChange={(e) => setProfileUrl(e.target.value)}
                                placeholder="https://api.dicebear.com/..."
                            />
                            <p className="text-xs text-gray-500">Recommended size: 200x200 pixels.</p>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="themeColor" className="text-sm font-medium text-gray-700">Theme Color</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="color"
                                    id="themeColor"
                                    value={themeColor}
                                    onChange={(e) => setThemeColor(e.target.value)}
                                    className="p-1 h-10 w-14 block bg-white border border-gray-300 rounded-md cursor-pointer"
                                />
                                <Input
                                    value={themeColor}
                                    onChange={(e) => setThemeColor(e.target.value)}
                                    className="w-32"
                                />
                            </div>
                             <p className="text-xs text-gray-500">This color will be used for buttons and highlights on your store page.</p>
                        </div>
                         <div className="flex justify-end items-center gap-4">
                            {isSaved && <p className="text-sm text-emerald-600">Changes saved successfully!</p>}
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SellerStoreSettings;