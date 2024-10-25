import React, { useEffect, useState } from 'react';
import {
    Target,
    X,
    Calendar,
    Hash,
    TrendingUp,
    Check,
    ChevronDown,
} from 'lucide-react';
import axios from 'axios';
import DialogContainer from '../containers/DialogContainer';

const GoalCard = ({ goal }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const progress = goal.progress || 0;

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

                {progress >= 75 ? (
                    <div className='h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center'>
                        <Check className='h-5 w-5 text-green-500' />
                    </div>
                ) : (
                    <div className='h-8 w-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center'>
                        <TrendingUp className='h-5 w-5 text-gray-500 dark:text-white/80' />
                    </div>
                )}
            </div>

            <div className='relative h-2 bg-gray-100 dark:bg-white/10 rounded-full mb-4'>
                <div
                    className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] transition-all duration-1000'
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className='flex justify-between text-sm mb-4'>
                <span className='text-gray-500 dark:text-white/60'>
                    Fortschritt
                </span>
                <span className='text-gray-900 dark:text-white font-medium'>
                    {progress}%
                </span>
            </div>

            <div className='grid grid-cols-3 gap-2 mb-4'>
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
                        Verbleibend
                    </div>
                    <div className='text-gray-900 dark:text-white text-sm font-medium'>
                        {goal.remainingDays || '-'} Tage
                    </div>
                </div>
            </div>

            {goal.description && (
                <>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className='flex items-center gap-2 text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white/80 transition-colors duration-200'
                    >
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                        {isExpanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                    </button>

                    {isExpanded && (
                        <div className='mt-4 pt-4 border-t border-gray-200 dark:border-white/10'>
                            <p className='text-gray-600 dark:text-white/70'>
                                {goal.description}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const EmptyState = () => (
    <div className='text-center py-12'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center opacity-50'>
            <Target className='w-8 h-8 text-white' />
        </div>
        <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
            Keine öffentlichen Ziele
        </h3>
        <p className='text-gray-500 dark:text-white/60'>
            Dieser Nutzer hat noch keine Ziele öffentlich geteilt
        </p>
    </div>
);

const LoadingState = () => (
    <div className='flex items-center justify-center py-12'>
        <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
    </div>
);

const FriendGoalsDialog = ({ friendId, onClose }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendInfo, setFriendInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [goalsResponse, friendResponse] = await Promise.all([
                    axios.get(`/goals/friend/${friendId}`),
                    axios.get(`/users/${friendId}`),
                ]);
                setGoals(goalsResponse.data);
                setFriendInfo(friendResponse.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [friendId]);

    return (
        <DialogContainer onClose={onClose}>
            <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-none max-w-3xl w-full'>
                {/* Header */}
                <div className='p-6 border-b border-gray-200 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <Target className='h-6 w-6 text-white' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    {friendInfo?.username || 'Nutzer'}'s Ziele
                                </h2>
                                <p className='text-gray-500 dark:text-white/60'>
                                    {goals.length} öffentliche Ziele
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors duration-200'
                        >
                            <X className='h-5 w-5 text-gray-400 dark:text-white/40' />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='p-6 max-h-[calc(80vh-200px)] overflow-y-auto'>
                    {loading ? (
                        <LoadingState />
                    ) : goals.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className='space-y-6'>
                            {goals.map((goal) => (
                                <GoalCard key={goal._id} goal={goal} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5'>
                    <button
                        onClick={onClose}
                        className='w-full px-6 py-2.5 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                     text-white rounded-xl font-medium shadow-lg 
                     hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                     transition-all duration-200 hover:-translate-y-0.5'
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </DialogContainer>
    );
};

export default FriendGoalsDialog;
