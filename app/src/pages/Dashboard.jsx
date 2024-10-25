import React from 'react';
import Navbar from '../components/Navbar';
import Table from '../components/PrivateGoaltable';
import PublicGoalTable from '../components/PublicGoaltable';

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16'>
                {/* Decorative Elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/5 dark:bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/5 dark:bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
                </div>

                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <h1 className='text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white'>
                        Dashboard
                    </h1>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-none'>
                            <div className='p-6'>
                                <div className='border-b border-gray-200 dark:border-white/10 pb-6'>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                        Meine Ziele
                                    </h2>
                                    <p className='mt-1 text-sm text-gray-600 dark:text-white/60'>
                                        Verwalte deine persönlichen Ziele
                                    </p>
                                </div>
                                <div className='mt-6'>
                                    <Table />
                                </div>
                            </div>
                        </div>

                        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-none'>
                            <div className='p-6'>
                                <div className='border-b border-gray-200 dark:border-white/10 pb-6'>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                        Ziele von Freunden
                                    </h2>
                                    <p className='mt-1 text-sm text-gray-600 dark:text-white/60'>
                                        Entdecke die öffentlichen Ziele deiner
                                        Freunde
                                    </p>
                                </div>
                                <div className='mt-6'>
                                    <PublicGoalTable />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
