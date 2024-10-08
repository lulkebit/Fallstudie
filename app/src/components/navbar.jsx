import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/toastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Navbar = () => {
    const [showProfileCard, setShowProfileCard] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const profileRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowProfileCard(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileRef]);

    const handleLogout = async () => {
        try {
            const { data } = await axios.post('/logout');

            if (data.error) {
                return addToast(data.error, 'error');
            } else {
                localStorage.removeItem('token');
                navigate('/login');
                addToast(data.message, 'success');
            }
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const getNavItemClass = (path) => {
        const baseClass =
            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium';
        return location.pathname === path
            ? `${baseClass} border-indigo-500 text-gray-900`
            : `${baseClass} border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700`;
    };

    return (
        <nav className='bg-white shadow-md relative z-10'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16'>
                    <div className='flex'>
                        <div className='flex-shrink-0 flex items-center'>
                            <span className='text-2xl font-bold text-indigo-600'>
                                TrackMyGoal
                            </span>
                        </div>
                        <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className={getNavItemClass('/dashboard')}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/friends')}
                                className={getNavItemClass('/friends')}
                            >
                                Freunde
                            </button>
                            <a
                                href='#'
                                className={getNavItemClass('/notifications')}
                            >
                                Benachrichtigungen
                            </a>
                        </div>
                    </div>
                    <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                        <div
                            className='ml-3 relative'
                            ref={profileRef}
                            onMouseEnter={() => setShowProfileCard(true)}
                            onMouseLeave={() => setShowProfileCard(false)}
                        >
                            <div>
                                <button
                                    type='button'
                                    className='bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    id='user-menu-button'
                                    aria-expanded='false'
                                    aria-haspopup='true'
                                >
                                    <span className='sr-only'>
                                        Open user menu
                                    </span>
                                    {user && user.avatar ? (
                                        <img
                                            src={`data:image/jpeg;base64,${user.avatar}`}
                                            alt={`${user.firstname} ${user.lastname}`}
                                            className='h-10 w-10 rounded-full'
                                        />
                                    ) : (
                                        <img
                                            className='h-8 w-8 rounded-full'
                                            src='https://api.dicebear.com/6.x/initials/svg?seed=JD'
                                            alt=''
                                        />
                                    )}
                                </button>
                            </div>
                            <div className='absolute w-full h-4 bottom-0 left-0' />
                            {showProfileCard && user && (
                                <div className='absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
                                    <div className='absolute w-full h-4 -top-4 left-0' />
                                    <div className='px-4 py-2'>
                                        <p className='text-sm font-medium text-gray-900'>
                                            {user.firstname} {user.lastname}
                                        </p>
                                        <p className='text-sm text-gray-500'>
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                    >
                                        Profil anzeigen
                                    </button>
                                    <a
                                        href='#settings'
                                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                    >
                                        Einstellungen
                                    </a>
                                    <a
                                        onClick={handleLogout}
                                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                                    >
                                        Abmelden
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
