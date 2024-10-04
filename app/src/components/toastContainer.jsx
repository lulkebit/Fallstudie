import React from 'react';
import Toast from './toast';

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className='fixed top-4 right-4 z-50 flex flex-col space-y-4 w-72'>
            {toasts.map((toast, index) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    index={index}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
