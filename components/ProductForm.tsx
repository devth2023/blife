
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useProduct } from '../contexts/ProductContext';
import { Product, ProductInput } from '../types';
import { XIcon } from './icons/XIcon';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: Product;
    storeId: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, productToEdit, storeId }) => {
    const { addProduct, updateProduct } = useProduct();
    const [formData, setFormData] = useState<ProductInput>({
        storeId,
        name: '',
        name_th: '',
        price: 0,
        imageUrl: '',
        description: '',
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                storeId: productToEdit.storeId,
                name: productToEdit.name,
                name_th: productToEdit.name_th,
                price: productToEdit.price,
                imageUrl: productToEdit.imageUrl,
                description: productToEdit.description,
            });
        } else {
            setFormData({
                storeId,
                name: '',
                name_th: '',
                price: 0,
                imageUrl: '',
                description: '',
            });
        }
    }, [productToEdit, storeId, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (productToEdit) {
            updateProduct({ ...formData, id: productToEdit.id });
        } else {
            addProduct(formData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <h2 className="text-xl font-semibold">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-sm font-medium">Product Name (EN)</label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="name_th" className="text-sm font-medium">Product Name (TH)</label>
                                <Input id="name_th" name="name_th" value={formData.name_th} onChange={handleChange} required />
                            </div>
                             <div className="space-y-1">
                                <label htmlFor="price" className="text-sm font-medium">Price (฿)</label>
                                <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
                                <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="description" className="text-sm font-medium">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="flex w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit">{productToEdit ? 'Save Changes' : 'Add Product'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductForm;