import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import EditUserDialog from './dialogs/EditUserDialog';
import ResetPasswordDialog from './dialogs/ResetPasswordDialog';
import Loader from './Loader';
import {
    Pencil,
    Trash2,
    Key,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();
    const { addDialog, removeDialog } = useDialog();

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/users', {
                params: {
                    page: currentPage,
                    limit: 10,
                    search: searchTerm,
                },
            });
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            addToast('Failed to fetch users', 'error');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        addDialog({
            component: ConfirmationDialog,
            props: {
                message: `Sind Sie sicher, dass Sie den Benutzer "${username}" löschen möchten?`,
                onConfirm: async () => {
                    try {
                        await axios.delete(`/users/${userId}`);
                        fetchUsers();
                        addToast(
                            `Benutzer "${username}" erfolgreich gelöscht`,
                            'success'
                        );
                    } catch (err) {
                        addToast(
                            `Fehler beim Löschen des Benutzers "${username}"`,
                            'error'
                        );
                    }
                },
                onClose: removeDialog,
            },
        });
    };

    const handleEditUser = (user) => {
        addDialog({
            component: EditUserDialog,
            props: {
                user,
                onSave: async (updatedUser) => {
                    try {
                        await axios.put(`/users/${user._id}`, updatedUser);
                        fetchUsers();
                        addToast(
                            'Benutzer erfolgreich aktualisiert',
                            'success'
                        );
                    } catch (err) {
                        addToast(
                            'Fehler beim Aktualisieren des Benutzers ' + err,
                            'error'
                        );
                    }
                    removeDialog();
                },
                onClose: removeDialog,
            },
        });
    };

    const handleResetPassword = (userId, username) => {
        addDialog({
            component: ResetPasswordDialog,
            props: {
                userId,
                onResetPassword: async (userId, newPassword) => {
                    try {
                        await axios.put(`/users/${userId}/reset-password`, {
                            newPassword,
                        });
                        addToast(
                            `Passwort für Benutzer "${username}" erfolgreich zurückgesetzt`,
                            'success'
                        );
                    } catch (err) {
                        addToast(
                            `Fehler beim Zurücksetzen des Passworts für Benutzer "${username}"`,
                            'error'
                        );
                    }
                    removeDialog();
                },
                onClose: removeDialog,
            },
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className='bg-gray-50 p-6 rounded-xl'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                <h2 className='text-2xl font-bold text-gray-800'>
                    Benutzer Verwaltung
                </h2>
                <div className='relative w-full md:w-64'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                    <input
                        type='text'
                        placeholder='Suche nach Benutzern...'
                        value={searchTerm}
                        onChange={handleSearch}
                        className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 
                                 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none'
                    />
                </div>
            </div>

            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <Loader />
                </div>
            ) : users.length === 0 ? (
                <div className='text-center py-12 bg-white rounded-xl shadow-sm'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Search className='w-8 h-8 text-gray-400' />
                    </div>
                    <p className='text-gray-500 text-lg'>
                        Keine Benutzer gefunden.
                    </p>
                </div>
            ) : (
                <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-gray-50 border-b border-gray-100'>
                                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-600'>
                                        Avatar
                                    </th>
                                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-600'>
                                        Username
                                    </th>
                                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-600'>
                                        Vorname
                                    </th>
                                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-600'>
                                        Nachname
                                    </th>
                                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-600'>
                                        Email
                                    </th>
                                    <th className='py-4 px-6 text-right text-sm font-semibold text-gray-600'>
                                        Aktionen
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className='hover:bg-gray-50 transition-colors'
                                    >
                                        <td className='py-4 px-6'>
                                            <img
                                                src={`data:image/jpeg;base64,${user.avatar}`}
                                                alt='Avatar'
                                                className='w-10 h-10 rounded-full object-cover'
                                            />
                                        </td>
                                        <td className='py-4 px-6 font-medium text-gray-900'>
                                            {user.username}
                                        </td>
                                        <td className='py-4 px-6 text-gray-600'>
                                            {user.firstname}
                                        </td>
                                        <td className='py-4 px-6 text-gray-600'>
                                            {user.lastname}
                                        </td>
                                        <td className='py-4 px-6 text-gray-600'>
                                            {user.email}
                                        </td>
                                        <td className='py-4 px-6'>
                                            <div className='flex justify-end gap-2'>
                                                <button
                                                    onClick={() =>
                                                        handleEditUser(user)
                                                    }
                                                    className='p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors duration-200'
                                                    title='Bearbeiten'
                                                >
                                                    <Pencil className='h-5 w-5' />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleResetPassword(
                                                            user._id,
                                                            user.username
                                                        )
                                                    }
                                                    className='p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors duration-200'
                                                    title='Passwort zurücksetzen'
                                                >
                                                    <Key className='h-5 w-5' />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user._id,
                                                            user.username
                                                        )
                                                    }
                                                    className='p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200'
                                                    title='Löschen'
                                                >
                                                    <Trash2 className='h-5 w-5' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className='flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent'
                        >
                            <ChevronLeft className='h-5 w-5' />
                            Vorherige
                        </button>
                        <span className='text-sm text-gray-600'>
                            Seite {currentPage} von {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className='flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent'
                        >
                            Nächste
                            <ChevronRight className='h-5 w-5' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
