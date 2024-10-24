import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

const EditUserDialog = ({ user, onClose, onSave }) => {
    const [editedUser, setEditedUser] = useState({
        email: user.email || '',
        username: user.username || '',
        firstName: user.firstname || '',
        lastName: user.lastname || '',
    });
    const [isChanged, setIsChanged] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const hasChanges = Object.keys(editedUser).some(
            (key) => editedUser[key] !== user[key.toLowerCase()]
        );
        setIsChanged(hasChanges);
    }, [editedUser, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(editedUser);
            onClose();
        } catch (error) {
            addToast('Fehler beim Aktualisieren der Benutzerdaten', 'error');
        }
    };

    return (
        <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-xl max-w-xl w-full'>
                <div className='p-6 border-b border-gray-100'>
                    <h3 className='text-xl font-bold text-gray-800'>
                        Benutzer bearbeiten
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-1.5'>
                                Benutzername
                            </label>
                            <input
                                type='text'
                                name='username'
                                value={editedUser.username}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 
                                         focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-1.5'>
                                E-Mail
                            </label>
                            <input
                                type='email'
                                name='email'
                                value={editedUser.email}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 
                                         focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-1.5'>
                                Vorname
                            </label>
                            <input
                                type='text'
                                name='firstName'
                                value={editedUser.firstName}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 
                                         focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-1.5'>
                                Nachname
                            </label>
                            <input
                                type='text'
                                name='lastName'
                                value={editedUser.lastName}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 
                                         focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none'
                                required
                            />
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 pt-4 border-t border-gray-100'>
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
                            disabled={!isChanged}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 
                                     ${
                                         !isChanged
                                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                             : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:scale-105'
                                     }`}
                        >
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserDialog;
