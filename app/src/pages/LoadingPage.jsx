import React from 'react';
import Loader from '../components/Loader';
import Waves from '../components/Waves';

const LoadingPage = () => {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden'>
            <Waves />

            <div className='w-full max-w-md z-10'>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden p-8'>
                    <div className='flex flex-col items-center'>
                        <img
                            src='/Logo.png'
                            alt='TrackMyGoal Logo'
                            className='h-24 mb-8 animate-pulse'
                        />
                        <Loader />
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                            Lädt...
                        </h2>
                        <p className='text-gray-600 text-center'>
                            Bitte haben Sie einen Moment Geduld, während wir
                            Ihre Daten laden.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;
