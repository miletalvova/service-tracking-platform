import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import './Navbar.css';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, role, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className='navbar-logo'>
                <HomeRepairServiceIcon />
                <Link to="/">Service Tracking Platform</Link>
            </div>

            <div className='navbar-links'>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        {role === "Customer" && (
                            <>
                                <Link to="/customer">Dashboard</Link>
                                <Link to="/requests">Requests</Link>
                            </>
                        )}

                        {role === "Staff" && (
                            <>
                                <Link to="/staff">Dashboard</Link>
                                <Link to="/requests">Service Requests</Link>
                                <Link to="/technicians">Technicians</Link>
                            </>
                        )}

                        {role === "Technician" && (
                            <>
                                <Link to="/technician">Dashboard</Link>
                                <Link to="/jobs">My Jobs</Link>
                            </>
                        )}
                    </>
                )}
            </div>

            {isAuthenticated && (
                <div className='navbar-user'>
                    <span>
                        Welcome, <strong>{user?.username}</strong>
                    </span>
                    <button className='logout-button' onClick={() => {
                        logout();
                        navigate("/login")
                    }}
                    >
                        Logout</button>
                </div>
            )}
        </nav>
    );
}