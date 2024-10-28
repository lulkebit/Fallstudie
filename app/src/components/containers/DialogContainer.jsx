import React, { useEffect } from 'react';

const DialogContainer = ({ children, onClose }) => {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto'
            onClick={handleBackdropClick}
        >
            {/* Backdrop with blur */}
            <div className='fixed inset-0 bg-black/50 backdrop-blur-sm' />

            {/* Dialog wrapper with max height and scroll */}
            <div className='relative flex items-center min-h-full py-8'>
                {/* Dialog content */}
                <div className='relative w-full max-w-2xl mx-auto'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DialogContainer;
