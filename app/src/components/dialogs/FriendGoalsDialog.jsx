import React, { useEffect, useState } from 'react';
import { Target, Calendar, Activity, X } from 'lucide-react';
import axios from 'axios';
import DialogContainer from '../containers/DialogContainer';

const LoadingSpinner = () => (
    <div className='flex flex-col items-center justify-center py-12'>
        <div className='w-12 h-12 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin mb-4' />
        <p className='text-gray-500 dark:text-gray-400'>Lade Ziele...</p>
    </div>
);

const FriendGoalsDialog = ({ friendId, friend, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Fetch goals
                const goalsResponse = await axios.get(`/goals/friends/${friendId}`);
                setGoals(goalsResponse.data);
                
            } catch (err) {
                setError('Fehler beim Laden der Ziele');
                console.error('Error fetching goals:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [friendId]);

    const getVariantStyles = () => {
        const styles = {
            default: {
                gradient: 'from-[#4785FF] to-[#8c52ff]',
                glow: 'bg-[#4785FF]/10',
            },
        };
        return styles.default;
    };

    const formatProgress = (goal) => {
        const progress =
            goal.progress || (goal.currentValue / goal.targetValue) * 100;
        return Math.round(Math.min(Math.max(progress, 0), 100));
    };

    const variantStyles = getVariantStyles();

    return (
        <DialogContainer onClose={onClose}>
            <div className='fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-90' />

            {/* Decorative Elements */}
            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div
                    className={`absolute top-1/4 right-1/4 w-96 h-96 ${variantStyles.glow} rounded-full blur-3xl animate-pulse`}
                />
                <div
                    className={`absolute bottom-1/4 left-1/4 w-96 h-96 ${variantStyles.glow} rounded-full blur-3xl animate-pulse delay-1000`}
                />
            </div>

            <div className='relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20 max-w-3xl w-full'>
                {/* Header */}
                <div className='p-6 border-b border-gray-200/50 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            {friend?.avatar ? (
                                <img
                                    src={`data:image/jpeg;base64,${friend.avatar}`}
                                    alt={friend.username}
                                    className='w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-gray-800'
                                />
                            ) : (
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${variantStyles.gradient} flex items-center justify-center`}
                                >
                                    <Target className='w-6 h-6 text-white' />
                                </div>
                            )}
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    {friend
                                        ? `${friend.username}s Ziele`
                                        : 'Ziele laden...'}
                                </h3>
                                {friend && (
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        {friend.username}
                                    </p>
                                )}
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
                <div className='p-6'>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className='text-center py-8'>
                            <Target className='w-12 h-12 mx-auto text-red-400 mb-3' />
                            <p className='text-red-500 dark:text-red-400'>
                                {error}
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-6'>
                            {!goals || goals.length === 0 ? (
                                <div className='text-center py-8'>
                                    <Target className='w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3' />
                                    <p className='text-gray-500 dark:text-gray-400'>
                                        Keine öffentlichen Ziele verfügbar
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    {goals.map((goal) => (
                                        <div
                                            key={goal._id}
                                            className='bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-white/10'
                                        >
                                            {/* Goal Header */}
                                            <div className='flex items-center justify-between mb-4'>
                                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                                    {goal.title}
                                                </h3>
                                                <span
                                                    className={`px-4 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r ${variantStyles.gradient} text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10`}
                                                >
                                                    {goal.category}
                                                </span>
                                            </div>

                                            {/* Goal Progress */}
                                            <div className='mb-6'>
                                                <div className='flex justify-between items-center mb-2'>
                                                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                                                        Fortschritt
                                                    </span>
                                                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                                        {formatProgress(goal)}%
                                                    </span>
                                                </div>
                                                <div className='relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                                                    <div
                                                        className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${variantStyles.gradient} transition-all duration-300`}
                                                        style={{
                                                            width: `${formatProgress(
                                                                goal
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Goal Stats */}
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='flex items-center gap-3 text-gray-600 dark:text-gray-300'>
                                                    <Calendar className='w-5 h-5' />
                                                    <span className='text-sm'>
                                                        {new Date(
                                                            goal.startDate
                                                        ).toLocaleDateString()}{' '}
                                                        -{' '}
                                                        {new Date(
                                                            goal.endDate
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className='flex items-center gap-3 text-gray-600 dark:text-gray-300'>
                                                    <Activity className='w-5 h-5' />
                                                    <span className='text-sm'>
                                                        {goal.currentValue}/
                                                        {goal.targetValue}{' '}
                                                        {goal.unit}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className='flex justify-end p-6 border-t border-gray-200/50 dark:border-white/10'>
                    <button
                        onClick={onClose}
                        className='px-6 py-3 rounded-xl font-medium
                            text-white
                            bg-gradient-to-r from-[#4785FF] to-[#8c52ff]
                            hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20
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
