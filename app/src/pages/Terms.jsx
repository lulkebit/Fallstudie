import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Scale,
    FileText,
    AlertCircle,
    Shuffle,
    CreditCard,
    HeartHandshake,
    ShieldCheck,
    HelpCircle,
    ArrowLeft,
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const fromProfile = location.state?.fromProfile;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='min-h-screen bg-white dark:bg-gray-900'>
            {fromProfile ? <Navbar /> : <LandingNavbar />}

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
                            Allgemeine Geschäfts
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                bedingungen
                            </span>
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                            Stand: Oktober 2024
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className='max-w-4xl mx-auto space-y-8'>
                        {/* Introduction */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Scale className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    §1 Allgemeines und Geltungsbereich
                                </h2>
                            </div>

                            <div className='prose prose-gray dark:prose-invert max-w-none'>
                                <p className='text-gray-600 dark:text-white/70'>
                                    Diese Allgemeinen Geschäftsbedingungen (AGB)
                                    gelten für alle gegenwärtigen und
                                    zukünftigen Geschäftsbeziehungen zwischen
                                    der TrackMyGoal GmbH (nachfolgend
                                    "Anbieter") und den Nutzern der
                                    TrackMyGoal-Plattform. Abweichende,
                                    entgegenstehende oder ergänzende AGB werden
                                    nicht Vertragsbestandteil, es sei denn,
                                    ihrer Geltung wird ausdrücklich schriftlich
                                    zugestimmt.
                                </p>
                            </div>
                        </div>

                        {/* Service Description */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <FileText className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    §2 Leistungsbeschreibung
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>
                                    2.1 TrackMyGoal bietet eine Online-Plattform
                                    zur Zielverfolgung und -verwaltung.
                                </p>
                                <p>2.2 Der Funktionsumfang umfasst:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>
                                        Erstellung und Verwaltung persönlicher
                                        Ziele
                                    </li>
                                    <li>Fortschrittsverfolgung und Analysen</li>
                                    <li>Community-Funktionen und Teaming</li>
                                    <li>Statistiken und Reporting</li>
                                </ul>
                                <p>
                                    2.3 Der Anbieter behält sich das Recht vor,
                                    den Funktionsumfang weiterzuentwickeln, zu
                                    ändern oder einzuschränken.
                                </p>
                            </div>
                        </div>

                        {/* Registration and Usage */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <AlertCircle className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    §3 Registrierung und Nutzung
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>
                                    3.1 Die Nutzung setzt eine Registrierung
                                    voraus.
                                </p>
                                <p>3.2 Der Nutzer versichert:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>
                                        Volljährigkeit oder Zustimmung der
                                        Erziehungsberechtigten
                                    </li>
                                    <li>Richtigkeit der angegebenen Daten</li>
                                    <li>Geheimhaltung der Zugangsdaten</li>
                                </ul>
                                <p>
                                    3.3 Der Anbieter behält sich vor, Accounts
                                    bei Verstoß gegen diese AGB zu sperren.
                                </p>
                            </div>
                        </div>

                        {/* Subscription and Fees */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <CreditCard className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    §4 Abonnement und Gebühren
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>4.1 Verfügbare Abonnements:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>Basic (kostenlos)</li>
                                    <li>Pro (9,99€/Monat)</li>
                                    <li>Enterprise (individueller Tarif)</li>
                                </ul>
                                <p>4.2 Zahlungsbedingungen:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>
                                        Monatliche oder jährliche Vorauszahlung
                                    </li>
                                    <li>Automatische Verlängerung</li>
                                    <li>14-tägiges Widerrufsrecht</li>
                                </ul>
                            </div>
                        </div>

                        {/* Rights and Obligations */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <HeartHandshake className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    §5 Rechte und Pflichten
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>5.1 Nutzer verpflichten sich:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>
                                        Keine rechtswidrigen Inhalte zu teilen
                                    </li>
                                    <li>Keine Schadsoftware zu verbreiten</li>
                                    <li>Die Rechte Dritter zu respektieren</li>
                                </ul>
                                <p>5.2 Der Anbieter behält sich vor:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>Technische Änderungen vorzunehmen</li>
                                    <li>Wartungsarbeiten durchzuführen</li>
                                    <li>Regelverstoße zu ahnden</li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Protection */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <ShieldCheck className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    §6 Datenschutz
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>
                                    Die Verarbeitung personenbezogener Daten
                                    erfolgt gemäß unserer Datenschutzerklärung
                                    unter Beachtung der DSGVO.
                                </p>
                            </div>
                        </div>

                        {/* Liability */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <Shuffle className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    §7 Haftung
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>7.1 Der Anbieter haftet nur für:</p>
                                <ul className='list-disc list-inside ml-4 space-y-2'>
                                    <li>Vorsatz und grobe Fahrlässigkeit</li>
                                    <li>
                                        Schäden an Leben, Körper und Gesundheit
                                    </li>
                                    <li>Wesentliche Vertragspflichten</li>
                                </ul>
                                <p>
                                    7.2 Eine weitergehende Haftung ist
                                    ausgeschlossen.
                                </p>
                            </div>
                        </div>

                        {/* Final Provisions */}
                        <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-lg dark:shadow-none'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                    <HelpCircle className='h-6 w-6 text-white' />
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    §8 Schlussbestimmungen
                                </h2>
                            </div>

                            <div className='space-y-4 text-gray-600 dark:text-white/70'>
                                <p>8.1 Es gilt deutsches Recht.</p>
                                <p>
                                    8.2 Gerichtsstand ist Hamburg, soweit
                                    gesetzlich zulässig.
                                </p>
                                <p>
                                    8.3 Sollten einzelne Bestimmungen unwirksam
                                    sein, bleibt die Wirksamkeit der übrigen
                                    Bestimmungen unberührt.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {fromProfile ? null : <Footer />}
        </div>
    );
};

export default Terms;
