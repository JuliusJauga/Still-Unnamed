// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, logout } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    checkUserAuth: () => void;
    logOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

 // Check user authentication status
 export const checkUserAuth = async (setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>) => {
    const result = await checkAuth();
    setIsAuthenticated(!!result);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Log out user
    const logOut = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    // Check auth status on initial render
    useEffect(() => {
        checkUserAuth(setIsAuthenticated);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, checkUserAuth: () => checkUserAuth(setIsAuthenticated), logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
