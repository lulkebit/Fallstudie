import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import {
    Bell,
    ChevronDown,
    Check,
    Clock,
    Inbox,
    CheckCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const NotificationCard = ({ notification, onMarkAsRead }) => {
    const navigate = useNavigate();
    const formattedDate = new Date(notification.createdAt).toLocaleString(
        'de-DE',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
    );

    const handleClick = () => {
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-xl 
                border border-gray-200/50 dark:border-white/10 
                hover:shadow-lg transition-all duration-300 hover:-translate-y-1 
                overflow-hidden cursor-pointer
                ${notification.read ? 'opacity-75' : ''}
            `}
        >
            <div className='p-5'>
                <div className='flex justify-between items-start gap-4 mb-3'>
                    <div className='flex items-center gap-3'>
                        <div
                            className={`
                            w-12 h-12 rounded-xl flex items-center justify-center relative
                            ${
                                notification.read
                                    ? 'bg-gray-100/50 dark:bg-white/5'
                                    : 'bg-gradient-to-br from-[#4785FF] to-[#8c52ff]'
                            }
                        `}
                        >
                            <Bell
                                className={`w-6 h-6 ${
                                    notification.read
                                        ? 'text-gray-400 dark:text-white/40'
                                        : 'text-white'
                                }`}
                            />
                            {!notification.read && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsRead(notification._id);
                                    }}
                                    className='absolute -top-2 -right-2 p-1.5 rounded-full bg-white 
                                             text-[#4785FF] hover:bg-gray-50 transition-colors duration-200
                                             shadow-lg'
                                    aria-label='Als gelesen markieren'
                                >
                                    <Check className='w-3 h-3' />
                                </button>
                            )}
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-900 dark:text-white'>
                                {notification.title}
                            </h3>
                            <span className='text-xs text-gray-500 dark:text-white/60 flex items-center gap-1.5'>
                                <Clock className='w-3.5 h-3.5' />
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>

                <p
                    className='text-gray-600 dark:text-white/70 text-sm bg-gray-50/50 dark:bg-white/5 
                          p-3 rounded-lg'
                >
                    {notification.message}
                </p>
            </div>
        </div>
    );
};

const LoadMoreButton = ({ onClick, loading, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`
            px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2
            transition-all duration-200
            ${
                disabled || loading
                    ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 cursor-not-allowed'
                    : 'bg-gradient-to-br from-[#4785FF] to-[#8c52ff] text-white hover:shadow-lg hover:-translate-y-1'
            }
        `}
    >
        {loading ? (
            <Loader />
        ) : (
            <>
                Mehr anzeigen
                <ChevronDown className='w-5 h-5' />
            </>
        )}
    </button>
);

const Notifications = () => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [page, user]);

    useEffect(() => {
        setHasUnread(notifications.some((notification) => !notification.read));
    }, [notifications]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/notifications/all/${user._id}?page=${page}&limit=10`
            );
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                ...response.data.notifications,
            ]);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            addToast('Error fetching notifications: ' + error, 'error');
            setLoading(false);
        }
    };

    const loadMoreNotifications = () => {
        if (page < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/notifications/${id}/read`);
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) =>
                    notif._id === id ? { ...notif, read: true } : notif
                )
            );
            addToast('Benachrichtigung als gelesen markiert.', 'success');
        } catch (error) {
            addToast(
                'Fehler beim Markieren der Benachrichtigung: ' + error,
                'error'
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch(`/notifications/${user._id}/read-all`);
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) => ({ ...notif, read: true }))
            );
            addToast(
                'Alle Benachrichtigungen als gelesen markiert.',
                'success'
            );
        } catch (error) {
            addToast(
                'Fehler beim Markieren aller Benachrichtigungen: ' + error,
                'error'
            );
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            <Navbar />

            {/* Decorative Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div className='container mx-auto px-4 py-8 relative z-10 pt-24'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <div className='flex items-center justify-center gap-4 mb-4'>
                        <div className='h-16 w-16 rounded-2xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center flex-shrink-0'>
                            <Bell className='h-8 w-8 text-white' />
                        </div>
                        <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                            Benachrichtigungen
                        </h1>
                    </div>
                    <p className='text-lg text-gray-600 dark:text-white/70'>
                        Bleibe auf dem Laufenden mit deinen Updates
                    </p>
                </div>

                <div className='max-w-3xl mx-auto'>
                    <div
                        className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl 
                                  border border-gray-200/50 dark:border-white/10 shadow-xl 
                                  dark:shadow-none overflow-hidden p-6'
                    >
                        <div className='flex items-center justify-between mb-6'>
                            {hasUnread && (
                                <button
                                    onClick={markAllAsRead}
                                    className='flex items-center gap-2 px-4 py-2 
                                             bg-gradient-to-br from-[#4785FF]/10 to-[#8c52ff]/10 
                                             text-[#4785FF] dark:text-white
                                             rounded-lg hover:from-[#4785FF]/20 hover:to-[#8c52ff]/20 
                                             transition-all duration-200'
                                >
                                    <CheckCheck className='w-5 h-5' />
                                    Alle als gelesen markieren
                                </button>
                            )}
                        </div>

                        {loading && notifications.length === 0 ? (
                            <div className='flex items-center justify-center py-12'>
                                <Loader />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className='text-center py-12'>
                                <Inbox className='w-12 h-12 text-gray-400 dark:text-white/40 mx-auto mb-3' />
                                <p className='text-gray-500 dark:text-white/70 text-lg'>
                                    Keine Benachrichtigungen vorhanden
                                </p>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                {notifications.map((notification) => (
                                    <NotificationCard
                                        key={notification._id}
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                    />
                                ))}

                                {page < totalPages && (
                                    <div className='flex justify-center mt-6'>
                                        <LoadMoreButton
                                            onClick={loadMoreNotifications}
                                            loading={loading}
                                            disabled={page >= totalPages}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
