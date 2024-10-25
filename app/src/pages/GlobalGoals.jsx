import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import {
    Target,
    Users,
    Search,
    ArrowUpDown,
    Check,
    ChevronLeft,
    ChevronRight,
    Globe,
    Award,
    TrendingUp,
} from 'lucide-react';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Waves from '../components/Waves';

const GlobalMetric = ({ title, value, icon: Icon, change }) => (
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

const GlobalGoalCard = ({ goal, onParticipate }) => {
    const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
    const isCompleted = progressPercentage === 100;

    return (
        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <span className='text-sm text-gray-500 dark:text-white/60'>
                        {goal.category}
                    </span>
                    <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                        {goal.title}
                    </h3>
                </div>

                {isCompleted ? (
                    <div className='h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center'>
                        <Check className='h-5 w-5 text-green-500' />
                    </div>
                ) : (
                    <div className='h-8 w-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center'>
                        <TrendingUp className='h-5 w-5 text-gray-500 dark:text-white/80' />
                    </div>
                )}
            </div>

            <p className='text-gray-600 dark:text-white/70 mb-4'>
                {goal.description}
            </p>

            <div className='relative h-2 bg-gray-100 dark:bg-white/10 rounded-full mb-4'>
                <div
                    className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] transition-all duration-1000'
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            <div className='flex justify-between text-sm mb-4'>
                <span className='text-gray-500 dark:text-white/60'>
                    Fortschritt
                </span>
                <span className='text-gray-900 dark:text-white font-medium'>
                    {Math.round(progressPercentage)}%
                </span>
            </div>

            <div className='grid grid-cols-3 gap-2 mb-6'>
                <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                    <div className='text-gray-400 dark:text-white/40 text-xs'>
                        Aktuell
                    </div>
                    <div className='text-gray-900 dark:text-white text-sm font-medium'>
                        {goal.currentValue} {goal.unit}
                    </div>
                </div>
                <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                    <div className='text-gray-400 dark:text-white/40 text-xs'>
                        Ziel
                    </div>
                    <div className='text-gray-900 dark:text-white text-sm font-medium'>
                        {goal.targetValue} {goal.unit}
                    </div>
                </div>
                <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                    <div className='text-gray-400 dark:text-white/40 text-xs'>
                        Teilnehmer
                    </div>
                    <div className='text-gray-900 dark:text-white text-sm font-medium'>
                        {goal.participationCount}
                    </div>
                </div>
            </div>

            <button
                onClick={() => onParticipate(goal._id)}
                disabled={isCompleted}
                className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2
            ${
                isCompleted
                    ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10 transition-all duration-200 hover:-translate-y-0.5'
            }`}
            >
                {isCompleted ? (
                    <>
                        <Check className='w-4 h-4' />
                        Abgeschlossen
                    </>
                ) : (
                    <>
                        <Users className='w-4 h-4' />
                        Teilnehmen
                    </>
                )}
            </button>
        </div>
    );
};

const PaginationButton = ({ onClick, disabled, direction, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className='p-2 rounded-xl border border-gray-200 dark:border-white/10 
               disabled:opacity-50 disabled:cursor-not-allowed 
               hover:bg-gray-50 dark:hover:bg-white/5 
               transition-all duration-200 hover:-translate-y-0.5'
    >
        {children}
    </button>
);

const SortButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
        ${
            active
                ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-md hover:shadow-lg'
                : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
        }`}
    >
        <Icon className='w-4 h-4' />
        {label}
        {active && <ArrowUpDown className='w-4 h-4' />}
    </button>
);

