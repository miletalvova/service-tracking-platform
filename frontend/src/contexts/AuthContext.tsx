import { createContext, useState } from 'react';

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
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    function login(token: string, user: User, role: string) {
        setToken(token);
        setRole(role);
        setUser(user);
        localStorage.setItem('token', token);
    }

    function logout() {
        setToken(null);
        setRole(null);
        setUser(null);
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider 
        value={{ token, role, user, login, logout, isAuthenticated: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
}