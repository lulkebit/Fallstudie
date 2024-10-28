import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { X, User, Mail, UserCircle, UserSquare } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

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
            addToast('Benutzerdaten erfolgreich aktualisiert', 'success');
            onClose();
        } catch (error) {
            addToast('Fehler beim Aktualisieren der Benutzerdaten', 'error');
        }
    };

    const InputField = ({ label, name, icon: Icon, ...props }) => (
        <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5'>
                {label}
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <Icon className='h-5 w-5 text-gray-400 dark:text-white/40' />
                </div>
                <input
                    {...props}
                    name={name}
                    className='w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200/50 dark:border-white/10 
                             bg-white/50 dark:bg-white/5 backdrop-blur-sm
                             focus:border-blue-500 dark:focus:border-blue-400
                             focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400/20
                             transition-all duration-200 outline-none
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-white/40'
                />
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
                                <User className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Benutzer bearbeiten
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    Aktualisiere die Benutzerdaten
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
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <InputField
                            label='Benutzername'
                            name='username'
                            icon={UserCircle}
                            value={editedUser.username}
                            onChange={handleInputChange}
                            placeholder='max.mustermann'
                            required
                        />
                        <InputField
                            label='E-Mail'
                            name='email'
                            icon={Mail}
                            type='email'
                            value={editedUser.email}
                            onChange={handleInputChange}
                            placeholder='max@beispiel.de'
                            required
                        />
                        <InputField
                            label='Vorname'
                            name='firstName'
                            icon={User}
                            value={editedUser.firstName}
                            onChange={handleInputChange}
                            placeholder='Max'
                            required
                        />
                        <InputField
                            label='Nachname'
                            name='lastName'
                            icon={UserSquare}
                            value={editedUser.lastName}
                            onChange={handleInputChange}
                            placeholder='Mustermann'
                            required
                        />
                    </div>

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
                            disabled={!isChanged}
                            className={`px-6 py-3 rounded-xl font-medium
                                transition-all duration-200 
                                ${
                                    !isChanged
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-white/40 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20 hover:-translate-y-0.5'
                                }`}
                        >
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        </DialogContainer>
    );
};

export default EditUserDialog;
