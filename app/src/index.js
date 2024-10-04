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
import Landingpage from './pages/landingpage';
import Dashboard from './pages/dashboard';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Profile from './pages/profile';
import { ToastProvider } from './context/toastContext';

const routes = [
    { path: '/home', element: Landingpage },
    { path: '/dashboard', element: Dashboard },
    { path: '/login', element: Login },
    { path: '/register', element: Register },
    { path: '/profile', element: Profile },
    { path: '/', element: Navigate, to: '/home' },
];

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserContextProvider>
        <ToastProvider>
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
        </ToastProvider>
    </UserContextProvider>
);
