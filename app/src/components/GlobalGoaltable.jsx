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
        const progressBarColor =
            progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500';

        return (
            <div className='goal-card bg-gray-50 rounded-lg shadow-md p-4 transition duration-300 ease-in-out hover:shadow-lg'>
                <div className='flex items-center justify-between mb-2'>
                    <div
                        className='flex items-center flex-grow cursor-pointer'
                        onClick={onToggle}
                    >
                        <div className='w-6 h-6 mr-3 flex-shrink-0'>
                            <Goal />
                        </div>
                        <h2 className='text-xl font-semibold text-gray-800'>
                            {goal.title}
                        </h2>
                    </div>
                    <div>
                        {isExpanded ? (
                            <ChevronUp size={20} />
                        ) : (
                            <ChevronDown size={20} />
                        )}
                    </div>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2'>
                    <div
                        className={`${progressBarColor} h-2.5 rounded-full`}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                {isExpanded && (
                    <>
                        <p className='text-gray-600 mb-4'>{goal.description}</p>
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <p>
                                <strong>Start:</strong>{' '}
                                {new Date(goal.startDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Ende:</strong>{' '}
                                {new Date(goal.endDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Zielwert:</strong> {goal.targetValue}{' '}
                                {goal.unit}
                            </p>
                            <p>
                                <strong>Aktueller Wert:</strong>{' '}
                                {goal.currentValue} {goal.unit}
                            </p>
                            <p>
                                <strong>Fortschritt:</strong>{' '}
                                {progressPercentage.toFixed(2)}%
                            </p>
                            <p>
                                <strong>Teilnahmen:</strong>{' '}
                                {goal.participationCount}
                            </p>
                        </div>
                        <div className='flex justify-end items-center space-x-2 mt-4'>
                            <button
                                onClick={() => onEdit(goal)}
                                className='bg-blue-100 text-blue-600 hover:bg-blue-200 font-medium py-1 px-3 rounded transition duration-300 ease-in-out'
                            >
                                Bearbeiten
                            </button>
                            <button
                                onClick={() => onDelete(goal._id)}
                                className='bg-red-100 text-red-600 hover:bg-red-200 font-medium py-1 px-3 rounded transition duration-300 ease-in-out'
                            >
                                Löschen
                            </button>
                        </div>
                    </>
                )}
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

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-semibold text-gray-900'>
                    Globale Ziele
                </h2>
                <button
                    onClick={handleAddGoal}
                    className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'
                >
                    + Neues globales Ziel
                </button>
            </div>
            {loading ? (
                <div className='flex items-center justify-center py-4'>
                    <Loader />
                </div>
            ) : globalGoals.length === 0 ? (
                <p className='text-gray-600 text-center py-8'>
                    Noch keine globalen Ziele erstellt.
                </p>
            ) : (
                <div className='space-y-4'>
                    <div className='flex space-x-4 mb-4'>
                        <button
                            onClick={() => handleSort('title')}
                            className='font-medium'
                        >
                            Sortieren nach Titel
                            {sortField === 'title' &&
                                (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSort('currentValue')}
                            className='font-medium'
                        >
                            Sortieren nach Fortschritt
                            {sortField === 'currentValue' &&
                                (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSort('participationCount')}
                            className='font-medium'
                        >
                            Sortieren nach Teilnahmen
                            {sortField === 'participationCount' &&
                                (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
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
            )}
        </div>
    );
};

export default GlobalGoalTable;
