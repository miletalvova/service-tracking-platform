import { createContext, useState, useEffect, useCallback } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
}
interface AuthContextType {
    token: string | null;
    role: string | null;
    user: User | null;

    login: (
        token: string,
        user: User,
        role: string
    ) => void;

    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        window.location.href = "/login";
    }, []);

    function login(token: string, user: User, role: string) {
        setToken(token);
        setRole(role);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(user));
    }

    /* function logout() {
        setToken(null);
        setRole(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
    } */

    useEffect(() => {
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const now = Date.now();
        const timeUntilExpiration = expirationTime - now;

        if (timeUntilExpiration <= 0) {
            logout();
            return;
        }

        const timer = setTimeout(() => {
            logout();
        }, timeUntilExpiration);

        return () => clearTimeout(timer);
    }, [token, logout]);

    return (
        <AuthContext.Provider
            value={{ token, role, user, login, logout, isAuthenticated: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
}