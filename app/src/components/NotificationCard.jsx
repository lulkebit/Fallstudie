import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Bell, CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkAsRead }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (notification.link) {
            navigate(notification.link);
            if (!notification.read) {
                onMarkAsRead(notification._id);
            }
        }
    };

    return (
        <div
            onClick={handleClick}
            className='group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer'
        >
            <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 line-clamp-1'>
                    {notification.title}
                </p>
                <p className='mt-1 text-sm text-gray-600 line-clamp-2'>
                    {notification.message}
                </p>
                <p className='mt-1.5 text-xs text-gray-400'>
                    {notification.formattedDate}
                </p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification._id);
                }}
                className='p-1 rounded-lg text-blue-500 opacity-0 group-hover:opacity-100 
                         hover:bg-blue-50 transition-all duration-200'
                aria-label='Als gelesen markieren'
            >
                <CheckCircle className='h-4 w-4' />
            </button>
        </div>
    );
};

const NotificationCard = () => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const cardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();

        const intervalId = setInterval(fetchNotifications, 1000);

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
                <Bell className='h-5 w-5' />
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
                    <div className='p-4 border-b border-gray-100'>
                        <h3 className='font-medium text-gray-900'>
                            Benachrichtigungen
                        </h3>
                    </div>

                    <div className='max-h-[360px] overflow-y-auto'>
                        {notifications.length > 0 ? (
                            <div className='p-2'>
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification._id}
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='py-12 px-4 text-center'>
                                <Bell className='mx-auto h-6 w-6 text-gray-400 mb-2' />
                                <p className='text-gray-500 text-sm'>
                                    Keine neuen Benachrichtigungen
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='p-2 border-t border-gray-100'>
                        <button
                            onClick={() => navigate('/notifications')}
                            className='w-full p-2 flex items-center justify-center gap-2 text-sm 
                                         text-gray-600 hover:bg-gray-50 rounded-lg 
                                         transition-colors duration-200'
                        >
                            Alle anzeigen
                            <ChevronRight className='h-4 w-4' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCard;
