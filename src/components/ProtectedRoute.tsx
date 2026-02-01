import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('purefood_token');
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');

    if (!token || !isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
