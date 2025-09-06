
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import * as api from '../services/api';
import { Product, ProductInput } from '../types';

interface ProductContextType {
  products: Product[];
  addProduct: (productData: ProductInput) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: number) => void;
  getProductsByStoreId: (storeId: string) => Product[];
  getProductById: (productId: number) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const addProduct = useCallback((productData: ProductInput) => {
    api.addProduct(productData).then(newProduct => {
        setProducts(prev => [...prev, newProduct]);
        api.logEvent({
            level: 'INFO',
            source: 'Product',
            message: `Product '${productData.name}' created for store ${productData.storeId}.`
        });
    });
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    // For local state update, we'd call api.updateProduct and then...
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
     api.logEvent({
        level: 'INFO',
        source: 'Product',
        message: `Product '${updatedProduct.name}' (ID: ${updatedProduct.id}) updated.`
    });
  }, []);

  const deleteProduct = useCallback((productId: number) => {
    // For local state update, we'd call api.deleteProduct and then...
    let productName = '';
    const productToDelete = products.find(p => p.id === productId);
    if (productToDelete) productName = productToDelete.name;
    
    setProducts(prev => prev.filter(p => p.id !== productId));
    api.logEvent({
        level: 'WARN',
        source: 'Product',
        message: `Product '${productName}' (ID: ${productId}) deleted.`
    });
  }, [products]);

  const getProductsByStoreId = useCallback((storeId: string) => {
    return products.filter(p => p.storeId === storeId);
  }, [products]);
  
  const getProductById = useCallback((productId: number) => {
    return products.find(p => p.id === productId);
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductsByStoreId, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};