const GlobalGoals = () => {
    const [globalGoals, setGlobalGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('participationCount');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const goalsPerPage = 3;
    const { addToast } = useToast();

    const fetchGlobalGoals = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/global-goals');
            setGlobalGoals(response.data);
        } catch (error) {
            console.error('Error fetching global goals:', error);
            addToast('Fehler beim Abrufen der globalen Ziele.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchGlobalGoals();
    }, [fetchGlobalGoals]);

    useEffect(() => {
        // Reset to first page when search query changes
        setCurrentPage(1);
    }, [searchQuery]);

    const handleParticipate = useCallback(
        async (goalId) => {
            try {
                const response = await axios.post(
                    `/global-goals/participate/${goalId}`
                );
                setGlobalGoals((prevGoals) =>
                    prevGoals.map((goal) =>
                        goal._id === goalId
                            ? { ...goal, ...response.data }
                            : goal
                    )
                );
                addToast(
                    'Erfolgreich am globalen Ziel teilgenommen!',
                    'success'
                );
            } catch (error) {
                console.error('Error participating in global goal:', error);
                addToast('Fehler bei der Teilnahme am globalen Ziel.', 'error');
            }
        },
        [addToast]
    );

    const sortedAndFilteredGoals = globalGoals
        .filter(
            (goal) =>
                goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                goal.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const getValue = (goal) => {
                if (sortBy === 'participationCount')
                    return goal.participationCount;
                return (goal.currentValue / goal.targetValue) * 100;
            };

            const valueA = getValue(a);
            const valueB = getValue(b);
            return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
        });

    const totalPages = Math.ceil(sortedAndFilteredGoals.length / goalsPerPage);
    const paginatedGoals = sortedAndFilteredGoals.slice(
        (currentPage - 1) * goalsPerPage,
        currentPage * goalsPerPage
    );

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
                            <Globe className='h-6 w-6 text-white' />
                        </div>
                        <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                            Globale Ziele
                        </h1>
                    </div>
                    <p className='text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                        Gemeinsam erreichen wir mehr. Nimm an Community-Zielen
                        teil und werde Teil von etwas Größerem.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
                    <GlobalMetric
                        title='Aktive Ziele'
                        value={globalGoals.length}
                        icon={Target}
                        change={12}
                    />
                    <GlobalMetric
                        title='Teilnahmen gesamt'
                        value={globalGoals.reduce(
                            (acc, goal) => acc + goal.participationCount,
                            0
                        )}
                        icon={Users}
                        change={8}
                    />
                    <GlobalMetric
                        title='Abgeschlossene Ziele'
                        value={
                            globalGoals.filter(
                                (goal) =>
                                    (goal.currentValue / goal.targetValue) *
                                        100 ===
                                    100
                            ).length
                        }
                        icon={Award}
                    />
                </div>

                {loading ? (
                    <div className='flex items-center justify-center py-12'>
                        <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {/* Search and Sort Controls */}
                        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                            <div className='flex flex-col md:flex-row gap-4'>
                                <div className='relative flex-1'>
                                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/40 w-5 h-5' />
                                    <input
                                        type='text'
                                        placeholder='Ziele durchsuchen...'
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 
                                 border border-gray-200 dark:border-white/10
                                 focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 
                                 transition-all duration-200 outline-none
                                 text-gray-900 dark:text-white
                                 placeholder:text-gray-400 dark:placeholder:text-white/40'
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <SortButton
                                        active={sortBy === 'participationCount'}
                                        icon={Users}
                                        label='Teilnahmen'
                                        onClick={() => {
                                            setSortBy('participationCount');
                                            setSortOrder((prev) =>
                                                prev === 'asc' ? 'desc' : 'asc'
                                            );
                                        }}
                                    />
                                    <SortButton
                                        active={sortBy === 'progress'}
                                        icon={Target}
                                        label='Fortschritt'
                                        onClick={() => {
                                            setSortBy('progress');
                                            setSortOrder((prev) =>
                                                prev === 'asc' ? 'desc' : 'asc'
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Goals Grid */}
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {paginatedGoals.map((goal) => (
                                <GlobalGoalCard
                                    key={goal._id}
                                    goal={goal}
                                    onParticipate={handleParticipate}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {sortedAndFilteredGoals.length > goalsPerPage && (
                            <div className='flex items-center justify-center gap-4 mt-8'>
                                <PaginationButton
                                    onClick={() =>
                                        setCurrentPage((prev) => prev - 1)
                                    }
                                    disabled={currentPage === 1}
                                    direction='left'
                                >
                                    <ChevronLeft className='w-5 h-5 text-gray-600 dark:text-white/70' />
                                </PaginationButton>
                                <span className='text-sm font-medium text-gray-600 dark:text-white/70'>
                                    Seite {currentPage} von {totalPages}
                                </span>
                                <PaginationButton
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    direction='right'
                                >
                                    <ChevronRight className='w-5 h-5 text-gray-600 dark:text-white/70' />
                                </PaginationButton>
                            </div>
                        )}

                        {/* Empty State */}
                        {sortedAndFilteredGoals.length === 0 && (
                            <div className='text-center py-12'>
                                <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center opacity-50'>
                                    <Search className='w-8 h-8 text-white' />
                                </div>
                                <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
                                    Keine Ziele gefunden
                                </h3>
                                <p className='text-gray-500 dark:text-white/60'>
                                    Versuche es mit anderen Suchbegriffen
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalGoals;
