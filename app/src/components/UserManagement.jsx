import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import EditUserDialog from './dialogs/EditUserDialog';
import ResetPasswordDialog from './dialogs/ResetPasswordDialog';
import Loader from './Loader';
import { Pencil, Trash2, Key } from 'lucide-react';

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
        <div>
            <h2 className='text-2xl font-bold mb-4'>Benutzer Verwaltung</h2>
            <div className='mb-4'>
                <input
                    type='text'
                    placeholder='Suche nach Benutzern...'
                    value={searchTerm}
                    onChange={handleSearch}
                    className='p-2 border rounded'
                />
            </div>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {users.length === 0 ? (
                        <p>Keine Nutzer gefunden.</p>
                    ) : (
                        <>
                            <table className='min-w-full bg-white'>
                                <thead>
                                    <tr>
                                        <th className='py-2 px-4 border-b'>
                                            Avatar
                                        </th>
                                        <th className='py-2 px-4 border-b'>
                                            Username
                                        </th>
                                        <th className='py-2 px-4 border-b'>
                                            Vorname
                                        </th>
                                        <th className='py-2 px-4 border-b'>
                                            Nachname
                                        </th>
                                        <th className='py-2 px-4 border-b'>
                                            Email
                                        </th>
                                        <th className='py-2 px-4 border-b'>
                                            Aktionen
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td className='py-2 px-4 border-b'>
                                                <img
                                                    src={`data:image/jpeg;base64,${user.avatar}`}
                                                    alt='Avatar'
                                                    className='w-10 h-10 rounded-full'
                                                />
                                            </td>
                                            <td className='py-2 px-4 border-b'>
                                                {user.username}
                                            </td>
                                            <td className='py-2 px-4 border-b'>
                                                {user.firstname}
                                            </td>
                                            <td className='py-2 px-4 border-b'>
                                                {user.lastname}
                                            </td>
                                            <td className='py-2 px-4 border-b'>
                                                {user.email}
                                            </td>
                                            <td className='py-2 px-4 border-b'>
                                                <div className='flex justify-center space-x-2'>
                                                    <button
                                                        onClick={() =>
                                                            handleEditUser(user)
                                                        }
                                                        className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
                                                        title='Bearbeiten'
                                                    >
                                                        <Pencil className='h-5 w-5 text-blue-500' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user._id,
                                                                user.username
                                                            )
                                                        }
                                                        className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
                                                        title='Löschen'
                                                    >
                                                        <Trash2 className='h-5 w-5 text-red-500' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleResetPassword(
                                                                user._id,
                                                                user.username
                                                            )
                                                        }
                                                        className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
                                                        title='Passwort zurücksetzen'
                                                    >
                                                        <Key className='h-5 w-5 text-green-500' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='mt-4 flex justify-between items-center'>
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
                                >
                                    Vorherige
                                </button>
                                <span>
                                    Seite {currentPage} von {totalPages}
                                </span>
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
                                >
                                    Nächste
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default UserManagement;
