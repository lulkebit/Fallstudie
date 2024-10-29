import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Target, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import PublicGoalTable from '../components/PublicGoaltable';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import KanbanBoard from '../components/KanbanBoard';

const DashboardMetric = ({ title, value, change, icon: Icon }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
        <div className='flex items-center gap-4'>
            <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center flex-shrink-0'>
                <Icon className='h-6 w-6 text-white' />
            </div>
            <div>
                <h3 className='text-sm text-gray-500 dark:text-white/60'>
                    {title}
                </h3>
                <div className='flex items-baseline gap-2'>
                    <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {value}
                    </span>
                    {change && (
                        <span className='text-sm font-medium text-green-500'>
                            +{change}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('private');
    const [metrics, setMetrics] = useState({
        activeGoals: 'Lädt...',
        completedGoals: 'Lädt...',
        communityGoals: 'Lädt...',
        streak: 'Lädt...',
    });
    const { user } = useContext(UserContext);

    const calculateMetrics = useCallback(async () => {
        if (!user?._id) return;

        try {
            // Fetch user's goals
            const { data: goals } = await axios.get('/goals', {
                params: { userId: user._id },
            });

            // Fetch community goals
            const { data: communityGoals } = await axios.get(
                `/goals/friends/${user._id}`
            );

            // Calculate active and completed goals
            const completed = goals.filter(
                (goal) => goal.progress === 100
            ).length;
            const active = goals.filter((goal) => goal.progress < 100).length;

            // Calculate streak (days with continuous goal progress)
            let streak = 0;
            const today = new Date();
            const sortedGoals = goals.sort(
                (a, b) => new Date(b.endDate) - new Date(a.endDate)
            );

            for (const goal of sortedGoals) {
                if (goal.progress > 0 && new Date(goal.endDate) >= today) {
                    streak++;
                } else {
                    break;
                }
            }

            setMetrics({
                activeGoals: active,
                completedGoals: completed,
                communityGoals: communityGoals.length,
                streak: streak,
            });
        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
    }, [user?._id]);

    useEffect(() => {
        calculateMetrics();
    }, [calculateMetrics]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            <Navbar />

            {/* Decorative Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div className='container mx-auto px-4 py-8 relative z-10 pt-24'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-white'>
                        Willkommen zurück!
                    </h1>
                    <p className='text-lg text-gray-600 dark:text-white/70'>
                        Hier ist dein Fortschritt auf einen Blick
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
                    <DashboardMetric
                        title='Aktive Ziele'
                        value={metrics.activeGoals}
                        icon={Target}
                    />
                    <DashboardMetric
                        title='Erreichte Ziele'
                        value={metrics.completedGoals}
                        icon={Target}
                    />
                    <DashboardMetric
                        title='Community Ziele'
                        value={metrics.communityGoals}
                        icon={Users}
                    />
                    <DashboardMetric
                        title='Streak'
                        value={`${metrics.streak} Tage`}
                        icon={Target}
                    />
                </div>

                {/* Main Content */}
                <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-none overflow-hidden'>
                    {/* Tabs */}
                    <div className='flex p-1 gap-1 bg-gray-100/50 dark:bg-white/5 m-6 rounded-xl w-fit'>
                        <button
                            onClick={() => setActiveTab('private')}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === 'private'
                                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-white/70 hover:bg-white/50 dark:hover:bg-white/5'
                            }`}
                        >
                            Meine Ziele
                        </button>
                        <button
                            onClick={() => setActiveTab('public')}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === 'public'
                                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-white/70 hover:bg-white/50 dark:hover:bg-white/5'
                            }`}
                        >
                            Community
                        </button>
                    </div>

                    {/* Content */}
                    <div className='p-6 pt-0'>
                        {activeTab === 'private' ? (
                            <KanbanBoard onGoalsUpdate={calculateMetrics} />
                        ) : (
                            <PublicGoalTable onGoalsUpdate={calculateMetrics} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
