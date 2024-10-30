import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, Sun, Moon, Rocket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const LandingNavbar = ({ hideNavItems = false, customActions = null }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when navigating
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    const navigateToSection = (sectionId) => {
        setIsMobileMenuOpen(false);
        document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: 'smooth' });
    };

    const navItems = [
        { id: 'second-section', label: 'Vision' },
        { id: 'third-section', label: 'Vorteile' },
        { id: 'fourth-section', label: 'Preise' },
        { id: 'fifth-section', label: 'Team' },
        { id: 'last-section', label: 'FAQ' },
    ];

    const defaultActions = (
        <div className='hidden lg:flex items-center gap-4'>
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200 text-sm font-medium'
            >
                {isDarkMode ? <Sun /> : <Moon />}
            </button>
            <button
                onClick={() => navigate('/login')}
                className='px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-2'
            >
                <LogIn className='w-4 h-4' />
                Login
            </button>
            <button
                onClick={() => navigate('/register')}
                className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2'
            >
                <Rocket className='w-4 h-4' />
                <span className='hidden sm:inline'>Jetzt starten</span>
                <span className='sm:hidden'>Start</span>
            </button>
        </div>
    );

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10'
                    : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg'
            }`}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16 sm:h-20 items-center'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <div
                            onClick={() => navigate('/')}
                            className='h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center mr-2 sm:mr-3 cursor-pointer'
                        >
                            <img
                                src='/Logo.png'
                                alt='TrackMyGoal Logo'
                                className='h-8 w-8 object-contain'
                            />
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className='text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'
                        >
                            TrackMyGoal
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    {!hideNavItems && (
                        <div className='hidden lg:flex items-center gap-8'>
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigateToSection(item.id)}
                                    className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200 text-sm font-medium'
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Desktop Actions */}
                    {customActions || defaultActions}

                    {/* Mobile Menu Button and Theme Toggle */}
                    <div className='lg:hidden flex items-center gap-2 sm:gap-4'>
                        {/* Theme Toggle Mobile */}
                        <button
                            onClick={toggleTheme}
                            className='p-1.5 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors duration-200'
                            aria-label='Toggle theme'
                        >
                            {isDarkMode ? (
                                <Sun className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-white' />
                            ) : (
                                <Moon className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-white' />
                            )}
                        </button>

                        {!hideNavItems && (
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className='p-1.5 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors duration-200'
                                aria-label='Toggle menu'
                            >
                                {isMobileMenuOpen ? (
                                    <X className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-white' />
                                ) : (
                                    <Menu className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-white' />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {!hideNavItems && (
                <div
                    className={`lg:hidden absolute w-full transition-all duration-200 ease-in-out ${
                        isMobileMenuOpen
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                >
                    <div className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 shadow-lg'>
                        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
                            <div className='space-y-3 sm:space-y-4'>
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            navigateToSection(item.id)
                                        }
                                        className='block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-white/5'
                                    >
                                        {item.label}
                                    </button>
                                ))}
                                <div className='pt-3 sm:pt-4 space-y-2 sm:space-y-3'>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className='w-full px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5'
                                    >
                                        <LogIn className='w-4 h-4' />
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className='w-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2'
                                    >
                                        <Rocket className='w-4 h-4' />
                                        <span>Jetzt starten</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default LandingNavbar;
