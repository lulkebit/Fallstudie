import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import MyRoutes from './Routes';
import { UserContextProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import { DialogProvider } from './context/DialogContext';
import { ThemeProvider } from './context/ThemeContext';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserContextProvider>
        <ThemeProvider>
            <ToastProvider>
                <DialogProvider>
                    <MyRoutes />
                </DialogProvider>
            </ToastProvider>
        </ThemeProvider>
    </UserContextProvider>
);
