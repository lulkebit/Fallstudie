// app/src/Routes.jsx
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
import NotFound from './pages/NotFound';

function MyRoutes() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return (
            <div className='flex items-center justify-center py-4'>
                <Loader className='animate-spin mr-2' />
                <span>Lädt...</span>
            </div>
        );
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
                <Route path='*' element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default MyRoutes;
