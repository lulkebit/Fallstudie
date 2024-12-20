import React from 'react';
import { Instagram, Mail, ExternalLink, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDialog } from '../context/DialogContext';
import CookieSettingsDialog from './dialogs/CookieSettingsDialog';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addDialog } = useDialog();

    const navigateToSection = (sectionId) => {
        if (location.pathname === '/') {
            // If we're on the landing page, just scroll
            document
                .getElementById(sectionId)
                ?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If we're on another page, navigate to landing page with section info
            navigate('/', { state: { scrollTo: sectionId } });
        }
    };

    const openCookieSettings = () => {
        addDialog({
            component: CookieSettingsDialog,
        });
    };

    return (
        <footer className='relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden'>
            {/* Decorative Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
            </div>

            <div className='relative z-10'>
                {/* Main Footer Content */}
                <div className='container mx-auto px-4 py-16'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
                        {/* Brand Column */}
                        <div className='space-y-6'>
                            <div className='flex items-center gap-3'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <img
                                        src='/Logo.png'
                                        alt='TrackMyGoal Logo'
                                        className='h-10 w-10 object-contain'
                                    />
                                </div>
                                <span className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                    TrackMyGoal
                                </span>
                            </div>
                            <p className='text-gray-600 dark:text-white/70'>
                                Your Journey, Your Success! Erreiche deine Ziele
                                mit System und Community.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className='text-gray-900 dark:text-white font-semibold mb-6'>
                                Quick Links
                            </h3>
                            <ul className='space-y-4'>
                                {[
                                    {
                                        label: 'Vision',
                                        section: 'second-section',
                                    },
                                    {
                                        label: 'Vorteile',
                                        section: 'third-section',
                                    },
                                    {
                                        label: 'Preise',
                                        section: 'fourth-section',
                                    },
                                    {
                                        label: 'Über uns',
                                        section: 'fifth-section',
                                    },

                                    { label: 'FAQ', section: 'last-section' },
                                ].map((link, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() =>
                                                navigateToSection(link.section)
                                            }
                                            className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white flex items-center gap-2 group'
                                        >
                                            <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h3 className='text-gray-900 dark:text-white font-semibold mb-6'>
                                Rechtliches
                            </h3>
                            <ul className='space-y-4'>
                                <li>
                                    <button
                                        onClick={() => navigate('/impressum')}
                                        className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white flex items-center gap-2 group'
                                    >
                                        <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
                                        Impressum
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => navigate('/datenschutz')}
                                        className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white flex items-center gap-2 group'
                                    >
                                        <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
                                        Datenschutz
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => navigate('/agb')}
                                        className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white flex items-center gap-2 group'
                                    >
                                        <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
                                        AGB
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={openCookieSettings}
                                        className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white flex items-center gap-2 group'
                                    >
                                        <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
                                        Cookie-Einstellungen
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className='text-gray-900 dark:text-white font-semibold mb-6'>
                                Kontakt
                            </h3>
                            <div className='space-y-4'>
                                <a
                                    href='mailto:contact@trackmygoal.de'
                                    className='bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-3 rounded-xl flex items-center gap-3 group transition-colors duration-200'
                                >
                                    <Mail className='w-5 h-5 text-gray-600 dark:text-white/70' />
                                    <span className='text-gray-600 group-hover:text-gray-900 dark:text-white/70 dark:group-hover:text-white text-sm'>
                                        contact@trackmygoal.de
                                    </span>
                                </a>
                                <button
                                    onClick={() => navigate('/kontakt')}
                                    className='bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-3 rounded-xl flex items-center gap-3 group transition-colors duration-200 w-full'
                                >
                                    <ExternalLink className='w-5 h-5 text-gray-600 dark:text-white/70' />
                                    <span className='text-gray-600 group-hover:text-gray-900 dark:text-white/70 dark:group-hover:text-white text-sm'>
                                        Kontaktformular
                                    </span>
                                </button>
                                <a
                                    href='https://www.instagram.com/trackmygoal2024/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-3 rounded-xl flex items-center gap-3 group transition-colors duration-200'
                                >
                                    <Instagram className='w-5 h-5 text-gray-600 dark:text-white/70' />
                                    <span className='text-gray-600 group-hover:text-gray-900 dark:text-white/70 dark:group-hover:text-white text-sm'>
                                        Intagram
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='border-t border-gray-200 dark:border-white/10'>
                    <div className='container mx-auto px-4 py-6'>
                        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                            <p className='text-gray-500 dark:text-white/40 text-sm'>
                                © 2024 TrackMyGoal. Alle Rechte vorbehalten.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
