import React, { useState } from 'react';
import { Lock, X, KeySquare } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';
import PasswordInput from '../PasswordInput';

const ResetPasswordDialog = ({ onClose, onResetPassword, userId }) => {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (password) => {
        if (!password) {
            return 'Bitte gib ein Passwort ein';
        }

        if (password.length < 8) {
            return 'Das Passwort muss mindestens 8 Zeichen lang sein';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Das Passwort muss mindestens einen Großbuchstaben enthalten';
        }
        if (!/[a-z]/.test(password)) {
            return 'Das Passwort muss mindestens einen Kleinbuchstaben enthalten';
        }
        if (!/[0-9]/.test(password)) {
            return 'Das Passwort muss mindestens eine Zahl enthalten';
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return 'Das Passwort muss mindestens ein Sonderzeichen enthalten';
        }

        return '';
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setNewPassword(value);
        setError(validatePassword(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        await onResetPassword(userId, newPassword);
        setNewPassword('');
        onClose();
    };

    return (
        <DialogContainer onClose={onClose}>
            <div className='fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-90' />

            {/* Decorative Elements */}
            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div className='relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20'>
                {/* Header */}
                <div className='p-6 border-b border-gray-200/50 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <Lock className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Passwort zurücksetzen
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    Setze ein neues Passwort für den Benutzer
                                </p>
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

                {/* Form */}
                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    <PasswordInput
                        label='Neues Passwort'
                        name='newPassword'
                        icon={KeySquare}
                        value={newPassword}
                        onChange={handleChange}
                        placeholder='••••••••'
                        required
                        error={error}
                    />

                    <div className='flex justify-end gap-3 pt-6 border-t border-gray-200/50 dark:border-white/10'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-6 py-3 rounded-xl font-medium
                                text-gray-700 dark:text-white/70 
                                bg-gray-100/50 dark:bg-gray-900/50
                                hover:bg-gray-200/50 dark:hover:bg-white/5
                                border border-gray-200/50 dark:border-white/10
                                transition-all duration-200'
                        >
                            Abbrechen
                        </button>
                        <button
                            type='submit'
                            disabled={!!error || !newPassword}
                            className={`px-6 py-3 rounded-xl font-medium
                                transition-all duration-200 
                                ${
                                    !!error || !newPassword
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-white/40 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20 hover:-translate-y-0.5'
                                }`}
                        >
                            Zurücksetzen
                        </button>
                    </div>
                </form>
            </div>
        </DialogContainer>
    );
};

export default ResetPasswordDialog;
