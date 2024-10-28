import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Building2,
    Scale,
    ArrowLeft,
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';

const LegalNotice = () => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const fromProfile = location.state?.fromProfile;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='min-h-screen bg-white dark:bg-gray-900'>
            {user ? <Navbar /> : <LandingNavbar />}
            <div className='relative py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden'>
                {/* Background Elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                    <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
                </div>

                <div className='container mx-auto px-4 relative z-10'>
                    {/* Header Section */}
                    <div className='text-center mb-16'>
                        {fromProfile && (
                            <button
                                onClick={() => navigate(-1)}
                                className='absolute left-4 top-0 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200'
                            >
                                <ArrowLeft className='w-5 h-5' />
                                <span>Zurück</span>
                            </button>
                        )}
                        <h1 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white'>
                            Impressum &{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                Rechtliche Angaben
                            </span>
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                            Informationen gemäß § 5 TMG
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className='max-w-4xl mx-auto'>
                        {/* Company Information */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 mb-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Building2 className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Unternehmensangaben
                                </h2>
                            </div>

                            <div className='space-y-4'>
                                <p className='text-gray-600 dark:text-white/70'>
                                    TrackMyGoal GmbH
                                </p>
                                <div className='flex items-start gap-3'>
                                    <MapPin className='w-5 h-5 text-gray-400 dark:text-white/40 mt-1' />
                                    <div className='text-gray-600 dark:text-white/70'>
                                        Musterstraße 123
                                        <br />
                                        12345 Hamburg
                                        <br />
                                        Deutschland
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 mb-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Mail className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Kontakt
                                </h2>
                            </div>

                            <div className='space-y-4'>
                                <div className='flex items-center gap-3'>
                                    <Phone className='w-5 h-5 text-gray-400 dark:text-white/40' />
                                    <span className='text-gray-600 dark:text-white/70'>
                                        +49 (0) 123 456789
                                    </span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Mail className='w-5 h-5 text-gray-400 dark:text-white/40' />
                                    <span className='text-gray-600 dark:text-white/70'>
                                        info@trackmygoal.de
                                    </span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <Globe className='w-5 h-5 text-gray-400 dark:text-white/40' />
                                    <span className='text-gray-600 dark:text-white/70'>
                                        www.trackmygoal.de
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Legal Representatives */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 mb-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Scale className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Vertretungsberechtigte
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>Geschäftsführer:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>Luke Schröter</li>
                                    <li>Sönke Vogelsberg</li>
                                    <li>Jean-Luc Höfler</li>
                                    <li>Arman Rashoyan</li>
                                </ul>

                                <div className='mt-6'>
                                    <p className='mb-2'>Handelsregister:</p>
                                    <p>
                                        Amtsgericht Hamburg
                                        <br />
                                        HRB: 123456
                                        <br />
                                        USt-IdNr.: DE123456789
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                                Rechtliche Hinweise
                            </h3>
                            <div className='prose prose-gray dark:prose-invert max-w-none'>
                                <p className='text-gray-600 dark:text-white/70'>
                                    Trotz sorgfältiger inhaltlicher Kontrolle
                                    übernehmen wir keine Haftung für die Inhalte
                                    externer Links. Für den Inhalt der
                                    verlinkten Seiten sind ausschließlich deren
                                    Betreiber verantwortlich.
                                </p>
                                <p className='text-gray-600 dark:text-white/70 mt-4'>
                                    Alle Inhalte dieser Website sind
                                    urheberrechtlich geschützt. Die Verwendung
                                    von Texten, Bildern oder anderen Inhalten
                                    bedarf der ausdrücklichen Zustimmung der
                                    TrackMyGoal GmbH.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LegalNotice;
