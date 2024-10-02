import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const Table = () => {
    const [goals, setGoals] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            axios
                .get('/goals', { params: { userId: user.id } })
                .then(({ data }) => {
                    setGoals(data);
                })
                .catch((error) => {
                    console.error('Fehler beim Abrufen der Karten:', error);
                });
        }
    }, [user]);

    const handleAddGoal = () => {
        setCurrentGoal(null);
        setNewTitle('');
        setNewDescription('');
        setIsDialogOpen(true);
    };

    const handleEditGoal = (goal) => {
        setCurrentGoal(goal);
        setNewTitle(goal.title);
        setNewDescription(goal.description);
        setIsDialogOpen(true);
    };

    const handleSaveGoal = () => {
        if (currentGoal) {
            // Bearbeiten einer bestehenden Karte
            const updatedGoal = {
                ...currentGoal,
                title: newTitle,
                description: newDescription,
            };
            axios
                .put(`/goals/${currentGoal.id}`, {
                    userId: user.id,
                    goal: updatedGoal,
                })
                .then(({ data }) => {
                    setGoals(data);
                });
        } else {
            // Hinzufügen einer neuen Karte
            const newGoal = {
                id: goals.length + 1,
                title: newTitle,
                description: newDescription,
            };
            axios
                .post('/goals', { userId: user.id, goal: newGoal })
                .then(({ data }) => {
                    setGoals(data);
                });
        }
        setIsDialogOpen(false);
        setCurrentGoal(null);
    };

    const handleDeleteGoal = (id) => {
        if (
            window.confirm(
                'Sind Sie sicher, dass Sie dieses Ziel löschen möchten?'
            )
        ) {
            axios
                .delete(`/goals/${id}`, { data: { userId: user.id } })
                .then(({ data }) => {
                    setGoals(data);
                });
        }
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
        <div className='container mx-auto p-6 bg-gray-100 min-h-screen'>
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

            {isDialogOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md'>
                        <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                            {currentGoal
                                ? 'Ziel bearbeiten'
                                : 'Neues Ziel erstellen'}
                        </h2>
                        <div className='mb-4'>
                            <label
                                htmlFor='title'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Titel
                            </label>
                            <input
                                type='text'
                                id='title'
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Titel eingeben'
                            />
                        </div>
                        <div className='mb-6'>
                            <label
                                htmlFor='description'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Kurzbeschreibung
                            </label>
                            <textarea
                                id='description'
                                value={newDescription}
                                onChange={(e) =>
                                    setNewDescription(e.target.value)
                                }
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                rows='3'
                                placeholder='Kurze Beschreibung eingeben'
                            ></textarea>
                        </div>
                        <div className='flex justify-end space-x-4'>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition duration-300 ease-in-out'
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleSaveGoal}
                                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out'
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
