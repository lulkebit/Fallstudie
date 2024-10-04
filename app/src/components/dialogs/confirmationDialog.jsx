import React from 'react';
import { X } from 'lucide-react';

const ConfirmationDialog = ({ message, onConfirm, onClose }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-gray-600 bg-opacity-75'>
            <div className='relative w-full max-w-md mx-auto my-6'>
                <div className='relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none'>
                    <div className='flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t'>
                        <h3 className='text-2xl font-semibold text-gray-700'>
                            Bestätigung
                        </h3>
                        <button
                            className='p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors duration-200 ease-in-out hover:text-gray-600'
                            onClick={onClose}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className='relative p-6 flex-auto'>
                        <p className='my-4 text-gray-600 text-lg leading-relaxed'>
                            {message}
                        </p>
                    </div>
                    <div className='flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b'>
                        <button
                            className='text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-gray-100 rounded'
                            type='button'
                            onClick={onClose}
                        >
                            Abbrechen
                        </button>
                        <button
                            className='bg-blue-600 text-white active:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 transform hover:scale-105'
                            type='button'
                            onClick={handleConfirm}
                        >
                            Bestätigen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
