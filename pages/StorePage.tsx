import React from 'react';
import { useRouter } from '../contexts/RouterContext';
import { useStore } from '../contexts/StoreContext';
import { useProduct } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/Button';

interface StorePageProps {
    storeId: string;
}

const StorePage: React.FC<StorePageProps> = ({ storeId }) => {
    const { navigate } = useRouter();
    const { getStoreById } = useStore();
    const { getProductsByStoreId } = useProduct();

    const store = getStoreById(storeId);
    const products = getProductsByStoreId(storeId);

    if (!store) {
        return (
            <div className="text-center animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-800">Store Not Found</h1>
                <p className="text-gray-500 mt-2">We couldn't find the store you're looking for.</p>
                <Button onClick={() => navigate('/products')} className="mt-4">
                    Back to All Products
                </Button>
            </div>
        );
    }

    const bannerStyle = {
        backgroundImage: `url(${store.bannerImageUrl || 'https://images.unsplash.com/photo-1516214124259-011a8a287136?q=80&w=1920'})`,
        backgroundColor: store.themeColor || '#f0fdf4', // emerald-50
    };

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
            {/* Store Banner */}
            <div 
                className="h-48 md:h-64 bg-cover bg-center rounded-lg relative"
                style={bannerStyle}
            >
                <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
            </div>
            
            {/* Store Header */}
            <div className="flex flex-col sm:flex-row items-center -mt-16 sm:-mt-12 px-4 sm:px-8 z-10 relative">
                <img 
                    src={store.profileImageUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(store.storeName)}`}
                    alt={`${store.storeName} logo`}
                    className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg"
                />
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">{store.storeName}</h1>
                    <p className="text-gray-600 mt-1">{store.storeDescription}</p>
                </div>
            </div>

            {/* Store Products */}
            <div className="mt-12">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Products from {store.storeName}</h2>
                {products.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product}
                                onClick={() => navigate(`/products/${product.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border rounded-lg bg-white">
                        <p className="text-gray-500">This store has not added any products yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default StorePage;
