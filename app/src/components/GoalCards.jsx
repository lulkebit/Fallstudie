import React, { useState } from 'react';
import {
    Pin,
    Pencil,
    Trash2,
    TrendingUp,
    Check,
    ChevronDown,
    Users,
} from 'lucide-react';

const GoalCard = ({
    goal,
    onEdit,
    onDelete,
    onPin,
    onParticipate,
    onDragStart,
    onDragEnd,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const progress =
        goal.progress || (goal.currentValue / goal.targetValue) * 100;
    const formattedProgress = Math.min(Math.max(progress, 0), 100);

    const handleParticipate = (e) => {
        if (isCompleted) return;
        e.preventDefault(); // Prevent drag event
        e.stopPropagation(); // Prevent event bubbling
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
    const isCompleted = goal.currentValue >= goal.targetValue;

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className='bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 
                     hover:border-white/40 transition-all duration-200 hover:shadow-md cursor-grab
                     active:cursor-grabbing group'
        >
            <div className='p-4'>
                {/* Header */}
                <div className='flex justify-between items-start mb-2'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                            <span
                                className='px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-[#4785FF]/10 to-[#8c52ff]/10 
                                         text-gray-700 dark:text-white/70'
                            >
                                {goal.category}
                            </span>
                            {goal.isPinned && (
                                <Pin className='h-3 w-3 text-[#4785FF]' />
                            )}
                        </div>
                        <h3 className='text-sm font-medium text-gray-900 dark:text-white line-clamp-2'>
                            {goal.title}
                        </h3>
                    </div>

                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1'>
                        <button
                            onClick={() => onPin(goal)}
                            className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'
                        >
                            <Pin className='h-3 w-3 text-gray-400 dark:text-white/40' />
                        </button>
                        <button
                            onClick={() => onEdit(goal)}
                            className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'
                        >
                            <Pencil className='h-3 w-3 text-gray-400 dark:text-white/40' />
                        </button>
                        <button
                            onClick={() => onDelete(goal.id)}
                            className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'
                        >
                            <Trash2 className='h-3 w-3 text-gray-400 dark:text-white/40' />
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

                {/* Stats and Actions */}
                <div className='flex items-center justify-between mt-3'>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-white/60'>
                            {formattedProgress >= 100 ? (
                                <Check className='h-3 w-3 text-green-500' />
                            ) : (
                                <TrendingUp className='h-3 w-3' />
                            )}
                            <span>{formattedProgress}%</span>
                        </div>
                        <div className='text-xs text-gray-500 dark:text-white/60'>
                            {remainingDays} Tage übrig
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        {goal.description && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60'
                            >
                                <ChevronDown
                                    className={`h-3 w-3 transition-transform duration-200 ${
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
                             ${isCompleted 
                                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                                : 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] hover:shadow-md'}`}
                        >
                            <Users className='h-3 w-3' />
                            <span>Teilnehmen</span>
                        </button>
                    </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className='mt-3 pt-3 border-t border-gray-200/50 dark:border-white/10'>
                        <p className='text-xs text-gray-600 dark:text-white/70 mb-2'>
                            {goal.description}
                        </p>
                        <div className='grid grid-cols-2 gap-2 text-xs'>
                            <div className='text-gray-500 dark:text-white/60'>
                                Start:{' '}
                                {new Date(goal.startDate).toLocaleDateString()}
                            </div>
                            <div className='text-gray-500 dark:text-white/60'>
                                Ende:{' '}
                                {new Date(goal.endDate).toLocaleDateString()}
                            </div>
                            <div className='text-gray-500 dark:text-white/60'>
                                Schrittgröße: {goal.stepSize} {goal.unit}
                            </div>
                            <div className='text-gray-500 dark:text-white/60'>
                                Teilnahmen: {goal.participationCount}x
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalCard;
