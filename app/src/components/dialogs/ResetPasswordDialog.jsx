import React, { useState } from 'react';
import { X } from 'lucide-react';

const ResetPasswordDialog = ({ onClose, onResetPassword, userId }) => {
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onResetPassword(userId, newPassword);
        setNewPassword('');
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white rounded-lg p-6 w-96'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Passwort zurücksetzen</h2>
                    <button
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700'
                    >
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label
                            htmlFor='newPassword'
                            className='block text-sm font-medium text-gray-700 mb-2'
                        >
                            Neues Passwort
                        </label>
                        <input
                            type='password'
                            id='newPassword'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>
                    <div className='flex justify-end space-x-2'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
                        >
                            Abbrechen
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            Passwort zurücksetzen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordDialog;
