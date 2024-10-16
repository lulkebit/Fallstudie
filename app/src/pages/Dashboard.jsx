import React from 'react';
import Navbar from '../components/Navbar';
import Table from '../components/PrivateGoaltable';
import PublicGoalTable from '../components/PublicGoaltable';

const Dashboard = () => {
    return (
        <div className='flex flex-col min-h-screen bg-gray-100'>
            <Navbar />
            <div className='flex flex-col md:flex-row flex-1 p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6'>
                <div className='w-full md:w-1/2 space-y-6'>
                    <div className='bg-white rounded-lg shadow-md p-4 md:p-6'>
                        <Table />
                    </div>
                </div>
                <div className='w-full md:w-1/2 space-y-6'>
                    <div className='bg-white rounded-lg shadow-md p-4 md:p-6'>
                        <PublicGoalTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
