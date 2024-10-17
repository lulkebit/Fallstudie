import React, { useContext } from 'react';
import { UserContext } from './context/userContext';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Landingpage from './pages/landingpage';
import Profile from './pages/profile';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Friends from './pages/friends';
import Notifications from './pages/notifications';
import { Loader } from 'lucide-react';
import PrivateRoute from './components/privateRoute';

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
                        user ? <Navigate to='/dashboard' replace /> : <Login />
                    }
                />
                <Route
                    path='/register'
                    element={
                        user ? (
                            <Navigate to='/dashboard' replace />
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
