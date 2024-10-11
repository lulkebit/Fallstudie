import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { useToast } from '../../context/toastContext';
import { X, Lock } from 'lucide-react';

const InputField = ({ id, label, value, onChange, placeholder }) => (
    <div className='relative'>
        <label
            htmlFor={id}
            className='absolute left-2 -top-2.5 bg-white px-1 text-xs font-medium text-gray-600 z-10'
        >
            {label}
        </label>
        <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock className='h-5 w-5 text-gray-400' />
            </div>
            <input
                type='password'
                id={id}
                value={value}
                onChange={onChange}
                required
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out'
                placeholder={placeholder}
            />
        </div>
    </div>
);

const ChangePasswordDialog = ({ onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { user } = useContext(UserContext);
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            addToast('Passwörter stimmen nicht überein', 'error');
            return;
        }

        try {
            await axios.put('/change-password', {
                userId: user._id,
                oldPassword,
                newPassword,
            });
            addToast('Passwort erfolgreich geändert', 'success');
            onClose();
        } catch (error) {
            addToast('Fehler beim Ändern des Passworts', 'error');
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-gray-600 bg-opacity-75'>
            <div className='relative w-full max-w-md mx-auto my-6'>
                <div className='relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none'>
                    <div className='flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t'>
                        <h2 className='text-2xl font-semibold text-gray-700'>
                            Passwort ändern
                        </h2>
                        <button
                            className='p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors duration-200 ease-in-out hover:text-gray-600'
                            onClick={onClose}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className='px-6 py-4 space-y-6'
                    >
                        <InputField
                            id='oldPassword'
                            label='Altes Passwort'
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder='Geben Sie Ihr aktuelles Passwort ein'
                        />
                        <InputField
                            id='newPassword'
                            label='Neues Passwort'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='Geben Sie Ihr neues Passwort ein'
                        />
                        <InputField
                            id='confirmPassword'
                            label='Neues Passwort bestätigen'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Bestätigen Sie Ihr neues Passwort'
                        />
                        <div className='flex items-center justify-end pt-4 border-t border-solid border-gray-300'>
                            <button
                                type='button'
                                onClick={onClose}
                                className='text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-gray-100 rounded'
                            >
                                Abbrechen
                            </button>
                            <button
                                type='submit'
                                className='bg-blue-600 text-white active:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 transform hover:scale-105'
                            >
                                Ändern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordDialog;
