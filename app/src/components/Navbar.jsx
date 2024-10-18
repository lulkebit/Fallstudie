import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import NotificationCard from './NotificationCard';
import { LayoutDashboard, LogOut, Settings, User, Users } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const Navbar = () => {
    const [showProfileCard, setShowProfileCard] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowProfileCard(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const { data } = await axios.post('/logout');

            if (data.error) {
                return addToast(data.error, 'error');
            } else {
                localStorage.removeItem('token');
                window.location.href = '/login';
                addToast(data.message, 'success');
            }
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const getNavItemClass = (path) => {
        const baseClass =
            'flex items-center px-1 pt-1 border-b-2 text-sm font-medium';
        return location.pathname === path
            ? `${baseClass} border-[#8c52ff] text-gray-900`
            : `${baseClass} border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700`;
    };

    const getMobileNavItemClass = (path) => {
        return location.pathname === path
            ? 'text-[#8c52ff]'
            : 'text-gray-500 hover:text-gray-700';
    };

    return (
        <nav className='bg-white shadow-md relative z-10'>
            <div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-8'>
                <div className='flex justify-between h-16'>
                    <div className='flex px-2 lg:px-0'>
                        <div className='flex-shrink-0 flex items-center'>
                            <img
                                src='/Logo.png'
                                alt='TrackMyGoal Logo'
                                className='h-12 w-auto'
                            />
                        </div>
                        <div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
                            <button
                                onClick={() => navigate('/Dashboard')}
                                className={getNavItemClass('/Dashboard')}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/friends')}
                                className={getNavItemClass('/friends')}
                            >
                                Freunde
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center space-x-4 lg:hidden'>
                        <button
                            onClick={() => navigate('/Dashboard')}
                            className={`p-1 rounded-full ${getMobileNavItemClass(
                                '/Dashboard'
                            )}`}
                            aria-label='Dashboard'
                        >
                            <LayoutDashboard className='h-6 w-6' />
                        </button>
                        <button
                            onClick={() => navigate('/friends')}
                            className={`p-1 rounded-full ${getMobileNavItemClass(
                                '/friends'
                            )}`}
                            aria-label='Freunde'
                        >
                            <Users className='h-6 w-6' />
                        </button>
                    </div>
                    <div className='flex items-center'>
                        <NotificationCard />
                        <div
                            className='ml-3 relative'
                            ref={profileRef}
                            onMouseEnter={() => setShowProfileCard(true)}
                            onMouseLeave={() => setShowProfileCard(false)}
                        >
                            <div>
                                <button
                                    type='button'
                                    className='bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8c52ff]'
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
                                        className='inline-flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                    >
                                        <User className='mr-3 h-5 w-5' />
                                        Profil anzeigen
                                    </button>
                                    <a
                                        href='#settings'
                                        className='inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                    >
                                        <Settings className='mr-3 h-5 w-5' />
                                        Einstellungen
                                    </a>
                                    <a
                                        onClick={handleLogout}
                                        className='inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                                    >
                                        <LogOut className='mr-3 h-5 w-5' />
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
