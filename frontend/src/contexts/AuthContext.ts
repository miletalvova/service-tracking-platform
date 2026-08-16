import { createContext } from 'react';

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