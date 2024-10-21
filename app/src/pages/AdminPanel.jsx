import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import GlobalGoalTable from '../components/GlobalGoaltable';
import UserManagement from '../components/UserManagement';
import UserGoalsManagement from '../components/UserGoalsManagement';
import Navbar from '../components/Navbar';
import Waves from '../components/Waves';
import Loader from '../components/Loader';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // TODO: Fetch statistics from the server
            const response = await axios.get('/admin/stats');
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching statistics');
            setLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'globaleZiele':
                return <GlobalGoalTable />;
            case 'benutzerVerwaltung':
                return <UserManagement />;
            case 'benutzerZiele':
                return <UserGoalsManagement />;
            default:
                return null;
        }
    };

    const renderDashboard = () => {
        if (loading) return <Loader />;
        if (error) return <div className='text-red-500'>{error}</div>;
        if (!stats) return null;

        const chartData = {
            labels: ['Users', 'Global Goals', 'User Goals'],
            datasets: [
                {
                    label: 'Total Count',
                    data: [
                        stats.totalUsers,
                        stats.totalGlobalGoals,
                        stats.totalUserGoals,
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                    ],
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Admin Dashboard Overview',
                },
            },
        };

        return (
            <div className='dashboard'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                    <div className='bg-white p-4 rounded-lg shadow text-center'>
                        <h3 className='font-bold'>Total Users</h3>
                        <p className='text-2xl'>{stats.totalUsers}</p>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow text-center'>
                        <h3 className='font-bold'>Total Global Goals</h3>
                        <p className='text-2xl'>{stats.totalGlobalGoals}</p>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow text-center'>
                        <h3 className='font-bold'>Total User Goals</h3>
                        <p className='text-2xl'>{stats.totalUserGoals}</p>
                    </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className='bg-gray-100 min-h-screen pt-16'>
                <Waves />
                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <h1 className='text-3xl font-bold mb-6 text-center text-blue-600'>
                        Admin Panel
                    </h1>

                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <div className='flex mb-6 overflow-x-auto'>
                            {[
                                'dashboard',
                                'globaleZiele',
                                'benutzerVerwaltung',
                                'benutzerZiele',
                            ].map((tab) => (
                                <button
                                    key={tab}
                                    className={`mr-4 px-4 py-2 rounded-md whitespace-nowrap ${
                                        activeTab === tab
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200'
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() +
                                        tab
                                            .slice(1)
                                            .replace(/([A-Z])/g, ' $1')
                                            .trim()}
                                </button>
                            ))}
                        </div>

                        <div
                            className='overflow-auto'
                            style={{ maxHeight: 'calc(100vh - 250px)' }}
                        >
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;
