import React from 'react';
import Navbar from '../components/navbar';
import Table from '../components/table';
import PublicGoalTable from '../components/publicGoalTable';

const Dashboard = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />
            <div className='flex flex-1 p-6 space-x-6'>
                <div className='w-1/2'>
                    <Table />
                </div>
                <div className='w-1/2'>
                    <PublicGoalTable />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
