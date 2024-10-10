import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import { useToast } from '../context/toastContext';
import { Bell, CheckCircle } from 'lucide-react';

const NotificationCard = () => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        fetchNotifications();

        const intervalId = setInterval(fetchNotifications, 100);

        return () => clearInterval(intervalId);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`/notifications/${user._id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`/notifications/${notificationId}/read`);
            fetchNotifications();
            addToast('Benachrichtigung als gelesen markiert.', 'success');
        } catch (error) {
            addToast('Error marking notification as read: ' + error, 'error');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    return (
        <div
            className='relative'
            ref={cardRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className='relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full'
                aria-label='Toggle notifications'
            >
                <Bell className='h-6 w-6' />
                {notifications.length > 0 && (
                    <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full'>
                        {notifications.length}
                    </span>
                )}
            </button>
            <div className='absolute w-full h-4 bottom-0 left-0' />
            {isOpen && (
                <div className='absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                    <div className='absolute w-full h-4 -top-4 left-0' />
                    <div className='p-4'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-lg font-semibold text-gray-900'>
                                Benachrichtigungen
                            </h3>
                        </div>
                        {notifications.length > 0 ? (
                            <ul className='space-y-2 max-h-60 overflow-y-auto'>
                                {notifications.map((notification) => (
                                    <li
                                        key={notification._id}
                                        className='bg-gray-50 rounded-md p-3'
                                    >
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h4 className='text-sm font-medium text-gray-900'>
                                                    {notification.title}
                                                </h4>
                                                <p className='mt-1 text-sm text-gray-600'>
                                                    {notification.message}
                                                </p>
                                                <p className='mt-1 text-xs text-gray-500'>
                                                    {formatDate(
                                                        new Date(
                                                            notification.createdAt
                                                        )
                                                    )}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    markAsRead(notification._id)
                                                }
                                                className='ml-2 text-indigo-600 hover:text-indigo-800'
                                                aria-label='Mark as read'
                                            >
                                                <CheckCircle className='h-5 w-5' />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className='text-gray-500 text-center py-4'>
                                Keine Benachrichtigungen
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCard;
