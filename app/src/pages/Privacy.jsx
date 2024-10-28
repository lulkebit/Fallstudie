import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Shield,
    Lock,
    Eye,
    Server,
    Bell,
    Users,
    Mail,
    FileWarning,
    ArrowLeft
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';

const Privacy = () => {
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
                            Datenschutz
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                erklärung
                            </span>
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                            Informationen zum Schutz und zur Verarbeitung Ihrer
                            personenbezogenen Daten
                        </p>
                    </div>

                    {/* Rest of the content remains unchanged */}
                    {/* Main Content */}
                    <div className='max-w-4xl mx-auto space-y-8'>
                        {/* Introduction */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Shield className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Allgemeine Hinweise
                                </h2>
                            </div>

                            <div className='prose prose-gray dark:prose-invert max-w-none'>
                                <p className='text-gray-600 dark:text-white/70'>
                                    Die nachfolgende Datenschutzerklärung gilt
                                    für die Nutzung der Website TrackMyGoal. Wir
                                    messen dem Datenschutz große Bedeutung bei.
                                    Die Erhebung und Verarbeitung Ihrer
                                    personenbezogenen Daten erfolgt unter
                                    Beachtung der geltenden
                                    datenschutzrechtlichen Vorschriften,
                                    insbesondere der
                                    EU-Datenschutzgrundverordnung (DSGVO).
                                </p>
                            </div>
                        </div>

                        {/* Data Collection */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Eye className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Datenerfassung
                                </h2>
                            </div>

                            <div className='space-y-6 text-gray-600 dark:text-white/70'>
                                <p>
                                    Wir erfassen und speichern automatisch in
                                    unseren Server Log Files Informationen, die
                                    Ihr Browser an uns übermittelt. Dies sind:
                                </p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>Browsertyp und -version</li>
                                    <li>Verwendetes Betriebssystem</li>
                                    <li>
                                        Referrer URL (die zuvor besuchte Seite)
                                    </li>
                                    <li>
                                        IP-Adresse des zugreifenden Rechners
                                    </li>
                                    <li>Zugriffsdatum und -uhrzeit</li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Storage */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Server className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Datenspeicherung
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>
                                    Als registrierter Nutzer speichern wir
                                    zusätzlich:
                                </p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>Name und E-Mail-Adresse</li>
                                    <li>
                                        Ihre persönlichen Ziele und Fortschritte
                                    </li>
                                    <li>Interaktionen mit anderen Nutzern</li>
                                    <li>
                                        Nutzungsdaten zur Verbesserung unseres
                                        Services
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Cookies */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Lock className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Cookies
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>
                                    Unsere Website verwendet Cookies. Das sind
                                    kleine Textdateien, die es ermöglichen, auf
                                    dem Endgerät des Nutzers spezifische, auf
                                    den Nutzer bezogene Informationen zu
                                    speichern. Dies ermöglicht uns:
                                </p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>
                                        Die Optimierung der Website-Navigation
                                    </li>
                                    <li>Die Speicherung Ihrer Login-Daten</li>
                                    <li>
                                        Die Verbesserung der Nutzererfahrung
                                    </li>
                                    <li>Die Analyse der Website-Nutzung</li>
                                </ul>
                            </div>
                        </div>

                        {/* User Rights */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Users className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Ihre Rechte
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>Sie haben jederzeit das Recht:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>
                                        Auskunft über Ihre bei uns gespeicherten
                                        Daten zu erhalten
                                    </li>
                                    <li>
                                        Ihre Daten berichtigen oder löschen zu
                                        lassen
                                    </li>
                                    <li>
                                        Die Verarbeitung Ihrer Daten
                                        einschränken zu lassen
                                    </li>
                                    <li>
                                        Widerspruch gegen die Verarbeitung
                                        einzulegen
                                    </li>
                                    <li>
                                        Ihre Daten in einem übertragbaren Format
                                        zu erhalten
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Mail className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Kontakt zum Datenschutzbeauftragten
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>
                                    Bei Fragen zur Erhebung, Verarbeitung oder
                                    Nutzung Ihrer personenbezogenen Daten,
                                    wenden Sie sich bitte an:
                                </p>
                                <div className='mt-4'>
                                    <p>Max Mustermann</p>
                                    <p>TrackMyGoal GmbH</p>
                                    <p>datenschutz@trackmygoal.de</p>
                                    <p>Tel: +49 (0) 123 456789</p>
                                </div>
                            </div>
                        </div>

                        {/* Updates Section */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Bell className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Änderungen
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>
                                    Wir behalten uns vor, diese
                                    Datenschutzerklärung anzupassen, damit sie
                                    stets den aktuellen rechtlichen
                                    Anforderungen entspricht oder um Änderungen
                                    unserer Leistungen in der
                                    Datenschutzerklärung umzusetzen.
                                </p>
                                <p>Letzte Aktualisierung: Oktober 2024</p>
                            </div>
                        </div>

                        {/* Newsletter Section */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <FileWarning className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Newsletter & Marketing
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>
                                    Mit Ihrer Einwilligung verwenden wir Ihre
                                    E-Mail-Adresse für den Versand unseres
                                    Newsletters. Die Einwilligung können Sie
                                    jederzeit widerrufen, indem Sie:
                                </p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>
                                        Den Abmelde-Link im Newsletter nutzen
                                    </li>
                                    <li>
                                        Eine E-Mail an
                                        unsubscribe@trackmygoal.de senden
                                    </li>
                                    <li>
                                        Ihre Einstellungen im Nutzerprofil
                                        anpassen
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Privacy;
