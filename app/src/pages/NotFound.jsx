import React from 'react';
import { Link } from 'react-router-dom';
import Waves from '../components/Waves';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <Waves />

            <div className='relative z-10 w-full max-w-lg px-4'>
                <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                    <div className='p-8 text-center'>
                        <div className='w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-6'>
                            <Search className='w-12 h-12 text-blue-500' />
                        </div>

                        <div className='relative mb-4'>
                            <div className='absolute -inset-1'>
                                <div className='w-full h-full mx-auto rotate-180'>
                                    <div className='absolute inset-0 -z-10 animate-[pulse_2.5s_infinite]'>
                                        <div className='absolute inset-0 translate-x-0 blur-lg bg-gradient-to-r from-blue-500/30 to-blue-600/30'></div>
                                    </div>
                                </div>
                            </div>
                            <h1 className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400'>
                                404
                            </h1>
                        </div>

                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                            Seite nicht gefunden
                        </h2>
                        <p className='text-gray-500 mb-8 max-w-sm mx-auto'>
                            Die von Ihnen gesuchte Seite existiert leider nicht
                            oder wurde möglicherweise verschoben.
                        </p>

                        <Link
                            to='/'
                            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg 
                                     font-medium shadow-lg hover:bg-blue-700 transition-all duration-200 
                                     hover:shadow-xl hover:scale-105'
                        >
                            <Home className='w-5 h-5' />
                            Zurück zur Startseite
                        </Link>

                        <div className='flex justify-center gap-2 mt-8'>
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className='w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1.4s_infinite]'
                                    style={{
                                        opacity: 0.3,
                                        animationDelay: `${i * 0.2}s`,
                                        animationFillMode: 'both',
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
