import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    return (
        <nav>
            <Link to="/">Home</Link>

            {!isAuthenticated ? (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            ) : (
                <>
                <p>Welcome {user?.username}!</p>
                <button onClick={logout}>Logout</button>
                </>
            )}
        </nav>
    );
}