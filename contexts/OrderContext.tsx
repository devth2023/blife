
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import * as api from '../services/api';
import { CartItem, Order, OrderItemStatus } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], userId: string) => void;
  getOrdersByUserId: (userId: string) => Order[];
  getOrdersByStoreId: (storeId: string) => Order[];
  updateOrderItemStatus: (orderId: string, productId: number, status: OrderItemStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  const createOrder = useCallback((items: CartItem[], userId: string) => {
    api.createOrder(items, userId).then(newOrder => {
        setOrders(prevOrders => [...prevOrders, newOrder]);
        api.logEvent({
            level: 'INFO',
            source: 'Order',
            message: `New order ${newOrder.id} placed by user ${userId} for ฿${newOrder.total.toLocaleString()}.`
        });
    });
  }, []);

  const getOrdersByUserId = useCallback((userId: string) => {
    return orders.filter(order => order.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

  const getOrdersByStoreId = useCallback((storeId: string) => {
    const sellerOrders: Order[] = [];
    orders.forEach(order => {
        const sellerItems = order.items.filter(item => item.product.storeId === storeId);
        if (sellerItems.length > 0) {
            sellerOrders.push({
                ...order,
                items: sellerItems,
            });
        }
    });
    return sellerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

  const updateOrderItemStatus = useCallback((orderId: string, productId: number, status: OrderItemStatus) => {
    api.updateOrderItemStatus(orderId, productId, status).then(updatedOrder => {
        setOrders(prevOrders => prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    });
  }, []);


  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrdersByUserId, getOrdersByStoreId, updateOrderItemStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};