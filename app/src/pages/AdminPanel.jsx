import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GlobalGoalTable from '../components/GlobalGoaltable';
import UserManagement from '../components/UserManagement';
import UserGoalsManagement from '../components/UserGoalsManagement';
import Navbar from '../components/Navbar';
import Waves from '../components/Waves';
import Loader from '../components/Loader';

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
                },
                title: {
                    display: true,
                    font: {
                        size: 16,
                    },
                },
            },
        };

        const cardStyle = {
            bg: 'bg-[#F0F4FF]',
            titleText: 'text-gray-600',
            valueText: 'text-[#4785FF]',
            subText: 'text-gray-500',
        };

        return (
            <div className='dashboard'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    <StatCard
                        title='Gesamtnutzer'
                        value={stats.totalUsers}
                        style={cardStyle}
                    />
                    <StatCard
                        title='Aktive Nutzer'
                        value={stats.activeUsers}
                        style={cardStyle}
                    />
                    <StatCard
                        title='Gesamte Ziele'
                        value={stats.totalUserGoals}
                        style={cardStyle}
                    />
                    <StatCard
                        title='Globale Ziele'
                        value={stats.totalGlobalGoals}
                        style={cardStyle}
                    />
                    <StatCard
                        title='Durchschn. Ziele/Nutzer'
                        value={stats.averageGoalsPerUser}
                        style={cardStyle}
                    />
                    <StatCard
                        title='Abschlussrate'
                        value={`${stats.completionRate}%`}
                        style={cardStyle}
                    />
                    <StatCard
                        title='Nutzerwachstum'
                        value={`${stats.userGrowthRate}%`}
                        subvalue='Letzte 30 Tage'
                        style={cardStyle}
                    />

                    {/* Erweiterte Darstellung der kommenden Ziele */}
                    <div
                        className={`${cardStyle.bg} p-4 rounded-lg shadow col-span-2`}
                    >
                        <h3
                            className={`font-bold text-center mb-3 ${cardStyle.titleText}`}
                        >
                            Kommende Ziel-Endtermine
                            <span
                                className={`block text-sm ${cardStyle.subText}`}
                            >
                                Nächste 7 Tage
                            </span>
                        </h3>
                        {stats.upcomingGoals &&
                        stats.upcomingGoals.length > 0 ? (
                            <div className='overflow-auto max-h-60'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='text-left'>
                                            <th className='pb-2'>Nutzer</th>
                                            <th className='pb-2'>Ziel</th>
                                            <th className='pb-2'>Enddatum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.upcomingGoals.map(
                                            (goal, index) => (
                                                <tr
                                                    key={index}
                                                    className='border-t border-gray-200'
                                                >
                                                    <td className='py-2 flex items-center gap-2'>
                                                        <img
                                                            src={`data:image/jpeg;base64,${goal.avatar}`}
                                                            alt='Avatar'
                                                            className='w-8 h-8 rounded-full'
                                                        />
                                                        <span>
                                                            {goal.username}
                                                        </span>
                                                    </td>
                                                    <td className='py-2'>
                                                        {goal.title}
                                                    </td>
                                                    <td className='py-2'>
                                                        {formatDate(
                                                            goal.endDate
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className={`text-center ${cardStyle.subText}`}>
                                Keine anstehenden Ziele in den nächsten 7 Tagen
                            </p>
                        )}
                    </div>

                    <StatCard
                        title='Beliebtestes globales Ziel'
                        value={stats.mostPopularGlobalGoal.title}
                        subvalue={`${stats.mostPopularGlobalGoal.participationCount} Teilnahmen`}
                        chartData={mostPopularGoalData}
                        chartOptions={chartOptions}
                        style={cardStyle}
                    />
                    <div className='bg-[#F0F4FF] p-4 rounded-lg shadow'>
                        <h3 className='font-bold text-center mb-2 text-gray-600'>
                            Zielerfüllung
                        </h3>
                        <div style={{ height: '150px' }}>
                            <Doughnut
                                data={goalCompletionData}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: {
                                            ...chartOptions.plugins.title,
                                            text: 'Zielerfüllung',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const StatCard = ({
        title,
        value,
        subvalue,
        chartData,
        chartOptions,
        style,
    }) => (
        <div className={`${style.bg} p-4 rounded-lg shadow text-center`}>
            <h3 className={`font-bold text-sm ${style.titleText}`}>{title}</h3>
            <p className={`text-2xl font-semibold ${style.valueText}`}>
                {value}
            </p>
            {subvalue && (
                <p className={`text-sm ${style.subText}`}>{subvalue}</p>
            )}
            {chartData && (
                <div style={{ height: '150px', marginTop: '10px' }}>
                    <Pie
                        data={chartData}
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    ...chartOptions.plugins.title,
                                    text: 'Teilnahme',
                                },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );

    return (
        <>
            <Navbar />
            <div className='bg-gray-100 min-h-screen pt-16'>
                <Waves />
                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <h1 className='text-3xl font-bold mb-6 text-center text-[#4785FF]'>
                        Admin Panel
                    </h1>

                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <div className='flex mb-6 overflow-x-auto'>
                            {[
                                ['dashboard', 'Dashboard'],
                                ['globaleZiele', 'Globale Ziele'],
                                ['benutzerVerwaltung', 'Benutzerverwaltung'],
                                ['benutzerZiele', 'Benutzerziele'],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    className={`mr-4 px-4 py-2 rounded-md whitespace-nowrap ${
                                        activeTab === key
                                            ? 'bg-[#4785FF] text-white'
                                            : 'bg-gray-200'
                                    }`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    {label}
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
