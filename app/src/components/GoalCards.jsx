import React from 'react';
import { ChevronDown, ChevronUp, Goal, Pin } from 'lucide-react';

const GoalCard = React.memo(
    ({
        goal,
        onEdit,
        onDelete,
        onPin,
        isExpanded,
        onToggle,
        showActions = true,
    }) => {
        const getProgressColor = (progress) => {
            if (progress === 100) return 'from-green-400 to-green-500';
            if (progress > 75) return 'from-[#4785FF] to-[#8c52ff]';
            return 'from-[#4785FF] to-[#8c52ff] opacity-75';
        };

        return (
            <div
                className={`
                    bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl 
                    border border-gray-200/50 dark:border-white/10 
                    shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-none
                    transition-all duration-200 hover:-translate-y-0.5
                    ${
                        goal.isPinned
                            ? 'ring-2 ring-[#4785FF] dark:ring-[#4785FF]/50'
                            : ''
                    }
                `}
            >
                <div className='p-6'>
                    <div className='flex items-center justify-between'>
                        <div
                            className='flex items-center gap-4 flex-1 cursor-pointer'
                            onClick={onToggle}
                        >
                            <div
                                className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center
                                    bg-gradient-to-br from-[#4785FF] to-[#8c52ff]
                                    ${
                                        goal.progress === 100
                                            ? 'from-green-400 to-green-500'
                                            : ''
                                    }
                                `}
                            >
                                <Goal className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='font-medium text-gray-900 dark:text-white'>
                                    {goal.title}
                                </h3>
                                {goal.friendName && (
                                    <p className='text-sm text-gray-500 dark:text-white/60'>
                                        {goal.friendName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            {onPin && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPin(goal);
                                    }}
                                    className={`
                                        p-2 rounded-xl transition-all duration-200
                                        ${
                                            goal.isPinned
                                                ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-md'
                                                : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-white/40'
                                        }
                                    `}
                                >
                                    <Pin
                                        className={`w-5 h-5 ${
                                            goal.isPinned ? 'fill-current' : ''
                                        }`}
                                    />
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle();
                                }}
                                className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all duration-200'
                            >
                                {isExpanded ? (
                                    <ChevronUp className='w-5 h-5 text-gray-400 dark:text-white/40' />
                                ) : (
                                    <ChevronDown className='w-5 h-5 text-gray-400 dark:text-white/40' />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='mt-6'>
                        <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm font-medium text-gray-600 dark:text-white/70'>
                                Fortschritt
                            </span>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                {goal.progress}%
                            </span>
                        </div>
                        <div className='w-full bg-gray-100 dark:bg-white/10 rounded-full h-2.5'>
                            <div
                                className={`bg-gradient-to-r ${getProgressColor(
                                    goal.progress
                                )} 
                                          h-2.5 rounded-full transition-all duration-500`}
                                style={{ width: `${goal.progress}%` }}
                            />
                        </div>
                    </div>

                    {isExpanded && (
                        <div className='mt-6 space-y-6'>
                            {goal.description && (
                                <div className='bg-gray-50/50 dark:bg-white/5 rounded-xl p-4 border border-gray-100/50 dark:border-white/10'>
                                    <p className='text-sm text-gray-600 dark:text-white/70'>
                                        {goal.description}
                                    </p>
                                </div>
                            )}

                            <div className='grid grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    {[
                                        {
                                            label: 'Kategorie',
                                            value: goal.category,
                                        },
                                        {
                                            label: 'Startdatum',
                                            value: new Date(
                                                goal.startDate
                                            ).toLocaleDateString(),
                                        },
                                        {
                                            label: 'Zielwert',
                                            value: `${goal.targetValue} ${goal.unit}`,
                                        },
                                        goal.reminderType && {
                                            label: 'Erinnerung',
                                            value: `${goal.reminderType}`,
                                        },
                                    ]
                                        .filter(Boolean)
                                        .map((item, index) => (
                                            <div key={index}>
                                                <span className='text-xs text-gray-500 dark:text-white/40 block mb-1'>
                                                    {item.label}
                                                </span>
                                                <span className='text-sm text-gray-900 dark:text-white'>
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                                <div className='space-y-4'>
                                    {[
                                        {
                                            label: 'Richtung',
                                            value: goal.direction,
                                        },
                                        {
                                            label: 'Enddatum',
                                            value: new Date(
                                                goal.endDate
                                            ).toLocaleDateString(),
                                        },
                                        {
                                            label: 'Sichtbarkeit',
                                            value: goal.public
                                                ? 'Öffentlich'
                                                : 'Privat',
                                        },
                                    ].map((item, index) => (
                                        <div key={index}>
                                            <span className='text-xs text-gray-500 dark:text-white/40 block mb-1'>
                                                {item.label}
                                            </span>
                                            <span className='text-sm text-gray-900 dark:text-white'>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {showActions && (
                                <div className='flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-white/10'>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(goal);
                                        }}
                                        className='px-4 py-2 text-sm font-medium text-white
                                                 bg-gradient-to-r from-[#4785FF] to-[#8c52ff]
                                                 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                                 transition-all duration-200 hover:-translate-y-0.5'
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(goal.id);
                                        }}
                                        className='px-4 py-2 text-sm font-medium text-red-600 dark:text-red-500
                                                 bg-red-50 dark:bg-red-500/10 rounded-xl
                                                 hover:bg-red-100 dark:hover:bg-red-500/20
                                                 transition-all duration-200 hover:-translate-y-0.5'
                                    >
                                        Löschen
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

export default GoalCard;
