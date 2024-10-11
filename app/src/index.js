import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import axios from 'axios';
import './index.css';

import { UserContextProvider } from './context/userContext';
import { ToastProvider } from './context/toastContext';
import { DialogProvider } from './context/dialogContext';

import Landingpage from './pages/landingpage';
import Dashboard from './pages/dashboard';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Profile from './pages/profile';
import Friends from './pages/friends';
import Notifications from './pages/notifications';

const routes = [
    { path: '/home', element: Landingpage },
    { path: '/dashboard', element: Dashboard },
    { path: '/login', element: Login },
    { path: '/register', element: Register },
    { path: '/profile', element: Profile },
    { path: '/friends', element: Friends },
    { path: '/notifications', element: Notifications },
    { path: '/', element: Navigate, to: '/home' },
];

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserContextProvider>
        <ToastProvider>
            <DialogProvider>
                <Router>
                    <Routes>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={<route.element to={route.to} />}
                            />
                        ))}
                    </Routes>
                </Router>
            </DialogProvider>
        </ToastProvider>
    </UserContextProvider>
);
