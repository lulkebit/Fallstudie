import React, { useContext } from 'react';
import { UserContext } from './context/UserContext';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Landingpage from './pages/Landingpage';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Friends from './pages/Friends';
import Notifications from './pages/Notifications';
import { Loader } from 'lucide-react';
import PrivateRoute from './components/PrivateRoute';

function MyRoutes() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <Loader />;
    }

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Landingpage />} />
                <Route
                    path='/login'
                    element={
                        user ? <Navigate to='/Dashboard' replace /> : <Login />
                    }
                />
                <Route
                    path='/register'
                    element={
                        user ? (
                            <Navigate to='/Dashboard' replace />
                        ) : (
                            <Register />
                        )
                    }
                />

                <Route element={<PrivateRoute />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/friends' element={<Friends />} />
                    <Route path='/notifications' element={<Notifications />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default MyRoutes;
