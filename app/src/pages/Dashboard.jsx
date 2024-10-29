import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Target, Users, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import PublicGoalTable from '../components/PublicGoaltable';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import KanbanBoard from '../components/KanbanBoard';

const LoadingValue = () => (
    <div className='flex items-center gap-2'>
        <Loader2 className='w-4 h-4 animate-spin text-gray-400' />
        <span className='text-gray-400'>Wird geladen...</span>
    </div>
);

const DashboardMetric = ({ title, value, change, icon: Icon, isLoading }) => (
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
                    {isLoading ? (
                        <LoadingValue />
                    ) : (
                        <>
                            <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                                {value}
                            </span>
                            {change && (
                                <span className='text-sm font-medium text-green-500'>
                                    +{change}%
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('private');
    const [metrics, setMetrics] = useState({
        activeGoals: 0,
        completedGoals: 0,
        communityGoals: 0,
        streak: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const { addToast } = useToast();

    const calculateMetrics = useCallback(async () => {
        if (!user?._id) return;

        setIsLoading(true);

        try {
            // Fetch user's goals
            const { data: goals } = await axios.get('/goals', {
                params: { userId: user._id },
            });

            // Fetch community goals
            const { data: communityGoals } = await axios.get(
                `/goals/friends/${user._id}`
            );

            // Calculate active and completed goals based on progress
            const completed = goals.filter((goal) => {
                const progress =
                    goal.progress ||
                    (goal.currentValue / goal.targetValue) * 100;
                return progress === 100;
            }).length;

            const active = goals.filter((goal) => {
                const progress =
                    goal.progress ||
                    (goal.currentValue / goal.targetValue) * 100;
                return progress < 100;
            }).length;

            // Calculate streak (days with continuous goal progress)
            let streak = 0;
            const today = new Date();

            // Sort goals by lastUpdate date in descending order
            const sortedGoals = goals
                .filter((goal) => goal.lastUpdate)
                .sort(
                    (a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate)
                );

            if (sortedGoals.length > 0) {
                const twentyFourHours = 24 * 60 * 60 * 1000;
                let lastDate = today;

                for (const goal of sortedGoals) {
                    const goalDate = new Date(goal.lastUpdate);
                    const timeDiff = lastDate - goalDate;

                    if (timeDiff <= twentyFourHours) {
                        streak++;
                        lastDate = new Date(
                            lastDate.getTime() - twentyFourHours
                        );
                    } else {
                        break;
                    }
                }
            }

            setMetrics({
                activeGoals: active,
                completedGoals: completed,
                communityGoals: communityGoals.length,
                streak: streak,
            });
        } catch (error) {
            addToast(
                'Fehler beim Laden der Metriken. Bitte versuchen Sie es später erneut.',
                'error'
            );
            setMetrics({
                activeGoals: 0,
                completedGoals: 0,
                communityGoals: 0,
                streak: 0,
            });
        } finally {
            setIsLoading(false);
        }
    }, [user?._id, addToast]);

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
                        isLoading={isLoading}
                    />
                    <DashboardMetric
                        title='Erreichte Ziele'
                        value={metrics.completedGoals}
                        icon={Target}
                        isLoading={isLoading}
                    />
                    <DashboardMetric
                        title='Community Ziele'
                        value={metrics.communityGoals}
                        icon={Users}
                        isLoading={isLoading}
                    />
                    <DashboardMetric
                        title='Streak'
                        value={`${metrics.streak} Tage`}
                        icon={Target}
                        isLoading={isLoading}
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
