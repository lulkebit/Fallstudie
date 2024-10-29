import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    Users,
    Target,
    Flag,
    ChevronRight,
    TrendingUp,
    UserPlus,
    CheckCircle,
    Trophy,
    Clock,
    CalendarClock,
    UserCheck,
    AlertTriangle,
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GlobalGoalTable from '../components/GlobalGoaltable';
import UserManagement from '../components/UserManagement';
import UserGoalsManagement from '../components/UserGoalsManagement';
import UserGrowthTimeline from '../components/UserGrowthTimeline';
import Navbar from '../components/Navbar';
import { Pie } from 'recharts';
import StatCard from '../components/StatCard';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminMetric = ({
    title,
    value,
    subtitle,
    icon: Icon,
    change,
    trendUp,
}) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
        <div className='flex justify-between items-start mb-4'>
            <div>
                <p className='text-sm text-gray-500 dark:text-white/60'>
                    {title}
                </p>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
                    {value}
                </h3>
                {subtitle && (
                    <p className='text-sm text-gray-500 dark:text-white/60 mt-1'>
                        {subtitle}
                    </p>
                )}
            </div>
            <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center flex-shrink-0'>
                <Icon className='h-6 w-6 text-white' />
            </div>
        </div>
        {change && (
            <div
                className={`flex items-center gap-1 text-sm ${
                    trendUp ? 'text-green-500' : 'text-red-500'
                }`}
            >
                <TrendingUp className={`h-4 w-4 ${!trendUp && 'rotate-180'}`} />
                <span>{change}% im Vergleich zum Vormonat</span>
            </div>
        )}
    </div>
);

const TabButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 
      ${
          active
              ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10'
              : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
    >
        <Icon className='w-5 h-5' />
        {label}
    </button>
);

