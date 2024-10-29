import React, { useState } from 'react';
import {
    Pin,
    Pencil,
    Trash2,
    TrendingUp,
    Check,
    ChevronDown,
    Users,
    Calendar,
    StepForward,
    Activity,
    Eye,
    Target,
    MessageSquare,
} from 'lucide-react';

const GoalCard = ({ goal, onEdit, onDelete, onPin, onParticipate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const progress =
        goal.progress || (goal.currentValue / goal.targetValue) * 100;
    const formattedProgress = Math.round(Math.min(Math.max(progress, 0), 100));

    const handleParticipate = (e) => {
        if (isCompleted) return;
        e.preventDefault();
        e.stopPropagation();
        onParticipate(goal.id);
    };

    const calculateRemainingDays = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const timeDiff = end - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff;
    };

    const remainingDays = calculateRemainingDays(goal.endDate);
    const isCompleted =
        goal.status === 'abgeschlossen' ||
        goal.currentValue >= goal.targetValue;

    return (
        <div
            className='bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 
                     hover:border-white/40 transition-all duration-200 hover:shadow-md group'
        >
            <div className='p-4'>
                {/* Header */}
                <div className='flex justify-between items-start mb-2'>
                    <div className='flex items-start gap-2'>
                        {goal.isPinned && (
                            <Pin className='h-4 w-4 text-[#4785FF] flex-shrink-0 mt-0.5' />
                        )}
                        <h3 className='text-base font-semibold text-gray-900 dark:text-white leading-tight'>
                            {goal.title}
                        </h3>
                    </div>

                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1'>
                        <button
                            onClick={() => onPin(goal)}
                            className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'
                        >
                            <Pin className='h-4 w-4 text-gray-400 dark:text-white/40' />
                        </button>
                        <button
                            onClick={() => onEdit(goal)}
                            className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'
                        >
                            <Pencil className='h-4 w-4 text-gray-400 dark:text-white/40' />
                        </button>
                        <button
                            onClick={() => onDelete(goal.id)}
                            className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'
                        >
                            <Trash2 className='h-4 w-4 text-gray-400 dark:text-white/40' />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className='relative h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden'>
                    <div
                        className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                 transition-all duration-300'
                        style={{ width: `${formattedProgress}%` }}
                    />
                </div>

                {/* Category */}
                <div className='mt-3 flex justify-start'>
                    <span
                        className='px-3 py-1 text-xs font-medium rounded-full 
                                 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                 text-white shadow-sm 
                                 dark:from-[#4785FF]/80 dark:to-[#8c52ff]/80
                                 dark:text-white/90 
                                 transition-all duration-200
                                 hover:shadow-md hover:scale-105'
                    >
                        {goal.category}
                    </span>
                </div>

                {/* Stats */}
                <div className='mt-3 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-white/60'>
                            {formattedProgress >= 100 ? (
                                <Check className='h-4 w-4 text-green-500' />
                            ) : (
                                <TrendingUp className='h-4 w-4' />
                            )}
                            <span>{formattedProgress}%</span>
                        </div>
                        <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-white/60'>
                            <Calendar className='h-4 w-4' />
                            <span>{remainingDays} Tage übrig</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        {goal.description && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60'
                            >
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                        )}
                        <button
                            onClick={handleParticipate}
                            disabled={isCompleted}
                            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium text-white 
                             rounded-lg transition-all duration-200
                             ${
                                 isCompleted
                                     ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                     : 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] hover:shadow-md'
                             }`}
                        >
                            <Users className='h-4 w-4' />
                            <span>Beitragen</span>
                        </button>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className='mt-3 pt-3 border-t border-gray-200/50 dark:border-white/10'>
                        <p className='text-xs text-gray-600 dark:text-white/70 mb-2'>
                            <p className='flex items-center gap-1 text-xs mb-2'>
                                <MessageSquare className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                <span className='text-gray-400 dark:text-white/40'>
                                    Beschreibung:{' '}
                                </span>
                                <span className='text-gray-700 dark:text-white font-medium'>
                                    {goal.description}
                                </span>
                            </p>
                        </p>
                        <div className='grid grid-cols-2 gap-2 text-xs'>
                            <div className='flex items-center gap-1'>
                                <Calendar className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                <span className='text-gray-400 dark:text-white/40'>
                                    Start:{' '}
                                </span>
                                <span className='text-gray-700 dark:text-white font-medium'>
                                    {new Date(
                                        goal.startDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <Calendar className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                <span className='text-gray-400 dark:text-white/40'>
                                    Ende:{' '}
                                </span>
                                <span className='text-gray-700 dark:text-white font-medium'>
                                    {new Date(
                                        goal.endDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <StepForward className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                <span className='text-gray-400 dark:text-white/40'>
                                    Schrittgröße:{' '}
                                </span>
                                <span className='text-gray-700 dark:text-white font-medium'>
                                    {goal.stepSize} {goal.unit}
                                </span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <Activity className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                <span className='text-gray-400 dark:text-white/40'>
                                    Beiträge:{' '}
                                </span>
                                <span className='text-gray-700 dark:text-white font-medium'>
                                    {goal.participationCount}x
                                </span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <Eye className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                <span className='text-gray-400 dark:text-white/40'>
                                    Sichtbarkeit:{' '}
                                </span>
                                <span className='text-gray-700 dark:text-white font-medium'>
                                    {goal.public ? 'Öffentlich' : 'Privat'}
                                </span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <Target className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                <span className='text-gray-400 dark:text-white/40'>
                                    Fortschritt:{' '}
                                </span>
                                <span className='text-gray-700 dark:text-white font-medium'>
                                    {goal.currentValue} / {goal.targetValue}{' '}
                                    {goal.unit}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalCard;
