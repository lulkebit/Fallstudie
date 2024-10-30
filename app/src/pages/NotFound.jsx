import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MoveLeft, ExternalLink } from 'lucide-react';

// Hauptkomponente für die 404-Fehlerseite
const NotFound = () => {
    return (
        // Container mit Farbverlauf-Hintergrund
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            {/* Animierte Hintergrund-Elemente */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            {/* Haupt-Content-Bereich */}
            <div className='relative z-10 min-h-screen flex flex-col items-center justify-center p-4'>
                <div className='w-full max-w-2xl'>
                    {/* Glasmorphismus-Karte */}
                    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-12 text-center'>
                        {/* Such-Icon im Farbverlauf */}
                        <div className='mb-8'>
                            <div className='w-24 h-24 rounded-2xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center mx-auto'>
                                <Search className='w-12 h-12 text-white' />
                            </div>
                        </div>

                        {/* Animierte 404-Nummer */}
                        <div className='relative mb-6 group'>
                            <div className='absolute -inset-1'>
                                <div className='w-full h-full mx-auto rotate-180'>
                                    <div className='absolute inset-0 -z-10 group-hover:animate-[pulse_2s_infinite]'>
                                        <div className='absolute inset-0 translate-x-0 blur-2xl bg-gradient-to-r from-[#4785FF]/30 to-[#8c52ff]/30' />
                                    </div>
                                </div>
                            </div>
                            <h1 className='text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                404
                            </h1>
                        </div>

                        {/* Fehlermeldung und Beschreibung */}
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                            Seite nicht gefunden
                        </h2>
                        <p className='text-gray-600 dark:text-white/70 mb-8 max-w-md mx-auto'>
                            Die von dir gesuchte Seite existiert leider nicht
                            oder wurde möglicherweise verschoben.
                        </p>

                        {/* Aktions-Buttons */}
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <Link
                                to='/'
                                className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4785FF] to-[#8c52ff]
                         text-white rounded-xl font-medium shadow-lg 
                         hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                         transition-all duration-200 hover:-translate-y-0.5'
                            >
                                <MoveLeft className='w-5 h-5' />
                                Zurück zur Startseite
                            </Link>
                            <Link
                                to='/kontakt'
                                className='inline-flex items-center justify-center gap-2 px-6 py-3
                         text-gray-700 dark:text-white/70 
                         hover:bg-gray-100 dark:hover:bg-white/5
                         border border-gray-200 dark:border-white/10
                         rounded-xl font-medium
                         transition-all duration-200 hover:-translate-y-0.5'
                            >
                                <ExternalLink className='w-5 h-5' />
                                Support kontaktieren
                            </Link>
                        </div>

                        {/* Animierte Lade-Punkte */}
                        <div className='flex justify-center gap-3 mt-12'>
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className='w-3 h-3 rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] animate-bounce'
                                    style={{
                                        animationDelay: `${i * 0.2}s`,
                                        animationDuration: '1.4s',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
