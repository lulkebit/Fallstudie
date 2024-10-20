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
        <div className='fixed inset-0 z-50 pt-20 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
            <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
                <h3 className='text-lg font-medium leading-6 text-gray-900 mb-4'>
                    Benutzer bearbeiten
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2'
                            htmlFor='username'
                        >
                            Benutzername
                        </label>
                        <input
                            type='text'
                            id='username'
                            name='username'
                            value={editedUser.username}
                            onChange={handleInputChange}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2'
                            htmlFor='email'
                        >
                            E-Mail
                        </label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={editedUser.email}
                            onChange={handleInputChange}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2'
                            htmlFor='firstName'
                        >
                            Vorname
                        </label>
                        <input
                            type='text'
                            id='firstName'
                            name='firstName'
                            value={editedUser.firstName}
                            onChange={handleInputChange}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 text-sm font-bold mb-2'
                            htmlFor='lastName'
                        >
                            Nachname
                        </label>
                        <input
                            type='text'
                            id='lastName'
                            name='lastName'
                            value={editedUser.lastName}
                            onChange={handleInputChange}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            required
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <button
                            type='submit'
                            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                !isChanged
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-blue-700'
                            }`}
                            disabled={!isChanged}
                        >
                            Speichern
                        </button>
                        <button
                            type='button'
                            onClick={onClose}
                            className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        >
                            Abbrechen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserDialog;
