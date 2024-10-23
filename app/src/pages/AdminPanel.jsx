import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GlobalGoalTable from '../components/GlobalGoaltable';
import UserManagement from '../components/UserManagement';
import UserGoalsManagement from '../components/UserGoalsManagement';
import UserGrowthTimeline from '../components/UserGrowthTimeline';
import Navbar from '../components/Navbar';
import Waves from '../components/Waves';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';

ChartJS.register(ArcElement, Tooltip, Legend);

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
            const response = await axios.get('/admin/stats');
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Fehler beim Laden der Statistiken: ' + err.message);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const renderDashboard = () => {
        if (loading) return <Loader />;
        if (error) return <div className='text-red-500'>{error}</div>;
        if (!stats) return null;

        const goalCompletionData = {
            labels: ['Abgeschlossene Ziele', 'Laufende Ziele'],
            datasets: [
                {
                    data: [
                        stats.completedUserGoals,
                        stats.totalUserGoals - stats.completedUserGoals,
                    ],
                    backgroundColor: ['#4785FF', '#9EB9FF'],
                    hoverBackgroundColor: ['#3B75E6', '#8AA3E6'],
                },
            ],
        };

        const mostPopularGoalData = {
            labels: [stats.mostPopularGlobalGoal.unit, 'Zielwert'],
            datasets: [
                {
                    data: [
                        stats.mostPopularGlobalGoal.currentValue,
                        stats.mostPopularGlobalGoal.targetValue -
                            stats.mostPopularGlobalGoal.currentValue,
                    ],
                    backgroundColor: ['#4785FF', '#E6ECF8'],
                    hoverBackgroundColor: ['#3B75E6', '#D1D9E6'],
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                        },
                    },
                },
            },
        };

        return (
            <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <StatCard
                        title='Gesamtnutzer'
                        value={stats.totalUsers}
                        highlight={true}
                    />
                    <StatCard title='Aktive Nutzer' value={stats.activeUsers} />
                    <StatCard
                        title='Abschlussrate'
                        value={`${stats.completionRate}%`}
                    />
                    <StatCard
                        title='Durchschn. Ziele/Nutzer'
                        value={stats.averageGoalsPerUser}
                    />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className='bg-white p-6 rounded-xl shadow-lg'>
                        <h3 className='font-bold text-lg mb-4 text-gray-700'>
                            Nutzerwachstum
                        </h3>
                        <UserGrowthTimeline data={stats.monthlyGrowth} />
                    </div>
                    <StatCard
                        title='Beliebtestes globales Ziel'
                        value={stats.mostPopularGlobalGoal.title}
                        highlight={false}
                        goalDetails={{
                            participationCount:
                                stats.mostPopularGlobalGoal.participationCount,
                            currentValue:
                                stats.mostPopularGlobalGoal.currentValue,
                            targetValue:
                                stats.mostPopularGlobalGoal.targetValue,
                            unit: stats.mostPopularGlobalGoal.unit,
                        }}
                        chartData={{
                            labels: ['Aktueller Fortschritt', 'Verbleibend'],
                            datasets: [
                                {
                                    data: [
                                        stats.mostPopularGlobalGoal
                                            .currentValue,
                                        stats.mostPopularGlobalGoal
                                            .targetValue -
                                            stats.mostPopularGlobalGoal
                                                .currentValue,
                                    ],
                                    backgroundColor: ['#4785FF', '#E6ECF8'],
                                    hoverBackgroundColor: [
                                        '#3B75E6',
                                        '#D1D9E6',
                                    ],
                                },
                            ],
                        }}
                        chartOptions={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                legend: {
                                    ...chartOptions.plugins.legend,
                                    labels: {
                                        color: 'white',
                                        font: {
                                            size: 12,
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>

                <div className='bg-white p-6 rounded-xl shadow-lg'>
                    <h3 className='font-bold text-lg mb-4 text-gray-700'>
                        Kommende Ziel-Endtermine
                        <span className='block text-sm font-normal text-gray-500 mt-1'>
                            Nächste 7 Tage
                        </span>
                    </h3>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b border-gray-200'>
                                    <th className='text-left py-3 px-4 font-semibold text-gray-600'>
                                        Nutzer
                                    </th>
                                    <th className='text-left py-3 px-4 font-semibold text-gray-600'>
                                        Ziel
                                    </th>
                                    <th className='text-left py-3 px-4 font-semibold text-gray-600'>
                                        Enddatum
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.upcomingGoals &&
                                    stats.upcomingGoals.map((goal, index) => (
                                        <tr
                                            key={index}
                                            className='hover:bg-gray-50 transition-colors'
                                        >
                                            <td className='py-3 px-4'>
                                                <div className='flex items-center gap-3'>
                                                    <img
                                                        src={`data:image/jpeg;base64,${goal.avatar}`}
                                                        alt='Avatar'
                                                        className='w-8 h-8 rounded-full object-cover'
                                                    />
                                                    <span className='font-medium text-gray-700'>
                                                        {goal.username}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='py-3 px-4 text-gray-600'>
                                                {goal.title}
                                            </td>
                                            <td className='py-3 px-4 text-gray-600'>
                                                {formatDate(goal.endDate)}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-16'>
                <Waves />
                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <h1 className='text-4xl font-bold mb-8 text-center text-gray-800'>
                        Admin Panel
                    </h1>

                    <div className='mb-6 flex gap-2 justify-center'>
                        {[
                            ['dashboard', 'Dashboard'],
                            ['globaleZiele', 'Globale Ziele'],
                            ['benutzerVerwaltung', 'Benutzerverwaltung'],
                            ['benutzerZiele', 'Benutzerziele'],
                        ].map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 
                                    ${
                                        activeTab === key
                                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className='overflow-hidden'>
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'globaleZiele' && <GlobalGoalTable />}
                        {activeTab === 'benutzerVerwaltung' && (
                            <UserManagement />
                        )}
                        {activeTab === 'benutzerZiele' && (
                            <UserGoalsManagement />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;
