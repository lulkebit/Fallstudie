import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useToast } from '../context/toastContext';
import { useNavigate } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { UserContext } from '../context/userContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { addToast } = useToast();

    const toggleProfileCard = () => {
        setShowProfileCard(!showProfileCard);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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

    return (
        <div className='p-4'>
            <nav className='bg-gradient-to-r from-blue-300 to-red-300 rounded-lg shadow-lg'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        <div className='flex-shrink-0'>
                            <span className='text-white text-xl font-bold'>
                                TrackMyGoal
                            </span>
                        </div>
                        <div className='hidden md:flex items-center justify-center flex-grow'>
                            <div className='flex items-baseline space-x-4'>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className='text-white hover:bg-white hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300'
                                >
                                    Dashboard
                                </button>
                                <a
                                    href='#'
                                    className='text-white hover:bg-white hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300'
                                >
                                    Freunde
                                </a>
                                <a
                                    href='#'
                                    className='text-white hover:bg-white hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300'
                                >
                                    Benachrichtigungen
                                </a>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <div
                                className='relative'
                                onMouseEnter={() => setShowProfileCard(true)}
                                onMouseLeave={() => setShowProfileCard(false)}
                            >
                                <button
                                    onClick={toggleProfileCard}
                                    className='flex items-center justify-center w-10 h-10 rounded-full bg-white text-purple-600 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-600 focus:ring-white transition duration-300'
                                >
                                    {user && user.avatar ? (
                                        <img
                                            src={`data:image/jpeg;base64,${user.avatar}`}
                                            alt={`${user.firstname} ${user.lastname}`}
                                            className='w-full h-full rounded-full object-cover'
                                        />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </button>
                                {showProfileCard && user && (
                                    <>
                                        <div className='absolute top-full left-0 right-0 h-2 bg-transparent' />
                                        <div className='absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10'>
                                            <div className='px-4 py-2'>
                                                <p className='text-sm font-medium text-gray-900'>
                                                    {user.firstname}{' '}
                                                    {user.lastname}
                                                </p>
                                                <p className='text-sm text-gray-500'>
                                                    {user.email}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    navigate('/profile')
                                                }
                                                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-100'
                                            >
                                                Profil anzeigen
                                            </button>
                                            <a
                                                href='#settings'
                                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100'
                                            >
                                                Einstellungen
                                            </a>
                                            <a
                                                onClick={handleLogout}
                                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 cursor-pointer'
                                            >
                                                Abmelden
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='ml-4 md:hidden'>
                                <button
                                    onClick={toggleMenu}
                                    className='inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                                >
                                    {isOpen ? (
                                        <X
                                            className='block h-6 w-6'
                                            aria-hidden='true'
                                        />
                                    ) : (
                                        <Menu
                                            className='block h-6 w-6'
                                            aria-hidden='true'
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                        <button
                            onClick={() => {
                                navigate('/dashboard');
                                setIsOpen(false);
                            }}
                            className='text-white hover:bg-white hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition duration-300'
                        >
                            Dashboard
                        </button>
                        <a
                            href='#'
                            className='text-white hover:bg-white hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300'
                            onClick={() => setIsOpen(false)}
                        >
                            Freunde
                        </a>
                        <a
                            href='#'
                            className='text-white hover:bg-white hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300'
                            onClick={() => setIsOpen(false)}
                        >
                            Benachrichtigungen
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
