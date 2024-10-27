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
        }, 300);
    };

    const toastConfig = {
        info: {
            background: 'bg-white/70 dark:bg-white/5',
            border: 'border-[#4785FF] dark:border-[#4785FF]/50',
            icon: (
                <Info className='w-5 h-5 text-[#4785FF] dark:text-[#4785FF]/90' />
            ),
            textColor: 'text-gray-900 dark:text-white',
        },
        success: {
            background: 'bg-white/70 dark:bg-white/5',
            border: 'border-green-500 dark:border-green-500/50',
            icon: (
                <CheckCircle className='w-5 h-5 text-green-500 dark:text-green-500/90' />
            ),
            textColor: 'text-gray-900 dark:text-white',
        },
        error: {
            background: 'bg-white/70 dark:bg-white/5',
            border: 'border-red-500 dark:border-red-500/50',
            icon: (
                <AlertOctagon className='w-5 h-5 text-red-500 dark:text-red-500/90' />
            ),
            textColor: 'text-gray-900 dark:text-white',
        },
        warning: {
            background: 'bg-white/70 dark:bg-white/5',
            border: 'border-yellow-500 dark:border-yellow-500/50',
            icon: (
                <AlertTriangle className='w-5 h-5 text-yellow-500 dark:text-yellow-500/90' />
            ),
            textColor: 'text-gray-900 dark:text-white',
        },
    };

    const config = toastConfig[type];

    return (
        <div
            className={`
                group flex items-center gap-3 p-4 rounded-xl border-l-4
                shadow-lg backdrop-blur-xl
                ${config.background}
                ${config.border}
                border-gray-200/50 dark:border-white/10
                ${
                    isClosing
                        ? 'animate-[slideRight_0.3s_ease-in-out_forwards]'
                        : 'animate-[slideLeft_0.3s_ease-in-out_forwards]'
                }
                transition-all duration-300
                hover:translate-x-[-4px] 
                hover:shadow-xl dark:hover:shadow-black/5
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
                    p-1.5 rounded-lg opacity-0 group-hover:opacity-100
                    transition-all duration-200
                    hover:bg-black/5 dark:hover:bg-white/5
                `}
            >
                <X className={`w-4 h-4 ${config.textColor}`} />
            </button>
        </div>
    );
};

export default Toast;
