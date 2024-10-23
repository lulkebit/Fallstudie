import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';
import CustomInput from '../CustomInput';

const ResetPasswordDialog = ({ onClose, onResetPassword, userId }) => {
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onResetPassword(userId, newPassword);
        setNewPassword('');
        onClose();
    };

    return (
        <DialogContainer onClose={onClose}>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h3 className='text-xl font-bold text-gray-800'>
                    Passwort zurücksetzen
                </h3>
                <button
                    onClick={onClose}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                >
                    <X className='h-5 w-5 text-gray-400' />
                </button>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onResetPassword(userId, newPassword);
                }}
                className='p-6'
            >
                <CustomInput
                    id='newPassword'
                    label='Neues Passwort'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={Lock}
                />

                <div className='mt-6 flex justify-end gap-3'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='px-6 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 
                                hover:bg-gray-50 transition-colors duration-200'
                    >
                        Abbrechen
                    </button>
                    <button
                        type='submit'
                        className='px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-lg 
                                hover:bg-blue-700 transition-all duration-200 hover:shadow-xl hover:scale-105'
                    >
                        Zurücksetzen
                    </button>
                </div>
            </form>
        </DialogContainer>
    );
};

export default ResetPasswordDialog;
