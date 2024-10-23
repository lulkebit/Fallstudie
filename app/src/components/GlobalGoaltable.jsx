import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDialog } from '../context/DialogContext';
import { useToast } from '../context/ToastContext';
import { Goal, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import EditGlobalGoalDialog from './dialogs/EditGlobalGoalDialog';
import Loader from './Loader';

const GlobalGoalCard = React.memo(
    ({ goal, onEdit, onDelete, isExpanded, onToggle }) => {
        const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
        const getProgressColor = (percentage) => {
            if (percentage === 100) return 'bg-green-500';
            if (percentage >= 75) return 'bg-blue-500';
            if (percentage >= 50) return 'bg-blue-400';
            if (percentage >= 25) return 'bg-blue-300';
            return 'bg-blue-200';
        };

        return (
            <div className='bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl'>
                <div className='p-6 cursor-pointer' onClick={onToggle}>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600'>
                                <Goal className='w-6 h-6' />
                            </div>
                            <h2 className='text-xl font-bold text-gray-800'>
                                {goal.title}
                            </h2>
                        </div>
                        <div className='flex items-center gap-3'>
                            <span className='text-sm font-semibold text-gray-500'>
                                {progressPercentage.toFixed(0)}%
                            </span>
                            {isExpanded ? (
                                <ChevronUp className='w-5 h-5 text-gray-400' />
                            ) : (
                                <ChevronDown className='w-5 h-5 text-gray-400' />
                            )}
                        </div>
                    </div>

                    <div className='relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4'>
                        <div
                            className={`absolute left-0 top-0 h-full transition-all duration-500 ${getProgressColor(
                                progressPercentage
                            )}`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    {isExpanded && (
                        <div className='mt-6 space-y-6'>
                            <p className='text-gray-600'>{goal.description}</p>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div className='bg-gray-50 p-4 rounded-lg'>
                                    <div className='text-sm text-gray-500 mb-1'>
                                        Zeitraum
                                    </div>
                                    <div className='font-medium'>
                                        {new Date(
                                            goal.startDate
                                        ).toLocaleDateString()}{' '}
                                        -
                                        {new Date(
                                            goal.endDate
                                        ).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className='bg-gray-50 p-4 rounded-lg'>
                                    <div className='text-sm text-gray-500 mb-1'>
                                        Fortschritt
                                    </div>
                                    <div className='font-medium'>
                                        {goal.currentValue} / {goal.targetValue}{' '}
                                        {goal.unit}
                                    </div>
                                </div>

                                <div className='bg-gray-50 p-4 rounded-lg'>
                                    <div className='text-sm text-gray-500 mb-1'>
                                        Teilnahmen
                                    </div>
                                    <div className='font-medium'>
                                        {goal.participationCount} Teilnehmer
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-end gap-3 pt-4'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(goal);
                                    }}
                                    className='px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 font-medium'
                                >
                                    Bearbeiten
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(goal._id);
                                    }}
                                    className='px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 font-medium'
                                >
                                    Löschen
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

const GlobalGoalTable = () => {
    const [globalGoals, setGlobalGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');
    const [expandedGoals, setExpandedGoals] = useState({});
    const { addDialog, removeDialog } = useDialog();
    const { addToast } = useToast();

    useEffect(() => {
        fetchGlobalGoals();
    }, []);

    const fetchGlobalGoals = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/global-goals');
            setGlobalGoals(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching global goals:', error);
            addToast(
                'Fehler beim Abrufen der globalen Ziele.' + error,
                'error'
            );
            setLoading(false);
        }
    };

    const handleAddGoal = useCallback(() => {
        addDialog({
            component: EditGlobalGoalDialog,
            props: {
                goal: null,
                onSave: handleSaveGoal,
                onClose: removeDialog,
            },
        });
    }, [addDialog, removeDialog]);

    const handleEditGoal = useCallback(
        (goal) => {
            addDialog({
                component: EditGlobalGoalDialog,
                props: {
                    goal,
                    onSave: handleSaveGoal,
                    onClose: removeDialog,
                },
            });
        },
        [addDialog, removeDialog]
    );

    const handleSaveGoal = useCallback(
        async (formData) => {
            try {
                let response;
                if (formData.id) {
                    response = await axios.put(
                        `/global-goals/${formData.id}`,
                        formData
                    );
                    addToast('Globales Ziel aktualisiert!', 'success');
                } else {
                    response = await axios.post('/global-goals', formData);
                    addToast('Globales Ziel erstellt!', 'success');
                }

                setGlobalGoals((prevGoals) => {
                    if (formData.id) {
                        return prevGoals.map((goal) =>
                            goal._id === formData.id ? response.data : goal
                        );
                    } else {
                        return [...prevGoals, response.data];
                    }
                });

                removeDialog();
            } catch (error) {
                console.error('Error saving global goal:', error);
                addToast(
                    `Fehler beim ${
                        formData.id ? 'Aktualisieren' : 'Erstellen'
                    } des globalen Ziels. Bitte versuchen Sie es erneut.`,
                    'error'
                );
            }
        },
        [addToast, removeDialog]
    );

    const handleDeleteGoal = useCallback(
        (id) => {
            addDialog({
                component: ConfirmationDialog,
                props: {
                    message:
                        'Möchten Sie dieses globale Ziel wirklich löschen?',
                    onConfirm: async () => {
                        try {
                            await axios.delete(`/global-goals/${id}`);
                            setGlobalGoals((prevGoals) =>
                                prevGoals.filter((goal) => goal._id !== id)
                            );
                            removeDialog();
                            addToast('Globales Ziel gelöscht!', 'success');
                        } catch (error) {
                            addToast(
                                'Fehler beim Löschen des globalen Ziels. Bitte versuchen Sie es erneut. ' +
                                    error,
                                'error'
                            );
                        }
                    },
                    onClose: removeDialog,
                },
            });
        },
        [addDialog, removeDialog, addToast]
    );

    const handleSort = useCallback((field) => {
        setSortField((prevField) => {
            if (field === prevField) {
                setSortDirection((prevDirection) =>
                    prevDirection === 'asc' ? 'desc' : 'asc'
                );
            } else {
                setSortDirection('asc');
            }
            return field;
        });
    }, []);

    const sortedGoals = React.useMemo(() => {
        return [...globalGoals].sort((a, b) => {
            if (a[sortField] < b[sortField])
                return sortDirection === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField])
                return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [globalGoals, sortField, sortDirection]);

    const toggleGoalExpansion = useCallback((goalId) => {
        setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
    }, []);

    const SortButton = ({ field, children }) => (
        <button
            onClick={() => handleSort(field)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${
                    sortField === field
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
        >
            {children}
            {sortField === field && (
                <span className='ml-2'>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </button>
    );

    return (
        <div className='bg-gray-50 p-6 rounded-xl'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                <h2 className='text-2xl font-bold text-gray-800'>
                    Globale Ziele
                </h2>
                <button
                    onClick={handleAddGoal}
                    className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg 
                             transition-all duration-200 hover:shadow-xl hover:scale-105'
                >
                    + Neues globales Ziel
                </button>
            </div>

            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <Loader />
                </div>
            ) : globalGoals.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Goal className='w-8 h-8 text-gray-400' />
                    </div>
                    <p className='text-gray-500 text-lg'>
                        Noch keine globalen Ziele erstellt.
                    </p>
                </div>
            ) : (
                <>
                    <div className='flex flex-wrap gap-3 mb-6'>
                        <SortButton field='title'>
                            Nach Titel sortieren
                        </SortButton>
                        <SortButton field='currentValue'>
                            Nach Fortschritt sortieren
                        </SortButton>
                        <SortButton field='participationCount'>
                            Nach Teilnahmen sortieren
                        </SortButton>
                    </div>

                    <div className='space-y-4'>
                        {sortedGoals.map((goal) => (
                            <GlobalGoalCard
                                key={goal._id}
                                goal={goal}
                                onEdit={handleEditGoal}
                                onDelete={handleDeleteGoal}
                                isExpanded={expandedGoals[goal._id]}
                                onToggle={() => toggleGoalExpansion(goal._id)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GlobalGoalTable;
