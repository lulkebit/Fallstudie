import React from 'react';
import { Link } from 'react-router-dom';
import Waves from '../components/Waves';

const NotFound = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden'>
            <Waves />

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
