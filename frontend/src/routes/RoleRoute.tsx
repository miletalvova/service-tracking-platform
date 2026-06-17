import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleRoute({ children, allowedRoles }: Props) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if(!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
    return children;
}