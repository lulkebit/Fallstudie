import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoute = () => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div>Lädt...</div>;
    }

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
