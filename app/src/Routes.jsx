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
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import LoadingPage from './pages/LoadingPage';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';
import GlobalGoals from './pages/GlobalGoals';
import LegalNotice from './pages/LegalNotice';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CookieBanner from './components/CookieBanner';

function MyRoutes() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Router>
            <CookieBanner />
            <Routes>
                <Route path='/' element={<Landingpage />} />
                <Route path='/impressum' element={<LegalNotice />} />
                <Route path='/datenschutz' element={<Privacy />} />
                <Route path='/agb' element={<Terms />} />
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
                    <Route path='/globalgoals' element={<GlobalGoals />} />
                    <Route element={<AdminRoute />}>
                        <Route path='/admin' element={<AdminPanel />} />
                    </Route>
                </Route>

                <Route path='*' element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default MyRoutes;
