import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CustomerDashboard from '../pages/CustomerDashboard';
import StaffDashboard from '../pages/StaffDashboard';
import TechnicianDashboard from '../pages/TechnicianDashboard';
import RoleRoute from './RoleRoute';
import RegisterPage from '../pages/RegisterPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/customer" element={<RoleRoute allowedRoles={["Customer"]}><CustomerDashboard /></RoleRoute>} />
            <Route path="/staff" element={<RoleRoute allowedRoles={["Staff"]}><StaffDashboard /></RoleRoute>} />
            <Route path="/technician" element={<RoleRoute allowedRoles={["Technician"]}><TechnicianDashboard /></RoleRoute>} />
        </Routes>
    )
}
