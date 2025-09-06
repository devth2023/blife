
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import * as api from '../services/api';
import { User, UserRole, SellerStatus } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  updateUserSellerStatus: (status: SellerStatus, storeId: string) => void;
  _updateCurrentUser: (updatedUser: User) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, role: UserRole) => {
    // In a real app, this would call an API to authenticate and get user data.
    // For this mock, we create a user object on the fly.
    let mockUser: User = {
      id: `user-${Date.now()}`,
      email: email,
      role: role,
      sellerStatus: 'NONE'
    };

    if (role === 'SELLER') {
      mockUser = { ...mockUser, sellerStatus: 'APPROVED', storeId: 'STORE-MOCK-123' };
    }
    if (role === 'ADMIN') {
        mockUser.id = 'ADMIN-USER-001'; // Consistent ID for admin
    }
    
    setUser(mockUser);
    api.logEvent({
        level: 'INFO',
        source: 'Auth',
        message: `User '${email}' logged in as ${role}.`
    });
  };
  
  const logout = () => {
    if (user) {
         api.logEvent({ level: 'INFO', source: 'Auth', message: `User '${user.email}' logged out.` });
    }
    setUser(null);
  }

  const updateUserSellerStatus = useCallback((status: SellerStatus, storeId: string) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, sellerStatus: status, storeId };
      // Also update this in our "database" via the API service
      api.updateUser(currentUser.id, { sellerStatus: status, storeId });
      return updatedUser;
    });
  }, []);

  const _updateCurrentUser = useCallback((updatedUser: User) => {
      setUser(currentUser => {
          if (currentUser && currentUser.id === updatedUser.id) {
              return updatedUser;
          }
          return currentUser;
      })
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserSellerStatus, _updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};