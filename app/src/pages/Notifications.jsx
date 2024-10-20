import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Bell, ChevronDown, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Waves from '../components/Waves';

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
            <div className='min-h-screen bg-gray-100 pt-24'>
                <Waves />
                <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
                    <div className='max-w-3xl mx-auto'>
                        <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center'>
                            <Bell className='mr-2' /> Benachrichtigungen
                        </h2>
                        <div className='space-y-4'>
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`bg-white rounded-lg shadow-md p-4 sm:p-6 transition duration-300 ease-in-out hover:shadow-lg ${
                                        notification.read ? 'bg-gray-50' : ''
                                    }`}
                                >
                                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2'>
                                        <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0'>
                                            {notification.title}
                                        </h3>
                                        <div className='flex space-x-2'>
                                            {!notification.read && (
                                                <button
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification._id
                                                        )
                                                    }
                                                    className='text-green-500 hover:text-green-600'
                                                    title='Mark as read'
                                                >
                                                    <Check size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className='text-gray-600 mb-4'>
                                        {notification.message}
                                    </p>
                                    <p className='text-gray-400 text-sm'>
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className='text-center mt-8'>
                            <button
                                onClick={loadMoreNotifications}
                                className={`mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md transition duration-300 flex items-center justify-center mx-auto ${
                                    loading || page >= totalPages
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                                disabled={loading || page >= totalPages}
                            >
                                {loading ? (
                                    <span className='flex items-center'>
                                        <svg
                                            className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                        >
                                            <circle
                                                className='opacity-25'
                                                cx='12'
                                                cy='12'
                                                r='10'
                                                stroke='currentColor'
                                                strokeWidth='4'
                                            ></circle>
                                            <path
                                                className='opacity-75'
                                                fill='currentColor'
                                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                            ></path>
                                        </svg>
                                        Lädt...
                                    </span>
                                ) : (
                                    <span className='flex items-center'>
                                        Mehr anzeigen
                                        <ChevronDown
                                            className='ml-2'
                                            size={20}
                                        />
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notifications;
