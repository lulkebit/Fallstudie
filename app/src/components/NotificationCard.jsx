import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import {
    Bell,
    CheckCircle,
    ChevronRight,
    CheckCheck,
    UserPlus,
    UserCheck,
    UserX,
    UserMinus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (title) => {
    switch (title) {
        case 'Freundschaftsanfrage':
            return <UserPlus className='h-5 w-5 text-[#4785FF]' />;
        case 'Freundschaftsanfrage akzeptiert':
            return <UserCheck className='h-5 w-5 text-green-500' />;
        case 'Freundschaftsanfrage abgelehnt':
            return <UserX className='h-5 w-5 text-red-500' />;
        case 'Freundschaft beendet':
            return (
                <UserMinus className='h-5 w-5 text-gray-400 dark:text-white/40' />
            );
        default:
            return (
                <Bell className='h-5 w-5 text-gray-400 dark:text-white/40' />
            );
    }
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (notification.link) {
            navigate(notification.link);
            onMarkAsRead(notification._id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className='group flex items-start gap-4 p-4 hover:bg-white dark:hover:bg-white/5 
                     transition-all duration-200 cursor-pointer'
        >
            <div className='flex-shrink-0'>
                {getNotificationIcon(notification.title)}
            </div>
            <div className='flex-1 min-w-0 space-y-1.5'>
                <p className='text-sm font-medium text-gray-900 dark:text-white line-clamp-1'>
                    {notification.title}
                </p>
                <p className='text-sm text-gray-600 dark:text-white/70 line-clamp-2'>
                    {notification.message}
                </p>
                <p className='text-xs text-gray-400 dark:text-white/40'>
                    {notification.formattedDate}
                </p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification._id);
                }}
                className='p-1.5 rounded-xl text-[#4785FF] opacity-0 group-hover:opacity-100 
                         hover:bg-[#4785FF]/10 transition-all duration-200'
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
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
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
            addToast(
                'Fehler beim Markieren der Benachrichtigung: ' + error,
                'error'
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch(`/notifications/${user._id}/read-all`);
            fetchNotifications();
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
        <div className='relative' ref={cardRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='relative p-2 text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5
                         rounded-xl transition-all duration-200'
                aria-label='Toggle notifications'
            >
                <Bell className='h-5 w-5' />
                {notifications.length > 0 && (
                    <span
                        className='absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5
                                   text-xs font-bold text-white bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                   rounded-full shadow-lg transform -translate-y-1 translate-x-1'
                    >
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    className='absolute right-0 mt-2 w-96 bg-gray-50 dark:bg-gray-800
                              border border-gray-200/50 dark:border-white/10 rounded-2xl 
                              shadow-xl'
                >
                    <div
                        className='px-6 py-4 border-b border-gray-200 dark:border-white/10 
                                  flex items-center justify-between'
                    >
                        <h3 className='font-medium text-gray-900 dark:text-white'>
                            Benachrichtigungen
                        </h3>
                        {notifications.length > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className='flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium 
                                         text-[#4785FF] hover:bg-[#4785FF]/10 rounded-xl 
                                         transition-all duration-200'
                            >
                                <CheckCheck className='h-3.5 w-3.5' />
                                Alle lesen
                            </button>
                        )}
                    </div>

                    <div className='max-h-[420px] overflow-y-auto'>
                        {notifications.length > 0 ? (
                            <div className='divide-y divide-gray-200 dark:divide-white/10'>
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification._id}
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='py-16 px-4 text-center'>
                                <Bell className='mx-auto h-6 w-6 text-gray-400 dark:text-white/40 mb-3' />
                                <p className='text-gray-500 dark:text-white/60 text-sm'>
                                    Keine neuen Benachrichtigungen
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='px-4 py-3 border-t border-gray-200 dark:border-white/10'>
                        <button
                            onClick={() => navigate('/notifications')}
                            className='w-full px-4 py-2 flex items-center justify-center gap-2 text-sm 
                                     text-gray-600 dark:text-white/70 hover:bg-white dark:hover:bg-white/5 
                                     rounded-xl transition-all duration-200'
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
