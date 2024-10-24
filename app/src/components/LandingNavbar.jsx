import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';

const LandingNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigateToSection = (sectionId) => {
        setIsMobileMenuOpen(false);
        document
            .getElementById(sectionId)
            .scrollIntoView({ behavior: 'smooth' });
    };

    const navItems = [
        { id: 'second-section', label: 'Vision' },
        { id: 'third-section', label: 'Vorteile' },
        { id: 'fourth-section', label: 'Preise' },
        { id: 'fifth-section', label: 'Team' },
        { id: 'last-section', label: 'FAQ' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-gray-900/80 backdrop-blur-xl border-b border-white/10'
                    : 'bg-transparent'
            }`}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-20 items-center'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center mr-3'>
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
                        <span className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                            TrackMyGoal
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden lg:flex items-center gap-8'>
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => navigateToSection(item.id)}
                                className='text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium'
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className='hidden lg:flex items-center gap-4'>
                        <button className='px-4 py-2 text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-2'>
                            <LogIn className='w-4 h-4' />
                            Login
                        </button>
                        <button className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5'>
                            Kostenlos starten
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className='lg:hidden'>
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className='text-white/70 hover:text-white transition-colors duration-200'
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
                <div className='bg-gray-900/95 backdrop-blur-xl border-t border-white/10'>
                    <div className='px-4 pt-2 pb-6 space-y-4'>
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => navigateToSection(item.id)}
                                className='block w-full text-left px-4 py-2 text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium'
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className='pt-4 space-y-2'>
                            <button className='w-full px-4 py-2 text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-2'>
                                <LogIn className='w-4 h-4' />
                                Login
                            </button>
                            <button className='w-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300'>
                                Kostenlos starten
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;
