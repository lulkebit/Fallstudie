import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import { useToast } from '../context/toastContext';
import { Loader, ChevronDown, ChevronUp } from 'lucide-react';

const PublicGoalTable = () => {
    const { user } = useContext(UserContext);
    const [publicGoals, setPublicGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToast } = useToast();
    const [expandedGoals, setExpandedGoals] = useState({});

    useEffect(() => {
        if (!user) return;

        const fetchPublicGoals = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/goals/friends/${user._id}`);
                setPublicGoals(response.data);
                setLoading(false);
            } catch (error) {
                addToast('Error fetching public goals: ' + error, 'error');
                setError(
                    error.response?.data?.error || 'Error fetching public goals'
                );
                setLoading(false);
            }
        };

        fetchPublicGoals();
    }, [user, addToast]);

    const toggleGoalExpansion = (goalId) => {
        setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
    };

    if (error) {
        return (
            <div className='text-center py-8 text-red-600'>Error: {error}</div>
        );
    }

    const GoalCard = ({ goal }) => {
        const isExpanded = expandedGoals[goal._id];

        return (
            <div className='bg-white rounded-lg shadow-md p-4 transition duration-300 ease-in-out hover:shadow-lg'>
                <div
                    className='flex items-center justify-between mb-2 cursor-pointer'
                    onClick={() => toggleGoalExpansion(goal._id)}
                >
                    <h3 className='text-lg font-semibold text-gray-800'>
                        {goal.title}
                    </h3>
                    <div className='flex items-center'>
                        <span className='text-sm font-medium text-gray-600 mr-2'>
                            {goal.friendName}
                        </span>
                        {isExpanded ? (
                            <ChevronUp size={20} />
                        ) : (
                            <ChevronDown size={20} />
                        )}
                    </div>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2'>
                    <div
                        className='bg-blue-600 h-2.5 rounded-full'
                        style={{ width: `${goal.progress}%` }}
                    ></div>
                </div>
                {isExpanded && (
                    <div className='mt-4 space-y-2'>
                        <p className='text-gray-600'>{goal.description}</p>
                        <p>
                            <strong>Kategorie:</strong> {goal.category}
                        </p>
                        <p>
                            <strong>Zielwert:</strong> {goal.targetValue}{' '}
                            {goal.unit}
                        </p>
                        <p>
                            <strong>Fortschritt:</strong> {goal.progress}%
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className='container mx-auto p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Ziele von Freunden
            </h2>
            <div className='space-y-4'>
                {loading ? (
                    <div className='flex items-center justify-center py-4'>
                        <Loader className='animate-spin mr-2' />
                        <span>Lädt Ziele...</span>
                    </div>
                ) : publicGoals.length > 0 ? (
                    publicGoals.map((goal) => (
                        <GoalCard key={goal._id} goal={goal} />
                    ))
                ) : (
                    <p className='text-gray-600 text-center py-8'>
                        Noch keine öffentlichen Ziele vorhanden.
                    </p>
                )}
            </div>
        </div>
    );
};

export default PublicGoalTable;
