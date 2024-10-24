import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Bell, ChevronDown, Check, Clock, Inbox } from 'lucide-react';
import Navbar from '../components/Navbar';
import Waves from '../components/Waves';
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
            bg-white rounded-xl border border-gray-100 hover:shadow-md 
            transition-all duration-200 overflow-hidden cursor-pointer
            ${notification.read ? 'bg-gray-50' : ''}
        `}
        >
            <div className='p-5'>
                <div className='flex justify-between items-start gap-4 mb-3'>
                    <div className='flex items-center gap-3'>
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center relative
                            ${
                                notification.read ? 'bg-gray-100' : 'bg-blue-50'
                            }`}
                        >
                            <Bell
                                className={`w-5 h-5 ${
                                    notification.read
                                        ? 'text-gray-400'
                                        : 'text-blue-500'
                                }`}
                            />
                            {!notification.read && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsRead(notification._id);
                                    }}
                                    className='absolute -top-2 -right-2 p-1 rounded-full bg-blue-50 
                                             text-blue-600 hover:bg-blue-100 transition-colors duration-200'
                                    aria-label='Als gelesen markieren'
                                >
                                    <Check className='w-3 h-3' />
                                </button>
                            )}
                        </div>
                        <div>
                            <h3 className='font-bold text-gray-900'>
                                {notification.title}
                            </h3>
                            <span className='text-xs text-gray-400 flex items-center gap-1.5'>
                                <Clock className='w-3.5 h-3.5' />
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>

                <p className='text-gray-600 text-sm bg-gray-50 p-3 rounded-lg'>
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
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:scale-105'
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

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [page, user]);

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
            addToast('Notification marked as read.', 'success');
        } catch (error) {
            addToast('Error marking notification as read: ' + error, 'error');
        }
    };

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-16'>
                <Waves />
                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <div className='max-w-3xl mx-auto'>
                        <div className='flex items-center gap-3 mb-8'>
                            <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center'>
                                <Bell className='w-6 h-6 text-blue-600' />
                            </div>
                            <h1 className='text-2xl font-bold text-gray-800'>
                                Benachrichtigungen
                            </h1>
                        </div>

                        {loading && notifications.length === 0 ? (
                            <div className='flex items-center justify-center py-12'>
                                <Loader />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className='text-center py-12'>
                                <Inbox className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                                <p className='text-gray-500 text-lg'>
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
        </>
    );
};

export default Notifications;
