import React from 'react';
import Navbar from '../components/Navbar';
import Table from '../components/PrivateGoaltable';
import PublicGoalTable from '../components/PublicGoaltable';
import Waves from '../components/Waves';

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-16'>
                <Waves />
                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <h1 className='text-4xl font-bold mb-8 text-center text-gray-800'>
                        Dashboard
                    </h1>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                            <div className='p-6'>
                                <div className='border-b border-gray-100 pb-6'>
                                    <h2 className='text-xl font-bold text-gray-800'>
                                        Meine Ziele
                                    </h2>
                                    <p className='mt-1 text-sm text-gray-500'>
                                        Verwalte deine persönlichen Ziele
                                    </p>
                                </div>
                                <div className='mt-6'>
                                    <Table />
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                            <div className='p-6'>
                                <div className='border-b border-gray-100 pb-6'>
                                    <h2 className='text-xl font-bold text-gray-800'>
                                        Ziele von Freunden
                                    </h2>
                                    <p className='mt-1 text-sm text-gray-500'>
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
