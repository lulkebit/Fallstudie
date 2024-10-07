import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useDialog } from '../context/dialogContext';
import ConfirmationDialog from './dialogs/confirmationDialog';
import EditGoalDialog from './dialogs/editGoalDialog';
import { useToast } from '../context/toastContext';

const Table = () => {
    const [dragOverItem, setDragOverItem] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const { user } = useContext(UserContext);
    const { addDialog, removeDialog } = useDialog();
    const { addToast } = useToast();
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        if (user) {
            axios
                .get('/goals', { params: { userId: user._id } })
                .then(({ data }) => setGoals(data))
                .catch((error) =>
                    addToast('Fehler beim Abrufen der Ziele.' + error, 'error')
                );
        }
    }, [user]);

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

    const handleDragStart = (e, index) => {
        setDraggedItem(goals[index]);
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
        e.dataTransfer.setData('text/html', e.target);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverItem(index);
    };

    const handleDragLeave = (e) => {
        setDragOverItem(null);
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        const draggedOverItem = goals[index];

        if (draggedItem === draggedOverItem) {
            return;
        }

        const items = goals.filter((goal) => goal !== draggedItem);
        items.splice(index, 0, draggedItem);

        setGoals(items);
        setDragOverItem(null);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItem(null);
        setDragOverItem(null);
    };

    return (
        <div className='container mx-auto p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-gray-800'>
                    Meine Ziele
                </h1>
                <button
                    onClick={handleAddGoal}
                    className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'
                >
                    + Neues Ziel
                </button>
            </div>
            <div className='space-y-4'>
                {goals.map((goal, index) => (
                    <div
                        key={goal.id}
                        className={`bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg 
                                ${
                                    dragOverItem === index
                                        ? 'border-2 border-blue-500'
                                        : ''
                                }
                                ${
                                    draggedItem === goal
                                        ? 'opacity-50'
                                        : 'opacity-100'
                                }
                                transform hover:scale-[1.02] cursor-move`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <div className='flex items-center mb-2'>
                            <div className='w-6 h-6 mr-3 flex-shrink-0 cursor-move'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M4 6h16M4 12h16M4 18h16'
                                    />
                                </svg>
                            </div>
                            <h2 className='text-xl font-semibold text-gray-800 flex-grow'>
                                {goal.title}
                            </h2>
                        </div>
                        <p className='text-gray-600 mb-4'>{goal.description}</p>
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <p>
                                <strong>Kategorie:</strong> {goal.category}
                            </p>
                            <p>
                                <strong>Start Datum:</strong>{' '}
                                {new Date(goal.startDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>End Datum:</strong>{' '}
                                {new Date(goal.endDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Öffentlich:</strong>{' '}
                                {goal.public ? 'Ja' : 'Nein'}
                            </p>
                            <p>
                                <strong>Zielwert:</strong> {goal.targetValue}{' '}
                                {goal.unit}
                            </p>
                            <p>
                                <strong>Richtung:</strong> {goal.direction}
                            </p>
                            <p>
                                <strong>Erinnerungsintervall:</strong>{' '}
                                {goal.reminderInterval} {goal.reminderType}
                            </p>
                            <p>
                                <strong>Fortschritt:</strong> {goal.progress}%
                            </p>
                        </div>
                        <div className='flex justify-end items-center space-x-2'>
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
        </div>
    );
};

export default Table;
