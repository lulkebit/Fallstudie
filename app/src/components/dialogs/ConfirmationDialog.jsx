import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

const ConfirmationDialog = ({
    title = 'Bestätigung',
    message,
    onConfirm,
    onClose,
    icon: CustomIcon,
    variant = 'info',
    confirmText = 'Bestätigen',
    cancelText = 'Abbrechen',
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const getVariantStyles = () => {
        const styles = {
            info: {
                gradient: 'from-[#4785FF] to-[#8c52ff]',
                glow: 'bg-[#4785FF]/10',
            },
            danger: {
                gradient: 'from-red-500 to-red-600',
                glow: 'bg-red-500/10',
            },
            warning: {
                gradient: 'from-amber-500 to-amber-600',
                glow: 'bg-amber-500/10',
            },
            success: {
                gradient: 'from-emerald-500 to-emerald-600',
                glow: 'bg-emerald-500/10',
            },
        };
        return styles[variant] || styles.info;
    };

    const variantStyles = getVariantStyles();
    const Icon = CustomIcon || AlertCircle;

    return (
        <DialogContainer onClose={onClose}>
            <div className='fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-90' />

            {/* Decorative Elements */}
            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div
                    className={`absolute top-1/4 right-1/4 w-96 h-96 ${variantStyles.glow} rounded-full blur-3xl animate-pulse`}
                />
                <div
                    className={`absolute bottom-1/4 left-1/4 w-96 h-96 ${variantStyles.glow} rounded-full blur-3xl animate-pulse delay-1000`}
                />
            </div>

            <div className='relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20 max-w-md w-full'>
                {/* Header */}
                <div className='p-6 border-b border-gray-200/50 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${variantStyles.gradient} flex items-center justify-center`}
                            >
                                <Icon className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    {title}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors duration-200'
                        >
                            <X className='h-5 w-5 text-gray-400 dark:text-white/40' />
                        </button>
                    </div>
                </div>

                {/* Message */}
                <div className='p-6'>
                    <p className='text-gray-600 dark:text-white/70 text-lg leading-relaxed'>
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className='flex justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-white/10'>
                    <button
                        onClick={onClose}
                        className='px-6 py-3 rounded-xl font-medium
                            text-gray-700 dark:text-white/70 
                            bg-gray-100/50 dark:bg-gray-900/50
                            hover:bg-gray-200/50 dark:hover:bg-white/5
                            border border-gray-200/50 dark:border-white/10
                            transition-all duration-200'
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-6 py-3 rounded-xl font-medium
                            bg-gradient-to-r ${variantStyles.gradient}
                            text-white
                            shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10
                            hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20
                            transition-all duration-200 hover:-translate-y-0.5`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </DialogContainer>
    );
};

export default ConfirmationDialog;
