
import React from 'react';
import ProductCard from '../components/ProductCard';
import { useRouter } from '../contexts/RouterContext';
import { useProduct } from '../contexts/ProductContext';

const ProductCatalog: React.FC = () => {
    const { navigate } = useRouter();
    const { products } = useProduct();

    return (
        <div className="w-full max-w-6xl animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Our Healthy Products</h1>
                <p className="text-lg text-gray-500">ผลิตภัณฑ์เพื่อสุขภาพที่คัดสรรมาเพื่อคุณ</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product}
                        onClick={() => navigate(`/products/${product.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCatalog;