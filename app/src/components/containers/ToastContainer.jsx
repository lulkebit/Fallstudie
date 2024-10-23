import React from 'react';
import Toast from '../Toast';

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-3 min-w-[320px] max-w-[420px]'>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
