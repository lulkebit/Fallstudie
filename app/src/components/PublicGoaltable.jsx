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
import { AlertOctagon, Users } from 'lucide-react';
import Loader from './Loader';
import GoalCard from './GoalCards';

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
            <div className='py-12 text-center'>
                <AlertOctagon className='w-12 h-12 text-red-500 mx-auto mb-4' />
                <p className='text-red-500 text-lg'>{error}</p>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <Loader />
                </div>
            ) : sortedGoals.length === 0 ? (
                <div className='text-center py-12'>
                    <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500 text-lg'>
                        Keine öffentlichen Ziele gefunden
                    </p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {sortedGoals.map((goal) => (
                        <GoalCard
                            key={`${goal.friendId}-${goal.id}`}
                            goal={goal}
                            onPin={pinFriendGoal}
                            isExpanded={
                                expandedGoals[`${goal.friendId}-${goal.id}`]
                            }
                            onToggle={() =>
                                toggleGoalExpansion(
                                    `${goal.friendId}-${goal.id}`
                                )
                            }
                            showActions={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicGoalTable;
