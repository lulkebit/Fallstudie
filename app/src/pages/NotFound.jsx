import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
                <svg
                    className='absolute bottom-0 left-0 w-full h-full'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 1440 320'
                    preserveAspectRatio='none'
                >
                    <path
                        fill='#4F46E5'
                        fillOpacity='0.35'
                        d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
                    ></path>
                </svg>
                <svg
                    className='absolute bottom-0 left-0 w-full h-full'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 1440 320'
                    preserveAspectRatio='none'
                >
                    <path
                        fill='#818CF8'
                        fillOpacity='0.4'
                        d='M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,122.7C960,139,1056,149,1152,138.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
                    ></path>
                </svg>
            </div>

            <div className='w-full max-w-md z-10'>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                    <div className='px-10 pt-10 pb-8 text-center'>
                        <h1 className='text-4xl font-bold text-indigo-600 mb-4'>
                            404
                        </h1>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                            Seite nicht gefunden
                        </h2>
                        <p className='text-gray-600 mb-8'>
                            Die angeforderte Seite existiert nicht.
                        </p>
                        <Link
                            to='/'
                            className='inline-block bg-indigo-600 text-white font-medium px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300'
                        >
                            Zurück zur Startseite
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
