
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';
import { User } from '../types';

interface UserManagementContextType {
  users: User[];
  updateUser: (userId: string, updates: Partial<Pick<User, 'role' | 'sellerStatus' | 'storeId'>>) => void;
  getUserById: (userId: string) => User | undefined;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { user: loggedInUser, _updateCurrentUser } = useAuth();

  useEffect(() => {
    api.getUsers().then(setUsers);
  }, []);
  
  // This effect syncs the logged-in user's state into our list of all users,
  // which is necessary in a mock environment. A real DB wouldn't need this.
  useEffect(() => {
    if (loggedInUser) {
        const userInList = users.find(u => u.id === loggedInUser.id);
        if (!userInList) {
            setUsers(prev => [...prev, loggedInUser]);
        } else if (JSON.stringify(userInList) !== JSON.stringify(loggedInUser)) {
             setUsers(prev => prev.map(u => u.id === loggedInUser.id ? loggedInUser : u));
        }
    }
  }, [loggedInUser, users]);


  const updateUser = useCallback((userId: string, updates: Partial<Pick<User, 'role' | 'sellerStatus'| 'storeId'>>) => {
    api.updateUser(userId, updates).then(updatedUser => {
        if (updatedUser) {
            setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
            // If the updated user is the currently logged in user, update their AuthContext state
            if (loggedInUser?.id === userId) {
                _updateCurrentUser(updatedUser);
            }
        }
    });
  }, [loggedInUser, _updateCurrentUser]);

  const getUserById = useCallback((userId: string) => {
    return users.find(u => u.id === userId);
  }, [users]);
  

  return (
    <UserManagementContext.Provider value={{ users, updateUser, getUserById }}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};