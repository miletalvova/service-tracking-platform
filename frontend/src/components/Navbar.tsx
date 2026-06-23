import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    return (
        <nav className="navbar">
            <div className='navbar-links'>
            <Link to="/">Home</Link>

            {!isAuthenticated ? (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            ) : (
                <>
                <span>Welcome {user?.username}!</span>
                <button className='logout-button' onClick={logout}>Logout</button>
                </>
            )}
            </div>
        </nav>
    );
}