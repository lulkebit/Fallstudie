import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { UserContextProvider } from './context/userContext';
import { ToastProvider } from './context/toastContext';
import { DialogProvider } from './context/dialogContext';
import './index.css';
import MyRoutes from './routes';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserContextProvider>
        <ToastProvider>
            <DialogProvider>
                <MyRoutes />
            </DialogProvider>
        </ToastProvider>
    </UserContextProvider>
);