const UpcomingGoalRow = ({ goal, formatDate }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
        <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
                {goal.avatar ? (
                    <img
                        src={`data:image/jpeg;base64,${goal.avatar}`}
                        alt={goal.username}
                        className='w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-gray-800'
                    />
                ) : (
                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center text-white font-medium'>
                        {goal.username[0]}
                    </div>
                )}
                <div>
                    <h4 className='font-medium text-gray-900 dark:text-white'>
                        {goal.username}
                    </h4>
                    <p className='text-sm text-gray-500 dark:text-white/60'>
                        {goal.title}
                    </p>
                </div>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-white/60'>
                <CalendarClock className='w-4 h-4' />
                {formatDate(goal.endDate)}
            </div>
        </div>
    </div>
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
        if (loading) {
            return (
                <div className='flex items-center justify-center py-12'>
                    <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
                </div>
            );
        }

        if (error) {
            return (
                <div className='text-center py-12'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-red-500/10 flex items-center justify-center'>
                        <AlertTriangle className='w-8 h-8 text-red-500' />
                    </div>
                    <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
                        Ein Fehler ist aufgetreten
                    </h3>
                    <p className='text-gray-500 dark:text-white/60'>{error}</p>
                </div>
            );
        }

        if (!stats) return null;

        return (
            <div className='space-y-8'>
                {/* Metrics Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <AdminMetric
                        title='Gesamtnutzer'
                        value={stats.totalUsers}
                        icon={Users}
                        change='12'
                        trendUp={true}
                    />
                    <AdminMetric
                        title='Aktive Nutzer'
                        value={stats.activeUsers}
                        icon={UserCheck}
                        subtitle='in den letzten 30 Tagen'
                    />
                    <AdminMetric
                        title='Abschlussrate'
                        value={`${stats.completionRate}%`}
                        icon={CheckCircle}
                        change='5'
                        trendUp={true}
                    />
                    <AdminMetric
                        title='Ø Ziele pro Nutzer'
                        value={stats.averageGoalsPerUser}
                        icon={Target}
                    />
                </div>

                {/* Charts Section */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <div>
                                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                                    Nutzerwachstum
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-white/60 mt-1'>
                                    Entwicklung über die letzten 12 Monate
                                </p>
                            </div>
                            <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <TrendingUp className='w-5 h-5 text-white' />
                            </div>
                        </div>
                        <UserGrowthTimeline data={stats.monthlyGrowth} />
                    </div>

                    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <div>
                                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                                    Populärstes Ziel
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-white/60 mt-1'>
                                    {stats.mostPopularGlobalGoal.title}
                                </p>
                            </div>
                            <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <Trophy className='w-5 h-5 text-white' />
                            </div>
                        </div>
                        <div className='grid grid-cols-3 gap-4 mb-6'>
                            <div className='bg-gray-50 dark:bg-white/5 rounded-xl p-4'>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    Teilnehmer
                                </p>
                                <p className='text-xl font-bold text-gray-900 dark:text-white mt-1'>
                                    {
                                        stats.mostPopularGlobalGoal
                                            .participationCount
                                    }
                                </p>
                            </div>
                            <div className='bg-gray-50 dark:bg-white/5 rounded-xl p-4'>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    Fortschritt
                                </p>
                                <p className='text-xl font-bold text-gray-900 dark:text-white mt-1'>
                                    {Math.round(
                                        (stats.mostPopularGlobalGoal
                                            .currentValue /
                                            stats.mostPopularGlobalGoal
                                                .targetValue) *
                                            100
                                    )}
                                    %
                                </p>
                            </div>
                            <div className='bg-gray-50 dark:bg-white/5 rounded-xl p-4'>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    Verbleibend
                                </p>
                                <p className='text-xl font-bold text-gray-900 dark:text-white mt-1'>
                                    {stats.mostPopularGlobalGoal.targetValue -
                                        stats.mostPopularGlobalGoal
                                            .currentValue}{' '}
                                    {stats.mostPopularGlobalGoal.unit}
                                </p>
                            </div>
                        </div>
                        <div className='relative h-40'>
                            <div className='absolute inset-0'>
                                <StatCard
                                    title='Zielfortschritt'
                                    value={`${Math.round(
                                        (stats.mostPopularGlobalGoal
                                            .currentValue /
                                            stats.mostPopularGlobalGoal
                                                .targetValue) *
                                            100
                                    )}%`}
                                    chartData={{
                                        labels: ['Erreicht', 'Verbleibend'],
                                        datasets: [
                                            {
                                                data: [
                                                    stats.mostPopularGlobalGoal
                                                        .currentValue,
                                                    stats.mostPopularGlobalGoal
                                                        .targetValue -
                                                        stats
                                                            .mostPopularGlobalGoal
                                                            .currentValue,
                                                ],
                                                backgroundColor: [
                                                    'rgba(71, 133, 255, 1)',
                                                    'rgba(140, 82, 255, 0.2)',
                                                ],
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                    chartOptions={{
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'bottom',
                                            },
                                            tooltip: {
                                                enabled: true,
                                            },
                                        },
                                        cutout: '70%',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Goals Section */}
                <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <div>
                            <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                                Kommende Ziel-Endtermine
                            </h3>
                            <p className='text-sm text-gray-500 dark:text-white/60 mt-1'>
                                Nächste 7 Tage
                            </p>
                        </div>
                        <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                            <Clock className='w-5 h-5 text-white' />
                        </div>
                    </div>

                    <div className='space-y-4'>
                        {stats.upcomingGoals?.map((goal, index) => (
                            <UpcomingGoalRow
                                key={index}
                                goal={goal}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            <Navbar />

            {/* Decorative Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div className='container mx-auto px-4 py-8 relative z-10 pt-24'>
                {/* Hero Section */}
                <div className='text-center mb-12'>
                    <div className='flex items-center justify-center gap-2 mb-6'>
                        <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                            <LayoutDashboard className='h-6 w-6 text-white' />
                        </div>
                        <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                            Admin Panel
                        </h1>
                    </div>
                    <p className='text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                        Verwalte Benutzer, Ziele und behalte wichtige Metriken
                        im Blick
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className='flex flex-wrap justify-center gap-4 mb-8'>
                    <TabButton
                        active={activeTab === 'dashboard'}
                        icon={LayoutDashboard}
                        label='Dashboard'
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <TabButton
                        active={activeTab === 'globaleZiele'}
                        icon={Target}
                        label='Globale Ziele'
                        onClick={() => setActiveTab('globaleZiele')}
                    />
                    <TabButton
                        active={activeTab === 'benutzerVerwaltung'}
                        icon={Users}
                        label='Benutzerverwaltung'
                        onClick={() => setActiveTab('benutzerVerwaltung')}
                    />
                    <TabButton
                        active={activeTab === 'benutzerZiele'}
                        icon={Flag}
                        label='Benutzerziele'
                        onClick={() => setActiveTab('benutzerZiele')}
                    />
                </div>

                {/* Main Content */}
                <div className='overflow-hidden'>
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'globaleZiele' && (
                        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                            <div className='flex items-center justify-between mb-6'>
                                <div>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                        Globale Ziele verwalten
                                    </h2>
                                    <p className='text-sm text-gray-500 dark:text-white/60 mt-1'>
                                        Erstelle und verwalte gemeinschaftliche
                                        Ziele für alle Nutzer
                                    </p>
                                </div>
                            </div>
                            <GlobalGoalTable />
                        </div>
                    )}
                    {activeTab === 'benutzerVerwaltung' && (
                        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                            <div className='flex items-center justify-between mb-6'>
                                <div>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                        Benutzerverwaltung
                                    </h2>
                                    <p className='text-sm text-gray-500 dark:text-white/60 mt-1'>
                                        Verwalte Benutzerkonten und
                                        Berechtigungen
                                    </p>
                                </div>
                            </div>
                            <UserManagement />
                        </div>
                    )}
                    {activeTab === 'benutzerZiele' && (
                        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                            <div className='flex items-center justify-between mb-6'>
                                <div>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                        Benutzerziele
                                    </h2>
                                    <p className='text-sm text-gray-500 dark:text-white/60 mt-1'>
                                        Überwache und verwalte individuelle
                                        Benutzerziele
                                    </p>
                                </div>
                            </div>
                            <UserGoalsManagement />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
