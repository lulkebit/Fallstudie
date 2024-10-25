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
import GoalCard from './GoalCards';

const EmptyState = () => (
    <div className='text-center py-12'>
        <div className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center'>
            <Users className='w-8 h-8 text-white' />
        </div>
        <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
            Keine öffentlichen Ziele
        </h3>
        <p className='text-gray-500 dark:text-white/60'>
            Deine Freunde haben noch keine Ziele geteilt
        </p>
    </div>
);

const LoadingState = () => (
    <div className='flex items-center justify-center py-12'>
        <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin'></div>
    </div>
);

const ErrorState = ({ message }) => (
    <div className='text-center py-12'>
        <div className='bg-red-500/10 dark:bg-red-500/20 w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center'>
            <AlertOctagon className='w-8 h-8 text-red-500' />
        </div>
        <h3 className='text-xl font-medium text-red-500 mb-2'>
            Ein Fehler ist aufgetreten
        </h3>
        <p className='text-gray-500 dark:text-white/60'>{message}</p>
    </div>
);

const PublicGoalTable = ({ onGoalsUpdate }) => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const [publicGoals, setPublicGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedGoals, setExpandedGoals] = useState({});

    const fetchPublicGoals = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await axios.get(`/goals/friends/${user._id}`);
            setPublicGoals(response.data);
            setLoading(false);
            if (onGoalsUpdate) onGoalsUpdate();
        } catch (error) {
            setError(
                error.response?.data?.error || 'Fehler beim Laden der Ziele'
            );
            setLoading(false);
        }
    }, [user, onGoalsUpdate]);

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

                await axios.post('/goals/pin-friend', {
                    userId: user._id,
                    goals: updatedGoals,
                });

                setPublicGoals(updatedGoals);
                if (onGoalsUpdate) onGoalsUpdate();
                addToast(
                    goalToPin.isPinned ? 'Ziel losgelöst!' : 'Ziel angepinnt!',
                    'success'
                );
            } catch (error) {
                addToast('Fehler beim Anpinnen des Ziels.', 'error');
            }
        },
        [user, addToast, publicGoals, onGoalsUpdate]
    );

    const toggleGoalExpansion = useCallback((goalId) => {
        setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
    }, []);

    const sortedGoals = useMemo(() => {
        return [...publicGoals].sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return 0;
        });
    }, [publicGoals]);

    if (error) return <ErrorState message={error} />;
    if (loading) return <LoadingState />;
    if (!sortedGoals.length) return <EmptyState />;

    return (
        <div className='space-y-4'>
            {sortedGoals.map((goal) => (
                <GoalCard
                    key={`${goal.friendId}-${goal.id}`}
                    goal={goal}
                    onPin={pinFriendGoal}
                    isExpanded={expandedGoals[`${goal.friendId}-${goal.id}`]}
                    onToggle={() =>
                        toggleGoalExpansion(`${goal.friendId}-${goal.id}`)
                    }
                    showActions={false}
                />
            ))}
        </div>
    );
};

export default PublicGoalTable;
