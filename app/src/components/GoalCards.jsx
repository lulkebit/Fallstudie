import React from 'react';
import {
    Pin,
    Pencil,
    Trash2,
    ChevronDown,
    Check,
    TrendingUp,
} from 'lucide-react';

const GoalCard = ({
    goal,
    onEdit,
    onDelete,
    onPin,
    isExpanded,
    onToggle,
    showActions = true,
}) => {
    const progress = goal.progress || 0;

    return (
        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 hover:shadow-lg transition-all duration-300 group'>
            <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                    <div>
                        <div className='flex items-center gap-2 mb-2'>
                            <span className='text-sm text-gray-500 dark:text-white/60'>
                                {goal.category}
                            </span>
                            {goal.public && (
                                <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white'>
                                    Öffentlich
                                </span>
                            )}
                        </div>
                        <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                            {goal.title}
                        </h3>
                    </div>

                    <div className='flex items-center gap-2'>
                        {progress >= 75 ? (
                            <div className='h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center'>
                                <Check className='h-5 w-5 text-green-500' />
                            </div>
                        ) : (
                            <div className='h-8 w-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center'>
                                <TrendingUp className='h-5 w-5 text-gray-500 dark:text-white/80' />
                            </div>
                        )}

                        {showActions && (
                            <div className='flex items-center gap-1'>
                                <button
                                    onClick={() => onPin(goal)}
                                    className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200'
                                >
                                    <Pin
                                        className={`h-4 w-4 ${
                                            goal.isPinned
                                                ? 'text-[#4785FF]'
                                                : 'text-gray-400 dark:text-white/40'
                                        }`}
                                    />
                                </button>
                                <button
                                    onClick={() => onEdit(goal)}
                                    className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200'
                                >
                                    <Pencil className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                </button>
                                <button
                                    onClick={() => onDelete(goal.id)}
                                    className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200'
                                >
                                    <Trash2 className='h-4 w-4 text-gray-400 dark:text-white/40' />
                                </button>
                            </div>
                        )}
                    </div>
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

                <div className='grid grid-cols-3 gap-2'>
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
                    <button
                        onClick={onToggle}
                        className='mt-4 flex items-center gap-2 text-gray-500 dark:text-white/60 text-sm hover:text-gray-700 dark:hover:text-white/80 transition-colors duration-200'
                    >
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                        {isExpanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                    </button>
                )}

                {isExpanded && (
                    <div className='mt-4 pt-4 border-t border-gray-200 dark:border-white/10'>
                        <p className='text-gray-600 dark:text-white/70'>
                            {goal.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalCard;
