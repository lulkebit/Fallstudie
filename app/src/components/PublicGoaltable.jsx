import React, {
    useEffect,
    useState,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Loader, ChevronDown, ChevronUp, Pin } from 'lucide-react';

const GoalCard = React.memo(({ goal, isExpanded, onToggle, onPin }) => {
    const progressBarColor =
        goal.progress === 100 ? 'bg-yellow-500' : 'bg-blue-500';

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-4 transition duration-300 ease-in-out hover:shadow-lg ${
                goal.isPinned ? 'border-2 border-yellow-500' : ''
            }`}
        >
            <div className='flex items-center justify-between mb-2'>
                <div className='flex-grow cursor-pointer' onClick={onToggle}>
                    <h3 className='text-lg font-semibold text-gray-800'>
                        {goal.title}
                    </h3>
                </div>
                <div className='flex items-center'>
                    <button
                        onClick={() => onPin(goal)}
                        className={`mr-2 p-1 rounded-full ${
                            goal.isPinned ? 'bg-yellow-200' : 'bg-gray-200'
                        }`}
                    >
                        <Pin
                            size={16}
                            className={
                                goal.isPinned
                                    ? 'text-yellow-600'
                                    : 'text-gray-600'
                            }
                        />
                    </button>
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
                    className={`${progressBarColor} h-2.5 rounded-full`}
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
});

const usePublicGoals = (user, addToast) => {
    const [publicGoals, setPublicGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPublicGoals = useCallback(async () => {
        if (!user) return;

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
    }, [user, addToast]);

    useEffect(() => {
        fetchPublicGoals();
    }, [fetchPublicGoals]);

    const pinFriendGoal = useCallback(
        async (goalToPin) => {
            try {
                const updatedGoals = publicGoals.map((goal) => ({
                    ...goal,
                    isPinned: goal.id === goalToPin.id ? !goal.isPinned : false,
                }));

                const response = await axios.post('/goals/pin-friend', {
                    userId: user._id,
                    goals: updatedGoals,
                });

                if (response.data) {
                    setPublicGoals(updatedGoals);
                    addToast(
                        goalToPin.isPinned
                            ? 'Goal unpinned successfully'
                            : 'Goal pinned successfully',
                        'success'
                    );
                }
            } catch (error) {
                addToast('Error updating goal pin status: ' + error, 'error');
            }
        },
        [user, addToast, publicGoals]
    );

    return { publicGoals, loading, error, pinFriendGoal };
};

const PublicGoalTable = () => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const { publicGoals, loading, error, pinFriendGoal } = usePublicGoals(
        user,
        addToast
    );
    const [expandedGoals, setExpandedGoals] = useState({});

    const toggleGoalExpansion = useCallback((goalId) => {
        setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
    }, []);

    const sortedGoals = useMemo(() => {
        return [...publicGoals].sort((a, b) => {
            if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
            }
            return 0;
        });
    }, [publicGoals]);

    if (error) {
        return (
            <div className='text-center py-8 text-red-600'>Error: {error}</div>
        );
    }

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
                ) : sortedGoals.length > 0 ? (
                    sortedGoals.map((goal) => (
                        <GoalCard
                            key={`${goal.friendId}-${goal.id}`}
                            goal={goal}
                            isExpanded={
                                expandedGoals[`${goal.friendId}-${goal.id}`]
                            }
                            onToggle={() =>
                                toggleGoalExpansion(
                                    `${goal.friendId}-${goal.id}`
                                )
                            }
                            onPin={pinFriendGoal}
                        />
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
