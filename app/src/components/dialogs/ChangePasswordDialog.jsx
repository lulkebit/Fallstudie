import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { X, Lock, KeyRound, KeySquare } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

const ChangePasswordDialog = ({ onClose }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const { user } = useContext(UserContext);
    const { addToast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

    const PasswordInput = ({ label, name, icon: Icon, ...props }) => (
        <div className='relative group'>
            <div className='absolute -inset-1'>
                <div className='w-full h-full rotate-180 opacity-30 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute inset-0 -z-10 group-hover:animate-[pulse_2s_infinite]'>
                        <div className='absolute inset-0 translate-x-0 blur-2xl bg-gradient-to-r from-[#4785FF]/30 to-[#8c52ff]/30' />
                    </div>
                </div>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white/70 mb-2'>
                    {label}
                </label>
                <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Icon className='h-5 w-5 text-[#4785FF] dark:text-[#8c52ff]' />
                    </div>
                    <input
                        type='password'
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className='w-full pl-10 pr-4 py-3 rounded-xl
                        bg-white/70 dark:bg-gray-900/50
                        border border-gray-200/50 dark:border-white/10
                        focus:border-[#4785FF] dark:focus:border-[#8c52ff]
                        focus:ring-2 focus:ring-[#4785FF]/20 dark:focus:ring-[#8c52ff]/10
                        transition-all duration-200 outline-none
                        text-gray-900 dark:text-white
                        placeholder:text-gray-400 dark:placeholder:text-white/40'
                        {...props}
                    />
                </div>
            </div>
        </div>
    );

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
                        placeholder='••••••••'
                        required
                    />
                    <PasswordInput
                        label='Neues Passwort'
                        name='newPassword'
                        icon={KeySquare}
                        placeholder='••••••••'
                        required
                    />
                    <PasswordInput
                        label='Neues Passwort bestätigen'
                        name='confirmPassword'
                        icon={Lock}
                        placeholder='••••••••'
                        required
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
