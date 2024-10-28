import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { X, Lock, KeyRound, KeySquare, CheckCircle2 } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';
import PasswordInput from '../PasswordInput';

const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = () => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const strength = getStrength();
    const getColor = () => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        if (strength <= 4) return 'bg-green-500';
        return 'bg-green-600';
    };

    const requirements = [
        { text: 'Mindestens 8 Zeichen', met: password.length >= 8 },
        { text: 'Großbuchstaben (A-Z)', met: /[A-Z]/.test(password) },
        { text: 'Kleinbuchstaben (a-z)', met: /[a-z]/.test(password) },
        { text: 'Zahlen (0-9)', met: /[0-9]/.test(password) },
        {
            text: 'Sonderzeichen (!@#$%^&*)',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];

    return (
        <div className='mt-4 space-y-3'>
            <div className='space-y-2'>
                <div className='flex gap-1 h-1.5'>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-full w-full rounded-full ${
                                i < strength
                                    ? getColor()
                                    : 'bg-gray-200 dark:bg-white/10'
                            }`}
                        />
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                {requirements.map((req, index) => (
                    <div key={index} className='flex items-center gap-1.5'>
                        <CheckCircle2
                            className={`h-4 w-4 ${
                                req.met
                                    ? 'text-green-500'
                                    : 'text-gray-300 dark:text-white/20'
                            }`}
                        />
                        <span
                            className={`text-xs ${
                                req.met
                                    ? 'text-gray-700 dark:text-white'
                                    : 'text-gray-500 dark:text-white/40'
                            }`}
                        >
                            {req.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ChangePasswordDialog = ({ onClose }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const [errors, setErrors] = useState({});

    const validatePassword = (password) => {
        if (!password) {
            return 'Bitte geben Sie ein Passwort ein';
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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Validate new password when it changes
        if (name === 'newPassword') {
            const error = validatePassword(value);
            setErrors(prev => ({ ...prev, newPassword: error }));
        }
        
        // Check password confirmation when either password changes
        if (name === 'newPassword' || name === 'confirmPassword') {
            if (name === 'confirmPassword' && value !== formData.newPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Die Passwörter stimmen nicht überein' }));
            } else if (name === 'newPassword' && value !== formData.confirmPassword && formData.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Die Passwörter stimmen nicht überein' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate new password
        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            addToast(passwordError, 'error');
            return;
        }

        // Check password confirmation
        if (formData.newPassword !== formData.confirmPassword) {
            addToast('Die Passwörter stimmen nicht überein', 'error');
            return;
        }

        try {
            await axios.put('/change-password', {
                userId: user._id,
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            });
            addToast('Passwort erfolgreich geändert', 'success');
            onClose();
        } catch (error) {
            addToast('Fehler beim Ändern des Passworts', 'error');
        }
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
                                    Passwort ändern
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    Aktualisiere dein Passwort für mehr
                                    Sicherheit
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
                        label='Aktuelles Passwort'
                        name='oldPassword'
                        icon={KeyRound}
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder='••••••••'
                        required
                    />
                    <div>
                        <PasswordInput
                            label='Neues Passwort'
                            name='newPassword'
                            icon={KeySquare}
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder='••••••••'
                            required
                            error={errors.newPassword}
                        />
                        <PasswordStrengthIndicator password={formData.newPassword} />
                    </div>
                    <PasswordInput
                        label='Neues Passwort bestätigen'
                        name='confirmPassword'
                        icon={Lock}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder='••••••••'
                        required
                        error={errors.confirmPassword}
                    />

                    {/* Actions */}
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
                            className='px-6 py-3 rounded-xl font-medium
                                bg-gradient-to-r from-[#4785FF] to-[#8c52ff]
                                text-white 
                                shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10
                                hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20
                                transition-all duration-200 hover:-translate-y-0.5'
                        >
                            Passwort ändern
                        </button>
                    </div>
                </form>
            </div>
        </DialogContainer>
    );
};

export default ChangePasswordDialog;
