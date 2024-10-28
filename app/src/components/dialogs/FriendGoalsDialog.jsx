import React, { useEffect, useState } from 'react';
import {
    Target,
    X,
    Calendar,
    Hash,
    TrendingUp,
    Check,
    ChevronDown,
    User,
} from 'lucide-react';
import axios from 'axios';
import DialogContainer from '../containers/DialogContainer';

const GoalCard = ({ goal }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const progress = goal.progress || 0;

    return (
        <div
            className='bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 
                    group hover:shadow-lg transition-all duration-300'
        >
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <span className='text-base text-gray-400'>
                        {goal.category}
                    </span>
                    <h3 className='text-xl font-medium text-white mt-1'>
                        {goal.title}
                    </h3>
                </div>

                {progress >= 75 ? (
                    <div className='h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center'>
                        <Check className='h-5 w-5 text-green-400' />
                    </div>
                ) : (
                    <div className='h-10 w-10 rounded-xl bg-gray-800/50 flex items-center justify-center'>
                        <TrendingUp className='h-5 w-5 text-gray-300' />
                    </div>
                )}
            </div>

            <div className='relative h-3 bg-gray-800/50 rounded-full mb-4'>
                <div
                    className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] transition-all duration-1000'
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className='flex justify-between text-base mb-4'>
                <span className='text-gray-400'>Fortschritt</span>
                <span className='text-white font-medium'>{progress}%</span>
            </div>

            <div className='grid grid-cols-3 gap-3 mb-4'>
                <div className='bg-gray-800/30 rounded-xl p-3'>
                    <div className='text-gray-400 text-sm mb-1'>Aktuell</div>
                    <div className='text-white text-base font-medium'>
                        {goal.currentValue} {goal.unit}
                    </div>
                </div>
                <div className='bg-gray-800/30 rounded-xl p-3'>
                    <div className='text-gray-400 text-sm mb-1'>Ziel</div>
                    <div className='text-white text-base font-medium'>
                        {goal.targetValue} {goal.unit}
                    </div>
                </div>
                <div className='bg-gray-800/30 rounded-xl p-3'>
                    <div className='text-gray-400 text-sm mb-1'>
                        Verbleibend
                    </div>
                    <div className='text-white text-base font-medium'>
                        {goal.remainingDays || '-'} Tage
                    </div>
                </div>
            </div>

            {goal.description && (
                <>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200'
                    >
                        <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                        <span className='text-base'>
                            {isExpanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                        </span>
                    </button>

                    {isExpanded && (
                        <div className='mt-4 pt-4 border-t border-gray-700/50'>
                            <p className='text-gray-300 text-base leading-relaxed'>
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
        <div className='w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center opacity-50'>
            <Target className='w-10 h-10 text-white' />
        </div>
        <h3 className='text-2xl font-medium text-white mb-3'>
            Keine öffentlichen Ziele
        </h3>
        <p className='text-gray-400 text-lg'>
            Dieser Nutzer hat noch keine Ziele öffentlich geteilt
        </p>
    </div>
);

const LoadingState = () => (
    <div className='flex items-center justify-center py-12'>
        <div className='w-12 h-12 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
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
            <div className='fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-90' />

            {/* Decorative Elements */}
            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div
                className='relative bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-700/50
                          shadow-xl w-full max-w-4xl h-[800px] flex flex-col overflow-hidden'
            >
                {/* Header */}
                <div className='p-6 border-b border-gray-700/50'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <User className='h-6 w-6 text-white' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-white'>
                                    {friendInfo?.username || 'Nutzer'}'s Ziele
                                </h2>
                                <p className='text-lg text-gray-400'>
                                    {goals.length} öffentliche Ziele
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2.5 hover:bg-gray-700/50 rounded-xl transition-colors duration-200'
                        >
                            <X className='h-6 w-6 text-gray-400' />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='flex-1 overflow-y-auto p-6'>
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
                <div className='p-6 border-t border-gray-700/50 bg-gray-800/50'>
                    <button
                        onClick={onClose}
                        className='w-full px-6 py-3 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                 text-white rounded-xl font-medium text-lg
                                 hover:shadow-lg hover:shadow-blue-500/10
                                 transition-all duration-200'
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </DialogContainer>
    );
};

export default FriendGoalsDialog;
