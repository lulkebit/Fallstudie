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
        }, 300); // Reduced for snappier feeling
    };

    const toastConfig = {
        info: {
            background: 'bg-blue-50 border-blue-500',
            icon: <Info className='w-5 h-5 text-blue-500' />,
            textColor: 'text-blue-900',
        },
        success: {
            background: 'bg-green-50 border-green-500',
            icon: <CheckCircle className='w-5 h-5 text-green-500' />,
            textColor: 'text-green-900',
        },
        error: {
            background: 'bg-red-50 border-red-500',
            icon: <AlertOctagon className='w-5 h-5 text-red-500' />,
            textColor: 'text-red-900',
        },
        warning: {
            background: 'bg-yellow-50 border-yellow-500',
            icon: <AlertTriangle className='w-5 h-5 text-yellow-500' />,
            textColor: 'text-yellow-900',
        },
    };

    const config = toastConfig[type];

    return (
        <div
            className={`
                group flex items-center gap-3 p-4 rounded-xl border-l-4
                shadow-lg backdrop-blur-sm
                ${config.background}
                ${
                    isClosing
                        ? 'animate-[slideRight_0.3s_ease-in-out_forwards]'
                        : 'animate-[slideLeft_0.3s_ease-in-out_forwards]'
                }
                transition-all duration-300
                hover:translate-x-[-4px] hover:shadow-xl
            `}
        >
            {config.icon}

            <span
                className={`flex-grow text-sm font-medium ${config.textColor}`}
            >
                {message}
            </span>

            <button
                onClick={handleClose}
                className={`
                    p-1 rounded-lg opacity-0 group-hover:opacity-100
                    transition-all duration-200
                    hover:bg-black/5
                `}
            >
                <X className={`w-4 h-4 ${config.textColor}`} />
            </button>
        </div>
    );
};

export default Toast;
