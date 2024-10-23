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
} from 'lucide-react';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Waves from '../components/Waves';

const GlobalGoalCard = React.memo(({ goal, onParticipate }) => {
    const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
    const isCompleted = progressPercentage === 100;

    return (
        <div className='bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200'>
            <div className='p-5'>
                <div className='flex items-center gap-3 mb-4'>
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center 
                        ${isCompleted ? 'bg-green-50' : 'bg-blue-50'}`}
                    >
                        <Target
                            className={`w-5 h-5 ${
                                isCompleted ? 'text-green-500' : 'text-blue-500'
                            }`}
                        />
                    </div>
                    <div>
                        <h2 className='font-bold text-gray-900'>
                            {goal.title}
                        </h2>
                        <p className='text-sm text-gray-500'>
                            {goal.participationCount} Teilnahmen
                        </p>
                    </div>
                </div>

                <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4'>
                    {goal.description}
                </p>

                <div className='mb-4'>
                    <div className='flex justify-between items-center mb-1.5'>
                        <span className='text-sm font-medium text-gray-700'>
                            Fortschritt
                        </span>
                        <span
                            className={`text-sm font-medium ${
                                isCompleted ? 'text-green-500' : 'text-blue-500'
                            }`}
                        >
                            {Math.round(progressPercentage)}%
                        </span>
                    </div>
                    <div className='w-full bg-gray-100 rounded-full h-2'>
                        <div
                            className={`${
                                isCompleted ? 'bg-green-500' : 'bg-blue-500'
                            } 
                                    h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-3 mb-4'>
                    <div className='bg-gray-50 p-2 rounded-lg text-center'>
                        <p className='text-xs text-gray-500'>Aktuell</p>
                        <p className='font-medium text-gray-900'>
                            {goal.currentValue} {goal.unit}
                        </p>
                    </div>
                    <div className='bg-gray-50 p-2 rounded-lg text-center'>
                        <p className='text-xs text-gray-500'>Ziel</p>
                        <p className='font-medium text-gray-900'>
                            {goal.targetValue} {goal.unit}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => onParticipate(goal._id)}
                    disabled={isCompleted}
                    className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2
                        ${
                            isCompleted
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200'
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
        </div>
    );
});

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className='flex items-center justify-center gap-4 mt-8'>
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors'
        >
            <ChevronLeft className='w-5 h-5 text-gray-600' />
        </button>
        <span className='text-sm font-medium text-gray-600'>
            Seite {currentPage} von {totalPages}
        </span>
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors'
        >
            <ChevronRight className='w-5 h-5 text-gray-600' />
        </button>
    </div>
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
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-16'>
                <Waves />
                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <h1 className='text-4xl font-bold mb-8 text-center text-gray-800'>
                        Globale Ziele
                    </h1>

                    {loading ? (
                        <div className='flex items-center justify-center py-12'>
                            <Loader />
                        </div>
                    ) : globalGoals.length === 0 ? (
                        <div className='text-center py-12'>
                            <Target className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                            <p className='text-gray-500 text-lg'>
                                Keine globalen Ziele verfügbar.
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-6'>
                            <div className='flex flex-col sm:flex-row gap-4 justify-between'>
                                <div className='relative flex-1 max-w-md'>
                                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                    <input
                                        type='text'
                                        placeholder='Ziele durchsuchen...'
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className='w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                                 transition-all duration-200 outline-none'
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => {
                                            setSortBy('participationCount');
                                            setSortOrder((prev) =>
                                                prev === 'asc' ? 'desc' : 'asc'
                                            );
                                        }}
                                        className={`px-3 py-2 rounded-lg flex items-center gap-2 font-medium
                                            ${
                                                sortBy === 'participationCount'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Users className='w-4 h-4' />
                                        Teilnahmen
                                        {sortBy === 'participationCount' && (
                                            <ArrowUpDown className='w-4 h-4' />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSortBy('progress');
                                            setSortOrder((prev) =>
                                                prev === 'asc' ? 'desc' : 'asc'
                                            );
                                        }}
                                        className={`px-3 py-2 rounded-lg flex items-center gap-2 font-medium
                                            ${
                                                sortBy === 'progress'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Target className='w-4 h-4' />
                                        Fortschritt
                                        {sortBy === 'progress' && (
                                            <ArrowUpDown className='w-4 h-4' />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                {paginatedGoals.map((goal) => (
                                    <GlobalGoalCard
                                        key={goal._id}
                                        goal={goal}
                                        onParticipate={handleParticipate}
                                    />
                                ))}
                            </div>

                            {sortedAndFilteredGoals.length > 0 && (
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}

                            {sortedAndFilteredGoals.length === 0 && (
                                <div className='text-center py-12'>
                                    <Search className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                                    <p className='text-gray-500 text-lg'>
                                        Keine Ziele gefunden.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GlobalGoals;
