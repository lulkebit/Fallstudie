import { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/containers/ToastContainer';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        setToasts((prevToasts) => [
            ...prevToasts,
            { id: Date.now(), message, type },
        ]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
        );
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
