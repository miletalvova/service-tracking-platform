import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
    const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem("user") || "null"));


    const logout = useCallback(() => {
        setToken(null);
        setRole(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
    }, []);

    function login(token: string, user: User, role: string) {
        setToken(token);
        setRole(role);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(user));
    }

    useEffect(() => {
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000;
            const now = Date.now();
            const timeUntilExpiration = expirationTime - now;

            const timer = setTimeout(
                logout,
                Math.max(timeUntilExpiration, 0)
            );
            return () => clearTimeout(timer);
        } catch {
            const timer = setTimeout(logout, 0);
            return () => clearTimeout(timer);
        }
    }, [token, logout]);

    return (
        <AuthContext.Provider
            value={{ token, role, user, login, logout, isAuthenticated: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
}