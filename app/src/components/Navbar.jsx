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
    Menu,
    X,
    Sun,
    Moon,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const profileRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
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

    const NavLink = ({ to, children, icon: Icon }) => {
        const isActive = location.pathname === to;

        return (
            <button
                onClick={() => navigate(to)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200 hover:-translate-y-0.5
                    ${
                        isActive
                            ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-md'
                            : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
            >
                {Icon && <Icon className='h-4 w-4' />}
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
            className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm 
                     text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 
                     transition-all duration-200 ${className}`}
        >
            <Icon className='h-4 w-4' />
            {children}
        </button>
    );

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 
            ${
                isScrolled
                    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10'
                    : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg'
            }`}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-20 items-center'>
                    {/* Logo */}
                    <div className='flex items-center gap-3'>
                        <div
                            className='h-10 w-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] 
                                      flex items-center justify-center cursor-pointer'
                            onClick={() => navigate('/dashboard')}
                        >
                            <svg
                                className='w-6 h-6 text-white'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M13 10V3L4 14h7v7l9-11h-7z'
                                />
                            </svg>
                        </div>
                        <span
                            className='text-xl font-bold text-transparent bg-clip-text 
                                       bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'
                        >
                            TrackMyGoal
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden lg:flex items-center gap-4'>
                        <NavLink to='/dashboard' icon={LayoutDashboard}>
                            Dashboard
                        </NavLink>
                        <NavLink to='/friends' icon={Users}>
                            Freunde
                        </NavLink>
                        <NavLink to='/globalgoals' icon={Target}>
                            Globale Ziele
                        </NavLink>
                        {user?.isAdmin && (
                            <NavLink to='/admin' icon={Settings}>
                                Admin Panel
                            </NavLink>
                        )}
                    </div>

                    {/* Desktop Actions */}
                    <div className='hidden lg:flex items-center gap-4'>
                        <button
                            onClick={toggleTheme}
                            className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200 text-sm font-medium'
                        >
                            {isDarkMode ? <Sun /> : <Moon />}
                        </button>

                        <NotificationCard />

                        <div className='relative' ref={profileRef}>
                            <button
                                onClick={() =>
                                    setShowProfileCard(!showProfileCard)
                                }
                                className='flex items-center gap-2 p-1.5 rounded-xl 
                                         hover:bg-gray-100 dark:hover:bg-white/5
                                         transition-all duration-200'
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

                            {showProfileCard && (
                                <div
                                    className='absolute right-0 w-64 mt-2 origin-top-right bg-white/70 dark:bg-white/5 
                                              backdrop-blur-xl rounded-xl shadow-lg py-1 
                                              border border-gray-200/50 dark:border-white/10'
                                >
                                    <div className='p-4 border-b border-gray-200 dark:border-white/10'>
                                        <p className='font-medium text-gray-900 dark:text-white'>
                                            {user.firstname} {user.lastname}
                                        </p>
                                        <p className='text-sm text-gray-500 dark:text-white/60 mt-0.5'>
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
                                            className='text-red-600 dark:text-red-500 
                                                     hover:bg-red-50 dark:hover:bg-red-500/10'
                                        >
                                            Abmelden
                                        </ProfileDropdownItem>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className='lg:hidden flex items-center gap-4'>
                        <NotificationCard />

                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className='text-gray-600 dark:text-white/70 hover:text-gray-900 
                                     dark:hover:text-white transition-colors duration-200'
                        >
                            {isMobileMenuOpen ? (
                                <X className='w-6 h-6' />
                            ) : (
                                <Menu className='w-6 h-6' />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            >
                <div
                    className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl 
                              border-t border-gray-200 dark:border-white/10'
                >
                    <div className='px-4 pt-2 pb-6 space-y-4'>
                        <NavLink to='/dashboard' icon={LayoutDashboard}>
                            Dashboard
                        </NavLink>
                        <NavLink to='/friends' icon={Users}>
                            Freunde
                        </NavLink>
                        <NavLink to='/globalgoals' icon={Target}>
                            Globale Ziele
                        </NavLink>
                        {user?.isAdmin && (
                            <NavLink to='/admin' icon={Settings}>
                                Admin Panel
                            </NavLink>
                        )}

                        <div className='pt-4 border-t border-gray-200 dark:border-white/10'>
                            <ProfileDropdownItem
                                icon={User}
                                onClick={() => navigate('/profile')}
                            >
                                Profil anzeigen
                            </ProfileDropdownItem>
                            <ProfileDropdownItem
                                icon={Settings}
                                onClick={() => navigate('/settings')}
                            >
                                Einstellungen
                            </ProfileDropdownItem>
                            <ProfileDropdownItem
                                icon={LogOut}
                                onClick={handleLogout}
                                className='text-red-600 dark:text-red-500'
                            >
                                Abmelden
                            </ProfileDropdownItem>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
