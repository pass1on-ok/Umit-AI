import { Navigate, Outlet } from 'react-router-dom';

interface RoleGuardProps {
    allowedRoles: string[];
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
    const userRole = localStorage.getItem('userRole');

    const isAuthorized = userRole && allowedRoles.includes(userRole);

   if (!isAuthorized) {
        console.error(`Access Denied: User role "${userRole}" not in`, allowedRoles);
        

        return <Navigate to="/auth" replace />;
    }
    return <Outlet />;
};

export default RoleGuard;