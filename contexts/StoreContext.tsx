
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import * as api from '../services/api';
import { StoreApplication, StoreStatus } from '../types';

interface StoreContextType {
  applications: StoreApplication[];
  createStoreApplication: (userId: string, storeName: string, storeDescription: string) => Promise<StoreApplication>;
  getStoreByUserId: (userId: string) => StoreApplication | undefined;
  getStoreById: (storeId: string) => StoreApplication | undefined;
  updateApplicationStatus: (storeId: string, status: StoreStatus) => void;
  updateStoreCustomization: (storeId: string, updates: Pick<StoreApplication, 'bannerImageUrl' | 'profileImageUrl' | 'themeColor'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);


export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<StoreApplication[]>([]);

  useEffect(() => {
    api.getStoreApplications().then(setApplications);
  }, []);

  const createStoreApplication = useCallback(async (userId: string, storeName: string, storeDescription: string): Promise<StoreApplication> => {
    const newApplication = await api.createStoreApplication(userId, storeName, storeDescription);
    setApplications(prev => [...prev.filter(app => app.userId !== userId), newApplication]);
    return newApplication;
  }, []);
  
  const getStoreByUserId = useCallback((userId: string) => {
    return applications.find(app => app.userId === userId);
  }, [applications]);

  const getStoreById = useCallback((storeId: string) => {
      return applications.find(app => app.storeId === storeId);
  }, [applications]);

  const updateApplicationStatus = useCallback((storeId: string, status: StoreStatus) => {
    api.updateStoreApplicationStatus(storeId, status).then(updatedStore => {
        setApplications(prev => prev.map(app => app.storeId === storeId ? updatedStore : app));
        api.logEvent({
            level: 'INFO',
            source: 'Store',
            message: `Store '${updatedStore.storeName}' (${storeId}) status updated to ${status}.`
        });
    });
  }, []);

  const updateStoreCustomization = useCallback((storeId: string, updates: Pick<StoreApplication, 'bannerImageUrl' | 'profileImageUrl' | 'themeColor'>) => {
      api.updateStoreCustomization(storeId, updates).then(updatedStore => {
          setApplications(prev => prev.map(app => app.storeId === storeId ? updatedStore : app));
           api.logEvent({
            level: 'INFO',
            source: 'Store',
            message: `Store ID ${storeId} customization updated.`
        });
      });
  }, []);


  return (
    <StoreContext.Provider value={{ applications, createStoreApplication, getStoreByUserId, getStoreById, updateApplicationStatus, updateStoreCustomization }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};