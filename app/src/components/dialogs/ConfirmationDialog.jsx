import React from 'react';
import { X } from 'lucide-react';

const ConfirmationDialog = ({ message, onConfirm, onClose }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-xl max-w-md w-full'>
                <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                    <h3 className='text-xl font-bold text-gray-800'>
                        Bestätigung
                    </h3>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                    >
                        <X className='h-5 w-5 text-gray-400' />
                    </button>
                </div>

                <div className='p-6'>
                    <p className='text-gray-600 text-lg'>{message}</p>
                </div>

                <div className='p-6 border-t border-gray-100 flex justify-end gap-3'>
                    <button
                        onClick={onClose}
                        className='px-6 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 
                                 hover:bg-gray-50 transition-colors duration-200'
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleConfirm}
                        className='px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-lg 
                                 hover:bg-blue-700 transition-all duration-200 hover:shadow-xl hover:scale-105'
                    >
                        Bestätigen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
