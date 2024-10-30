//Import der Bibliotheken
import React from 'react';
import { Loader2 } from 'lucide-react';

//Festlegen von "LoadingPage" als wiederverwendbare React-Komponente
const LoadingPage = () => {
    return (
        // Hintergrund mit Farbverlauf (links oben --> rechts unten)
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            <div className='absolute inset-0'>
                {/* Kreise im Hintergrund (verschwommen, pulsierend) */}
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div className='relative z-10 min-h-screen flex flex-col items-center justify-center p-4'>
                <div className='w-full max-w-2xl'>
                    {/* Box für Inhalte */}
                    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-12 text-center'>
                        {/* Logo-Icon */}
                        <div className='mb-8'>
                            <div className='w-24 h-24 rounded-2xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center mx-auto'>
                                <img
                                    src='/Logo.png'
                                    alt='TrackMyGoal Logo'
                                    className='h-16 w-16 object-contain'
                                />
                            </div>
                        </div>

                        {/* Hintergrundstreifen */}
                        <div className='relative mb-6 group'>
                            <div className='absolute -inset-1'>
                                <div className='w-full h-full mx-auto rotate-180'>
                                    <div className='absolute inset-0 -z-10'>
                                        <div className='absolute inset-0 translate-x-0 blur-2xl bg-gradient-to-r from-[#4785FF]/30 to-[#8c52ff]/30' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center justify-center gap-2'>
                                {/* Ladesymbol */}
                                <Loader2 className='w-8 h-8 text-[#4785FF] animate-spin' />
                            </div>
                        </div>

                        {/* Text Content */}
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                            Einen Moment bitte
                        </h2>
                        <p className='text-gray-600 dark:text-white/70 mb-8 max-w-md mx-auto'>
                            Wir laden deine Daten...
                        </p>

                        {/* Animierte Punkte */}
                        <div className='flex justify-center gap-3 mt-8'>
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

//Export der Loadingpage zur Wiederverwendung
export default LoadingPage;
