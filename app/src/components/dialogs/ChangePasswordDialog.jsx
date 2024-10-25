import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { X, Lock } from 'lucide-react';
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

    const PasswordInput = ({ label, name, ...props }) => (
        <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-white/70 mb-2'>
                {label}
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400 dark:text-white/40' />
                </div>
                <input
                    type='password'
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 
                    border border-gray-200 dark:border-white/10
                    focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 dark:focus:ring-[#4785FF]/10 
                    transition-all duration-200 outline-none
                    text-gray-900 dark:text-white
                    placeholder:text-gray-400 dark:placeholder:text-white/40'
                    {...props}
                />
            </div>
        </div>
    );

    return (
        <DialogContainer onClose={onClose}>
            <div className='bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20'>
                <div className='p-6 border-b border-gray-200 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <Lock className='w-5 h-5 text-white' />
                            </div>
                            <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                                Passwort ändern
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors duration-200'
                        >
                            <X className='h-5 w-5 text-gray-400 dark:text-white/40' />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    <PasswordInput
                        label='Aktuelles Passwort'
                        name='oldPassword'
                        placeholder='••••••••'
                        required
                    />
                    <PasswordInput
                        label='Neues Passwort'
                        name='newPassword'
                        placeholder='••••••••'
                        required
                    />
                    <PasswordInput
                        label='Neues Passwort bestätigen'
                        name='confirmPassword'
                        placeholder='••••••••'
                        required
                    />

                    <div className='flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-white/10'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-6 py-2.5 rounded-xl font-medium
                         text-gray-700 dark:text-white/70 
                         hover:bg-gray-100 dark:hover:bg-white/5
                         border border-gray-200 dark:border-white/10
                         transition-all duration-200'
                        >
                            Abbrechen
                        </button>
                        <button
                            type='submit'
                            className='px-6 py-2.5 rounded-xl font-medium
                         bg-gradient-to-r from-[#4785FF] to-[#8c52ff]
                         text-white shadow-lg 
                         hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
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
