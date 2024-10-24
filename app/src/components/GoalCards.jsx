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
        const progressBarColor =
            goal.progress === 100 ? 'bg-green-500' : 'bg-blue-500';

        return (
            <div
                className={`
            bg-white rounded-xl border border-gray-100
            transition-all duration-200 hover:shadow-md
            ${goal.isPinned ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        `}
            >
                <div className='p-4'>
                    <div className='flex items-center justify-between'>
                        <div
                            className='flex items-center gap-3 flex-1 cursor-pointer'
                            onClick={onToggle}
                        >
                            <div
                                className={`
                            w-10 h-10 rounded-lg flex items-center justify-center
                            ${
                                goal.progress === 100
                                    ? 'bg-green-50'
                                    : 'bg-blue-50'
                            }
                        `}
                            >
                                <Goal
                                    className={`w-5 h-5 ${
                                        goal.progress === 100
                                            ? 'text-green-500'
                                            : 'text-blue-500'
                                    }`}
                                />
                            </div>
                            <div>
                                <h3 className='font-medium text-gray-900'>
                                    {goal.title}
                                </h3>
                                {goal.friendName && (
                                    <p className='text-sm text-gray-500'>
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
                                    p-2 rounded-lg transition-colors duration-200
                                    ${
                                        goal.isPinned
                                            ? 'bg-blue-50 text-blue-500'
                                            : 'hover:bg-gray-100 text-gray-400'
                                    }
                                `}
                                >
                                    <Pin className='w-4 h-4' />
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle();
                                }}
                                className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                            >
                                {isExpanded ? (
                                    <ChevronUp className='w-4 h-4 text-gray-400' />
                                ) : (
                                    <ChevronDown className='w-4 h-4 text-gray-400' />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='mt-4'>
                        <div className='flex justify-between items-center mb-1.5'>
                            <span className='text-sm font-medium text-gray-700'>
                                Fortschritt
                            </span>
                            <span
                                className={`text-sm font-medium ${
                                    goal.progress === 100
                                        ? 'text-green-500'
                                        : 'text-blue-500'
                                }`}
                            >
                                {goal.progress}%
                            </span>
                        </div>
                        <div className='w-full bg-gray-100 rounded-full h-2'>
                            <div
                                className={`${progressBarColor} h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${goal.progress}%` }}
                            />
                        </div>
                    </div>

                    {isExpanded && (
                        <div className='mt-4 space-y-4'>
                            {goal.description && (
                                <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
                                    {goal.description}
                                </p>
                            )}

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-3'>
                                    <div>
                                        <span className='text-xs text-gray-500 block'>
                                            Kategorie
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                            {goal.category}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='text-xs text-gray-500 block'>
                                            Startdatum
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                            {new Date(
                                                goal.startDate
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='text-xs text-gray-500 block'>
                                            Zielwert
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                            {goal.targetValue} {goal.unit}
                                        </span>
                                    </div>
                                    {goal.reminderType && (
                                        <div>
                                            <span className='text-xs text-gray-500 block'>
                                                Erinnerung
                                            </span>
                                            <span className='text-sm text-gray-900'>
                                                {goal.reminderInterval}{' '}
                                                {goal.reminderType}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className='space-y-3'>
                                    <div>
                                        <span className='text-xs text-gray-500 block'>
                                            Richtung
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                            {goal.direction}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='text-xs text-gray-500 block'>
                                            Enddatum
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                            {new Date(
                                                goal.endDate
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='text-xs text-gray-500 block'>
                                            Sichtbarkeit
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                            {goal.public
                                                ? 'Öffentlich'
                                                : 'Privat'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {showActions && (
                                <div className='flex justify-end gap-2 pt-4 mt-4 border-t border-gray-100'>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(goal);
                                        }}
                                        className='px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 
                                             rounded-lg hover:bg-blue-100 transition-colors duration-200'
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(goal.id);
                                        }}
                                        className='px-4 py-2 text-sm font-medium text-red-600 bg-red-50 
                                             rounded-lg hover:bg-red-100 transition-colors duration-200'
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
