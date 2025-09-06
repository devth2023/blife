
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useProduct } from '../contexts/ProductContext';
import { useRouter } from '../contexts/RouterContext';
import { Product } from '../types';
import ProductForm from '../components/ProductForm';
import { TrashIcon } from '../components/icons/TrashIcon';

const SellerProducts: React.FC = () => {
    const { user } = useAuth();
    const { getProductsByStoreId, deleteProduct } = useProduct();
    const { navigate } = useRouter();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);

    // This component should only be accessible to approved sellers
    if (user?.role !== 'SELLER' || user?.sellerStatus !== 'APPROVED' || !user.storeId) {
        return <div className="text-center p-8">You do not have permission to view this page.</div>;
    }

    const sellerProducts = getProductsByStoreId(user.storeId);

    const handleAddNew = () => {
        setProductToEdit(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setProductToEdit(product);
        setIsFormOpen(true);
    };
    
    const handleDelete = (productId: number) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(productId);
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-6">
                &larr; Back to Dashboard
            </Button>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Your Products</h1>
                        <p className="text-gray-500 text-sm">Manage your store's inventory here.</p>
                    </div>
                    <Button onClick={handleAddNew}>Add New Product</Button>
                </CardHeader>
                <CardContent>
                    {sellerProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Product Name</th>
                                        <th scope="col" className="px-6 py-3">Price</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellerProducts.map(product => (
                                        <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4">฿{product.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>Edit</Button>
                                                <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">You haven't added any products yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <ProductForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                productToEdit={productToEdit}
                storeId={user.storeId}
            />
        </div>
    );
};

export default SellerProducts;