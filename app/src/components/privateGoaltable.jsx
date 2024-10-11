import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useDialog } from '../context/dialogContext';
import ConfirmationDialog from './dialogs/confirmationDialog';
import EditGoalDialog from './dialogs/editGoalDialog';
import { useToast } from '../context/toastContext';
import { Goal, Loader } from 'lucide-react';

const Table = () => {
    const { user } = useContext(UserContext);
    const { addDialog, removeDialog } = useDialog();
    const { addToast } = useToast();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        if (user) {
            setLoading(true);
            axios
                .get('/goals', { params: { userId: user._id } })
                .then(({ data }) => {
                    setGoals(data);
                    setLoading(false);
                })
                .catch((error) => {
                    addToast('Fehler beim Abrufen der Ziele.' + error, 'error');
                    setLoading(false);
                });
        }
    }, [user, addToast]);

    const handleInputChange = (updatedGoal) => {
        setGoals((prevState) =>
            prevState.map((goal) =>
                goal._id === updatedGoal._id
                    ? { ...goal, ...updatedGoal }
                    : goal
            )
        );
    };

    const handleAddGoal = () => {
        addDialog({
            component: EditGoalDialog,
            props: {
                goal: null,
                onSave: handleSaveGoal,
                onChange: handleInputChange,
                onClose: removeDialog,
            },
        });
    };

    const handleEditGoal = (goal) => {
        addDialog({
            component: EditGoalDialog,
            props: {
                goal,
                onSave: handleSaveGoal,
                onChange: handleInputChange,
                onClose: removeDialog,
            },
        });
    };

    const handleSaveGoal = (currentGoal) => {
        if (currentGoal.id) {
            axios
                .put(`/goals/${currentGoal.id}`, {
                    userId: user._id,
                    goal: currentGoal,
                })
                .then(({ data }) => {
                    setGoals(data);
                    addToast('Ziel aktualisiert!', 'success');
                })
                .catch((error) =>
                    addToast(
                        'Fehler beim Aktualisieren des Ziels. Bitte versuchen Sie es erneut.' +
                            error,
                        'error'
                    )
                );
        } else {
            axios
                .post('/goals', { userId: user._id, goal: currentGoal })
                .then(({ data }) => {
                    setGoals(data);
                    addToast('Ziel erstellt!', 'success');
                })
                .catch((error) =>
                    addToast(
                        'Fehler beim Erstellen des Ziels. Bitte versuchen Sie es erneut.' +
                            error,
                        'error'
                    )
                );
        }
    };

    const handleDeleteGoal = (id) => {
        addDialog({
            component: ConfirmationDialog,
            props: {
                message: 'Möchten Sie diesen Eintrag wirklich löschen?',
                onConfirm: () => {
                    axios
                        .delete(`/goals/${id}`, { data: { userId: user._id } })
                        .then(({ data }) => {
                            setGoals(data);
                            removeDialog(id);
                            addToast('Ziel gelöscht!', 'success');
                        })
                        .catch((error) =>
                            addToast(
                                'Fehler beim Löschen des Ziels. Bitte versuchen Sie es erneut.',
                                'error'
                            )
                        );
                },
                onClose: () => removeDialog(id),
            },
        });
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedGoals = [...goals].sort((a, b) => {
        if (a[sortField] < b[sortField])
            return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField])
            return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className='container mx-auto p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>
                    Meine Ziele
                </h2>
                <button
                    onClick={handleAddGoal}
                    className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'
                >
                    + Neues Ziel
                </button>
            </div>
            {loading ? (
                <div className='flex items-center justify-center py-4'>
                    <Loader className='animate-spin mr-2' />
                    <span>Lädt Ziele...</span>
                </div>
            ) : goals.length === 0 ? (
                <p className='text-gray-600 text-center py-8'>
                    Noch keine Ziele erstellt.
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
                            onClick={() => handleSort('progress')}
                            className='font-medium'
                        >
                            Sortieren nach Fortschritt
                            {sortField === 'progress' &&
                                (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                    {sortedGoals.map((goal, index) => (
                        <div
                            key={goal.id}
                            className={
                                'goal-card bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg transform hover:scale-[1.02]'
                            }
                        >
                            <div className='flex items-center mb-2'>
                                <div className='w-6 h-6 mr-3 flex-shrink-0'>
                                    <Goal />
                                </div>
                                <h2 className='text-xl font-semibold text-gray-800 flex-grow'>
                                    {goal.title}
                                </h2>
                            </div>
                            <p className='text-gray-600 mb-4'>
                                {goal.description}
                            </p>
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <p>
                                    <strong>Kategorie:</strong> {goal.category}
                                </p>
                                <p>
                                    <strong>Start Datum:</strong>
                                    {new Date(
                                        goal.startDate
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>End Datum:</strong>
                                    {new Date(
                                        goal.endDate
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Öffentlich:</strong>
                                    {goal.public ? 'Ja' : 'Nein'}
                                </p>
                                <p>
                                    <strong>Zielwert:</strong>
                                    {goal.targetValue} {goal.unit}
                                </p>
                                <p>
                                    <strong>Richtung:</strong> {goal.direction}
                                </p>
                                <p>
                                    <strong>Erinnerungsintervall:</strong>
                                    {goal.reminderInterval} {goal.reminderType}
                                </p>
                                <p>
                                    <strong>Fortschritt:</strong>
                                    {goal.progress}%
                                </p>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4'>
                                <div
                                    className='bg-blue-600 h-2.5 rounded-full'
                                    style={{ width: `${goal.progress}%` }}
                                    role='progressbar'
                                    aria-valuenow={goal.progress}
                                    aria-valuemin='0'
                                    aria-valuemax='100'
                                ></div>
                            </div>
                            <div className='flex justify-end items-center space-x-2 mt-4'>
                                <button
                                    onClick={() => handleEditGoal(goal)}
                                    className='bg-blue-100 text-blue-600 hover:bg-blue-200 font-medium py-1 px-3 rounded transition duration-300 ease-in-out'
                                >
                                    Bearbeiten
                                </button>
                                <button
                                    onClick={() => handleDeleteGoal(goal.id)}
                                    className='bg-red-100 text-red-600 hover:bg-red-200 font-medium py-1 px-3 rounded transition duration-300 ease-in-out'
                                >
                                    Löschen
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Table;
