import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { X, Lock } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';
import CustomInput from '../CustomInput';

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
        <DialogContainer onClose={onClose}>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h3 className='text-xl font-bold text-gray-800'>
                    Passwort ändern
                </h3>
                <button
                    onClick={onClose}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                >
                    <X className='h-5 w-5 text-gray-400' />
                </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                <CustomInput
                    id='oldPassword'
                    label='Altes Passwort'
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    icon={Lock}
                />
                <CustomInput
                    id='newPassword'
                    label='Neues Passwort'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={Lock}
                />
                <CustomInput
                    id='confirmPassword'
                    label='Neues Passwort bestätigen'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={Lock}
                />

                <div className='pt-4 border-t border-gray-100 flex justify-end gap-3'>
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
                        Ändern
                    </button>
                </div>
            </form>
        </DialogContainer>
    );
};

export default ChangePasswordDialog;
