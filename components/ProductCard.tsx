
import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';


interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing when the button is clicked
    addToCart(product);
  };
  
  return (
    <div onClick={onClick} className="cursor-pointer">
      <Card className="overflow-hidden group transition-shadow hover:shadow-xl w-full h-full flex flex-col">
        <div className="overflow-hidden">
          <img 
            src={`${product.imageUrl}&w=400&h=400&fit=crop`} 
            alt={product.name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" 
          />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-gray-800 truncate" title={product.name}>{product.name}</h3>
          <p className="text-sm text-gray-500">{product.name_th}</p>
          <div className="flex-grow"></div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-xl font-semibold text-emerald-600">฿{product.price.toLocaleString()}</p>
            <Button variant="outline" onClick={handleButtonClick}>Add to Cart</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;