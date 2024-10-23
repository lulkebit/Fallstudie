import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import NotificationCard from './NotificationCard';
import {
    LayoutDashboard,
    LogOut,
    Settings,
    User,
    Users,
    Target,
} from 'lucide-react';
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
            }
            localStorage.removeItem('token');
            window.location.href = '/login';
            addToast(data.message, 'success');
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const NavLink = ({ to, children, isMobile = false }) => {
        const isActive = location.pathname === to;

        if (isMobile) {
            return (
                <button
                    onClick={() => navigate(to)}
                    className={`p-2 rounded-lg transition-colors duration-200
                        ${
                            isActive
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    {children}
                </button>
            );
        }

        return (
            <button
                onClick={() => navigate(to)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200
                    ${
                        isActive
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
            >
                {children}
            </button>
        );
    };

    const ProfileDropdownItem = ({
        icon: Icon,
        children,
        onClick,
        className = '',
    }) => (
        <button
            onClick={onClick}
            className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-600
                     hover:bg-gray-50 transition-colors duration-200 ${className}`}
        >
            <Icon className='h-4 w-4' />
            {children}
        </button>
    );

    return (
        <nav className='bg-white border-b border-gray-100 fixed top-0 w-full z-40'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex justify-between h-16'>
                    <div className='flex items-center gap-8'>
                        <div className='flex-shrink-0'>
                            <img
                                src='/Logo.png'
                                alt='TrackMyGoal Logo'
                                className='h-12 w-auto cursor-pointer'
                                onClick={() => navigate('/dashboard')}
                            />
                        </div>
                        <div className='hidden lg:flex items-center gap-2'>
                            <NavLink to='/dashboard'>Dashboard</NavLink>
                            <NavLink to='/friends'>Freunde</NavLink>
                            <NavLink to='/globalgoals'>Globale Ziele</NavLink>
                            {user?.isAdmin && (
                                <NavLink to='/admin'>Admin Panel</NavLink>
                            )}
                        </div>
                    </div>

                    <div className='flex lg:hidden items-center gap-2'>
                        <NavLink to='/dashboard' isMobile>
                            <LayoutDashboard className='h-5 w-5' />
                        </NavLink>
                        <NavLink to='/friends' isMobile>
                            <Users className='h-5 w-5' />
                        </NavLink>
                        <NavLink to='/globalgoals' isMobile>
                            <Target className='h-5 w-5' />
                        </NavLink>
                    </div>

                    <div className='flex items-center gap-4'>
                        <NotificationCard />

                        <div
                            className='relative'
                            ref={profileRef}
                            onMouseEnter={() => setShowProfileCard(true)}
                            onMouseLeave={() => setShowProfileCard(false)}
                        >
                            <button
                                className='flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 
                                         transition-colors duration-200'
                            >
                                <img
                                    src={
                                        user?.avatar
                                            ? `data:image/jpeg;base64,${user.avatar}`
                                            : 'https://api.dicebear.com/6.x/initials/svg?seed=JD'
                                    }
                                    alt='Profile'
                                    className='h-8 w-8 rounded-lg object-cover'
                                />
                            </button>

                            <div className='absolute w-full h-4 bottom-0 left-0' />
                            {showProfileCard && user && (
                                <div className='absolute right-0 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
                                    <div className='absolute w-full h-4 -top-4 left-0' />

                                    <div className='p-4 border-b border-gray-100'>
                                        <p className='font-medium text-gray-900'>
                                            {user.firstname} {user.lastname}
                                        </p>
                                        <p className='text-sm text-gray-500 mt-0.5'>
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className='py-2'>
                                        <ProfileDropdownItem
                                            icon={User}
                                            onClick={() => navigate('/profile')}
                                        >
                                            Profil anzeigen
                                        </ProfileDropdownItem>
                                        <ProfileDropdownItem
                                            icon={Settings}
                                            onClick={() =>
                                                navigate('/settings')
                                            }
                                        >
                                            Einstellungen
                                        </ProfileDropdownItem>
                                        <ProfileDropdownItem
                                            icon={LogOut}
                                            onClick={handleLogout}
                                            className='text-red-600 hover:bg-red-50'
                                        >
                                            Abmelden
                                        </ProfileDropdownItem>
                                    </div>
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
