import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className='p-4'>
            <nav className='bg-gradient-to-r from-blue-300 to-red-300 rounded-lg shadow-lg'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        <div className='flex items-center flex-grow'>
                            <div className='flex-shrink-0'>
                                <span className='text-white text-lg font-bold'>
                                    TrackMyGoal
                                </span>
                            </div>
                            <div className='hidden md:block ml-4 flex-grow'>
                                <div className='flex items-baseline space-x-4'>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className='text-white hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                                    >
                                        Dashboard
                                    </button>
                                    <a
                                        href='#'
                                        className='text-white hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                                    >
                                        Freunde
                                    </a>
                                    <a
                                        href='#'
                                        className='text-white hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                                    >
                                        Benachrichtigungen
                                    </a>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className='text-white hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                                    >
                                        Profil
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='-mr-2 flex md:hidden'>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type='button'
                                className='inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                                aria-controls='mobile-menu'
                                aria-expanded='false'
                            >
                                <span className='sr-only'>Open main menu</span>
                                {isOpen ? (
                                    <svg
                                        className='block h-6 w-6'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        aria-hidden='true'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M6 18L18 6M6 6l12 12'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className='block h-6 w-6'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        aria-hidden='true'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M4 6h16M4 12h16M4 18h16'
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className='md:hidden' id='mobile-menu'>
                        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className='text-white hover:bg-blue-400 block px-3 py-2 rounded-md text-base font-medium'
                            >
                                Dashboard
                            </button>
                            <a
                                href='#'
                                className='text-white hover:bg-blue-400 block px-3 py-2 rounded-md text-base font-medium'
                            >
                                Freunde
                            </a>
                            <a
                                href='#'
                                className='text-white hover:bg-blue-400 block px-3 py-2 rounded-md text-base font-medium'
                            >
                                Benachrichtigungen
                            </a>
                            <button
                                onClick={() => navigate('/profile')}
                                className='text-white hover:bg-blue-400 block px-3 py-2 rounded-md text-base font-medium'
                            >
                                Profil
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
