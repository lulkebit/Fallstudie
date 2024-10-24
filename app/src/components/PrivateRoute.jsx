import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import LoadingPage from '../pages/LoadingPage';

const PrivateRoute = () => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <LoadingPage />;
    }

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
