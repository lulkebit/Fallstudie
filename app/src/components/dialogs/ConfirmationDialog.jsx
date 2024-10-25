import React from 'react';
import { X } from 'lucide-react';

const ConfirmationDialog = ({
    title = 'Bestätigung',
    message,
    onConfirm,
    onClose,
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div
                className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 
                          dark:border-white/10 shadow-xl dark:shadow-none max-w-md w-full
                          transform transition-all duration-200 hover:scale-[1.02]'
            >
                <div className='p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl 
                                 transition-colors duration-200'
                    >
                        <X className='h-5 w-5 text-gray-400 dark:text-white/40' />
                    </button>
                </div>

                <div className='p-6'>
                    <p className='text-gray-600 dark:text-white/70 text-lg leading-relaxed'>
                        {message}
                    </p>
                </div>

                <div className='p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3'>
                    <button
                        onClick={onClose}
                        className='px-6 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl 
                                 font-medium text-gray-600 dark:text-white/70
                                 hover:bg-gray-100 dark:hover:bg-white/5 
                                 transition-all duration-200 hover:-translate-y-0.5'
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleConfirm}
                        className='px-6 py-2.5 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                 text-white rounded-xl font-medium shadow-lg 
                                 hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                 transition-all duration-200 hover:-translate-y-0.5'
                    >
                        Bestätigen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
