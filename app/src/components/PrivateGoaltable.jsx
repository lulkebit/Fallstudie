import React, {
    useState,
    useContext,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useDialog } from '../context/DialogContext';
import { useToast } from '../context/ToastContext';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import EditGoalDialog from './dialogs/EditGoalDialog';
import { Goal, ArrowUpDown } from 'lucide-react';
import GoalCard from './GoalCards';

const useGoals = (user, addToast, onGoalsUpdate) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            axios
                .get('/goals', { params: { userId: user._id } })
                .then(({ data }) => {
                    setGoals(data);
                    setLoading(false);
                    if (onGoalsUpdate) onGoalsUpdate();
                })
                .catch((error) => {
                    addToast('Fehler beim Abrufen der Ziele.' + error, 'error');
                    setLoading(false);
                });
        }
    }, [user, addToast, onGoalsUpdate]);

    const pinGoal = useCallback(
        (goalToPin) => {
            const updatedGoals = goals.map((goal) => ({
                ...goal,
                isPinned: goal.id === goalToPin.id ? !goal.isPinned : false,
            }));

            axios
                .post(`/goals/pin`, { userId: user._id, goals: updatedGoals })
                .then(({ data }) => {
                    setGoals(data);
                    if (onGoalsUpdate) onGoalsUpdate();
                    addToast(
                        goalToPin.isPinned
                            ? 'Ziel losgelöst!'
                            : 'Ziel angepinnt!',
                        'success'
                    );
                })
                .catch((error) => {
                    console.error('Error pinning goal:', error);
                    addToast(
                        `Fehler beim ${
                            goalToPin.isPinned ? 'Loslösen' : 'Anpinnen'
                        } des Ziels.`,
                        'error'
                    );
                });
        },
        [goals, user._id, addToast, onGoalsUpdate]
    );

    return { goals, setGoals, loading, pinGoal };
};

const SortButton = ({ label, active, direction, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
            ${
                active
                    ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-md hover:shadow-lg'
                    : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
    >
        {label}
        <ArrowUpDown
            className={`w-4 h-4 transition-transform duration-200
            ${active && direction === 'desc' ? 'rotate-180' : ''}`}
        />
    </button>
);

const EmptyState = () => (
    <div className='text-center py-12'>
        <div className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center'>
            <Goal className='w-8 h-8 text-white' />
        </div>
        <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
            Keine Ziele vorhanden
        </h3>
        <p className='text-gray-500 dark:text-white/60'>
            Erstelle dein erstes Ziel, um deinen Fortschritt zu tracken
        </p>
    </div>
);

const LoadingState = () => (
    <div className='flex items-center justify-center py-12'>
        <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin'></div>
    </div>
);

const Table = ({ onGoalsUpdate }) => {
    const { user } = useContext(UserContext);
    const { addDialog, removeDialog } = useDialog();
    const { addToast } = useToast();
    const { goals, setGoals, loading, pinGoal } = useGoals(
        user,
        addToast,
        onGoalsUpdate
    );
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');
    const [expandedGoals, setExpandedGoals] = useState({});

    const handleInputChange = useCallback((updatedGoal) => {
        setGoals((prevState) =>
            prevState.map((goal) =>
                goal._id === updatedGoal._id
                    ? { ...goal, ...updatedGoal }
                    : goal
            )
        );
    }, []);

    const handleAddGoal = useCallback(() => {
        addDialog({
            component: EditGoalDialog,
            props: {
                goal: null,
                onSave: handleSaveGoal,
                onChange: handleInputChange,
                onClose: removeDialog,
            },
        });
    }, [addDialog, removeDialog, handleInputChange]);

    const handleEditGoal = useCallback(
        (goal) => {
            addDialog({
                component: EditGoalDialog,
                props: {
                    goal,
                    onSave: handleSaveGoal,
                    onChange: handleInputChange,
                    onClose: removeDialog,
                },
            });
        },
        [addDialog, removeDialog, handleInputChange]
    );

    const handleSaveGoal = useCallback(
        (currentGoal) => {
            const apiCall = currentGoal.id
                ? axios.put(`/goals/${currentGoal.id}`, {
                      userId: user._id,
                      goal: currentGoal,
                  })
                : axios.post('/goals', { userId: user._id, goal: currentGoal });

            apiCall
                .then(({ data }) => {
                    setGoals(data);
                    if (onGoalsUpdate) onGoalsUpdate();
                    addToast(
                        currentGoal.id
                            ? 'Ziel aktualisiert!'
                            : 'Ziel erstellt!',
                        'success'
                    );
                })
                .catch((error) =>
                    addToast(
                        `Fehler beim ${
                            currentGoal.id ? 'Aktualisieren' : 'Erstellen'
                        } des Ziels.`,
                        'error'
                    )
                );
        },
        [user._id, addToast, setGoals, onGoalsUpdate]
    );

    const handleDeleteGoal = useCallback(
        (id) => {
            addDialog({
                component: ConfirmationDialog,
                props: {
                    title: 'Ziel löschen',
                    message: 'Möchtest du dieses Ziel wirklich löschen?',
                    variant: 'danger',
                    confirmText: 'Löschen',
                    onConfirm: () => {
                        axios
                            .delete(`/goals/${id}`, {
                                data: { userId: user._id },
                            })
                            .then(({ data }) => {
                                setGoals(data);
                                if (onGoalsUpdate) onGoalsUpdate();
                                removeDialog();
                                addToast('Ziel gelöscht!', 'success');
                            })
                            .catch((error) =>
                                addToast(
                                    'Fehler beim Löschen des Ziels.',
                                    'error'
                                )
                            );
                    },
                    onClose: removeDialog,
                },
            });
        },
        [addDialog, removeDialog, user._id, addToast, setGoals, onGoalsUpdate]
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

    const sortedGoals = useMemo(() => {
        return [...goals].sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            if (a[sortField] < b[sortField])
                return sortDirection === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField])
                return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [goals, sortField, sortDirection]);

    const toggleGoalExpansion = useCallback((goalId) => {
        setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
    }, []);

    return (
        <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row justify-between gap-4'>
                <div className='flex flex-wrap gap-2'>
                    <SortButton
                        label='Nach Titel'
                        active={sortField === 'title'}
                        direction={sortDirection}
                        onClick={() => handleSort('title')}
                    />
                    <SortButton
                        label='Nach Fortschritt'
                        active={sortField === 'progress'}
                        direction={sortDirection}
                        onClick={() => handleSort('progress')}
                    />
                </div>
                <button
                    onClick={handleAddGoal}
                    className='px-6 py-2.5 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white font-medium 
                             rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                             transition-all duration-200 hover:-translate-y-0.5'
                >
                    + Neues Ziel
                </button>
            </div>

            {loading ? (
                <LoadingState />
            ) : goals.length === 0 ? (
                <EmptyState />
            ) : (
                <div className='space-y-4'>
                    {sortedGoals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={handleEditGoal}
                            onDelete={handleDeleteGoal}
                            onPin={pinGoal}
                            isExpanded={expandedGoals[goal.id]}
                            onToggle={() => toggleGoalExpansion(goal.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Table;
