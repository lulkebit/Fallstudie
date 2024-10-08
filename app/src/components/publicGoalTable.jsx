import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import { useToast } from '../context/toastContext';

const PublicGoalTable = () => {
    const { user } = useContext(UserContext);
    const [publicGoals, setPublicGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchPublicGoals = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/goals/friends/${user._id}`);
                setPublicGoals(response.data);
                setLoading(false);
            } catch (error) {
                addToast('Error fetching public goals:', error);
                setError(
                    error.response?.data?.error || 'Error fetching public goals'
                );
                setLoading(false);
            }
        };

        fetchPublicGoals();
    }, [user, addToast]);

    if (loading) {
        return <div className='text-center py-8'>Loading public goals...</div>;
    }

    if (error) {
        return (
            <div className='text-center py-8 text-red-600'>Error: {error}</div>
        );
    }

    return (
        <div className='container mx-auto p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Public Goals of Friends
            </h2>
            <div className='space-y-4'>
                {publicGoals.length > 0 ? (
                    publicGoals.map((goal) => (
                        <div
                            key={goal._id}
                            className='bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg transform hover:scale-[1.02]'
                        >
                            <div className='flex items-center mb-2'>
                                <h3 className='text-xl font-semibold text-gray-800 flex-grow'>
                                    {goal.title}
                                </h3>
                                <span className='text-sm font-medium text-gray-600'>
                                    {goal.friendName}
                                </span>
                            </div>
                            <p className='text-gray-600 mb-4'>
                                {goal.description}
                            </p>
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <p>
                                    <strong>Kategorie:</strong> {goal.category}
                                </p>
                                <p>
                                    <strong>Zielwert:</strong>{' '}
                                    {goal.targetValue} {goal.unit}
                                </p>
                                <p>
                                    <strong>Fortschritt:</strong>{' '}
                                    {goal.progress}%
                                </p>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                                <div
                                    className='bg-blue-600 h-2.5 rounded-full'
                                    style={{ width: `${goal.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-600 text-center py-8'>
                        No public goals from friends to display.
                    </p>
                )}
            </div>
        </div>
    );
};

export default PublicGoalTable;
