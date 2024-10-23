import React from 'react';
import Waves from '../components/Waves';

const LoadingPage = () => {
    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <Waves />

            <div className='relative z-10 px-4 w-full max-w-lg'>
                <div className='bg-white rounded-xl shadow-lg p-8 sm:p-10'>
                    <div className='flex flex-col items-center'>
                        <div className='w-32 h-32  rounded-xl flex items-center justify-center mb-8'>
                            <img
                                src='/Logo.png'
                                alt='TrackMyGoal Logo'
                                className='h-20 w-20 object-contain animate-pulse'
                            />
                        </div>

                        <div className='text-center space-y-2'>
                            <h2 className='text-xl font-bold text-gray-800 mb-2'>
                                Einen Moment bitte
                            </h2>
                            <p className='text-gray-500'>
                                Wir laden Ihre Daten...
                            </p>
                        </div>

                        <div className='flex gap-2 mt-6'>
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className='w-2 h-2 rounded-full bg-blue-500 opacity-0 animate-[bounce_1.4s_infinite]'
                                    style={{
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

export default LoadingPage;
