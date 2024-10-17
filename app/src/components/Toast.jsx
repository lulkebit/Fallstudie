import React, { useEffect, useState } from 'react';
import {
    X,
    Info,
    CheckCircle,
    AlertTriangle,
    AlertOctagon,
} from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 500);
    };

    const toastStyles = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
    };

    const toastIcons = {
        info: <Info className='mr-2' />,
        success: <CheckCircle className='mr-2' />,
        error: <AlertOctagon className='mr-2' />,
        warning: <AlertTriangle className='mr-2' />,
    };

    return (
        <div
            className={`
                p-4 rounded-lg shadow-lg text-white
                ${toastStyles[type]}
                transition-all duration-300 ease-in-out
                ${
                    isClosing
                        ? 'animate-slide-out-right'
                        : 'animate-slide-in-right'
                }
                hover:scale-105 hover:shadow-xl
                hover:translate-x-[-5px]
                cursor-pointer
            `}
        >
            <div className='flex items-center'>
                {toastIcons[type]}
                <span className='flex-grow'>{message}</span>
                <button
                    onClick={handleClose}
                    className='ml-4 text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none'
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
