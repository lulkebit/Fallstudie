import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendGoalsDialog = ({ friendId, onClose }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get(`/goals/friend/${friendId}`);
                setGoals(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Ziele', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [friendId]);

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col'>
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-2xl font-bold text-gray-800'>
                        Öffentliche Ziele
                    </h2>
                </div>

                <div className='flex-grow overflow-y-auto p-6'>
                    {loading ? (
                        <div className='flex items-center justify-center py-8'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                        </div>
                    ) : goals.length === 0 ? (
                        <p className='text-gray-500 text-center py-8'>
                            Keine öffentlichen Ziele gefunden.
                        </p>
                    ) : (
                        <div className='space-y-6'>
                            {goals.map((goal) => (
                                <div
                                    key={goal._id}
                                    className='bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow'
                                >
                                    <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                                        {goal.title}
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        {goal.description}
                                    </p>
                                    <p className='text-sm text-gray-500 mb-4'>
                                        Kategorie: {goal.category}
                                    </p>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm font-medium text-gray-700'>
                                                Fortschritt
                                            </span>
                                            <span className='text-sm font-medium text-gray-700'>
                                                {goal.progress}%
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-200 rounded-full h-2.5'>
                                            <div
                                                className='bg-blue-600 h-2.5 rounded-full'
                                                style={{
                                                    width: `${goal.progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='p-6 border-t border-gray-200'>
                    <button
                        onClick={onClose}
                        className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendGoalsDialog;
