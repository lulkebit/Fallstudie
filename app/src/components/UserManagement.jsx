import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import EditUserDialog from './dialogs/EditUserDialog';
import ResetPasswordDialog from './dialogs/ResetPasswordDialog';
import {
    Users,
    Pencil,
    Trash2,
    Key,
    Search,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Mail,
    UserCheck,
    Shield,
    Loader2,
    AlertTriangle,
} from 'lucide-react';

const UserMetric = ({ title, value, change, icon: Icon }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
        <div className='flex items-center gap-4'>
            <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center flex-shrink-0'>
                <Icon className='h-6 w-6 text-white' />
            </div>
            <div>
                <h3 className='text-sm text-gray-500 dark:text-white/60'>
                    {title}
                </h3>
                <div className='flex items-baseline gap-2'>
                    <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {value}
                    </span>
                    {change && (
                        <span className='text-sm font-medium text-green-500'>
                            +{change}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const UserCard = ({ user, onEdit, onDelete, onResetPassword }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
        <div className='flex items-center gap-4'>
            {user.avatar ? (
                <img
                    src={`data:image/jpeg;base64,${user.avatar}`}
                    alt={user.username}
                    className='w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-gray-800'
                />
            ) : (
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center text-white text-lg font-medium'>
                    {user.username[0].toUpperCase()}
                </div>
            )}
            <div className='flex-1'>
                <div className='flex items-center gap-2'>
                    <h3 className='font-medium text-gray-900 dark:text-white'>
                        {user.username}
                    </h3>
                    {user.isAdmin && (
                        <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-[#4785FF]/10 text-[#4785FF] dark:bg-[#4785FF]/20'>
                            Admin
                        </span>
                    )}
                </div>
                <p className='text-sm text-gray-500 dark:text-white/60'>
                    {user.firstname} {user.lastname}
                </p>
                <div className='flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-white/60'>
                    <Mail className='w-4 h-4' />
                    {user.email}
                </div>
            </div>

            <div className='flex gap-2'>
                <button
                    onClick={() => onEdit(user)}
                    className='p-2 rounded-xl hover:bg-[#4785FF]/10 text-[#4785FF] dark:text-white/70 dark:hover:bg-white/5 transition-colors duration-200'
                    title='Bearbeiten'
                >
                    <Pencil className='h-5 w-5' />
                </button>
                <button
                    onClick={() => onResetPassword(user._id, user.username)}
                    className='p-2 rounded-xl hover:bg-[#8c52ff]/10 text-[#8c52ff] dark:text-white/70 dark:hover:bg-white/5 transition-colors duration-200'
                    title='Passwort zurücksetzen'
                >
                    <Key className='h-5 w-5' />
                </button>
                <button
                    onClick={() => onDelete(user._id, user.username)}
                    className='p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors duration-200'
                    title='Löschen'
                >
                    <Trash2 className='h-5 w-5' />
                </button>
            </div>
        </div>
    </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className='flex items-center justify-center gap-4 mt-8'>
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='flex items-center gap-2 px-4 py-2 rounded-xl font-medium
               text-gray-700 dark:text-white/70 
               hover:bg-gray-100 dark:hover:bg-white/5
               border border-gray-200 dark:border-white/10
               transition-all duration-200 disabled:opacity-50'
        >
            <ChevronLeft className='w-5 h-5' />
            Vorherige
        </button>
        <span className='text-sm font-medium text-gray-600 dark:text-white/70'>
            Seite {currentPage} von {totalPages}
        </span>
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='flex items-center gap-2 px-4 py-2 rounded-xl font-medium
               text-gray-700 dark:text-white/70 
               hover:bg-gray-100 dark:hover:bg-white/5
               border border-gray-200 dark:border-white/10
               transition-all duration-200 disabled:opacity-50'
        >
            Nächste
            <ChevronRight className='w-5 h-5' />
        </button>
    </div>
);

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
                title: 'Löschen bestätigen',
                message: `Sind Sie sicher, dass Sie den Benutzer "${username}" löschen möchten?`,
                variant: 'danger',
                confirmText: 'Löschen',
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
        <div className='space-y-8'>
            {/* Metrics Grid */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <UserMetric
                    title='Gesamtnutzer'
                    value={users.length}
                    icon={Users}
                    change={12}
                />
                <UserMetric
                    title='Aktive Nutzer'
                    value={users.filter((u) => u.isActive).length}
                    icon={UserCheck}
                />
                <UserMetric
                    title='Administratoren'
                    value={users.filter((u) => u.isAdmin).length}
                    icon={Shield}
                />
                <UserMetric
                    title='Neue Nutzer'
                    value={
                        users.filter((u) => {
                            const oneWeekAgo = new Date();
                            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                            return new Date(u.createdAt) > oneWeekAgo;
                        }).length
                    }
                    icon={UserPlus}
                    change={8}
                />
            </div>

            {/* Search and Actions */}
            <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                <div className='flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/40 w-5 h-5' />
                        <input
                            type='text'
                            placeholder='Benutzer suchen...'
                            value={searchTerm}
                            onChange={handleSearch}
                            className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 
                      border border-gray-200 dark:border-white/10
                      focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 
                      transition-all duration-200 outline-none
                      text-gray-900 dark:text-white
                      placeholder:text-gray-400 dark:placeholder:text-white/40'
                        />
                    </div>
                </div>
            </div>

            {/* Users List */}
            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <div className='flex flex-col items-center gap-4'>
                        <Loader2 className='w-8 h-8 text-[#4785FF] animate-spin' />
                        <p className='text-gray-500 dark:text-white/60'>
                            Benutzer werden geladen...
                        </p>
                    </div>
                </div>
            ) : users.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center opacity-50'>
                        <Users className='w-8 h-8 text-white' />
                    </div>
                    <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
                        Keine Benutzer gefunden
                    </h3>
                    <p className='text-gray-500 dark:text-white/60'>
                        {searchTerm
                            ? 'Versuche es mit anderen Suchbegriffen'
                            : 'Erstelle deinen ersten Benutzer'}
                    </p>
                </div>
            ) : (
                <>
                    <div className='space-y-4'>
                        {users.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                onResetPassword={handleResetPassword}
                            />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default UserManagement;
