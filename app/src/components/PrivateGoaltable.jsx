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
import Loader from './Loader';
import { Goal } from 'lucide-react';
import GoalCard from './GoalCards';

const useGoals = (user, addToast) => {
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
                })
                .catch((error) => {
                    addToast('Fehler beim Abrufen der Ziele.' + error, 'error');
                    setLoading(false);
                });
        }
    }, [user, addToast]);

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
                        } des Ziels. Bitte versuchen Sie es erneut.` + error,
                        'error'
                    );
                });
        },
        [goals, user._id, addToast]
    );

    return { goals, setGoals, loading, pinGoal };
};

const Table = () => {
    const { user } = useContext(UserContext);
    const { addDialog, removeDialog } = useDialog();
    const { addToast } = useToast();
    const { goals, setGoals, loading, pinGoal } = useGoals(user, addToast);
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
                        } des Ziels. Bitte versuchen Sie es erneut.` + error,
                        'error'
                    )
                );
        },
        [user._id, addToast, setGoals]
    );

    const handleDeleteGoal = useCallback(
        (id) => {
            addDialog({
                component: ConfirmationDialog,
                props: {
                    message: 'Möchten Sie diesen Eintrag wirklich löschen?',
                    onConfirm: () => {
                        axios
                            .delete(`/goals/${id}`, {
                                data: { userId: user._id },
                            })
                            .then(({ data }) => {
                                setGoals(data);
                                removeDialog(id);
                                addToast('Ziel gelöscht!', 'success');
                            })
                            .catch((error) =>
                                addToast(
                                    'Fehler beim Löschen des Ziels. Bitte versuchen Sie es erneut. ' +
                                        error,
                                    'error'
                                )
                            );
                    },
                    onClose: () => removeDialog(id),
                },
            });
        },
        [addDialog, removeDialog, user._id, addToast, setGoals]
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
            if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
            }
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
        <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row justify-between gap-4'>
                <div className='flex flex-wrap gap-2'>
                    <button
                        onClick={() => handleSort('title')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200
                            ${
                                sortField === 'title'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Nach Titel
                        {sortField === 'title' && (
                            <span className='ml-1'>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => handleSort('progress')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200
                            ${
                                sortField === 'progress'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Nach Fortschritt
                        {sortField === 'progress' && (
                            <span className='ml-1'>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </button>
                </div>
                <button
                    onClick={handleAddGoal}
                    className='px-4 py-2 bg-blue-600 text-white font-medium rounded-lg 
                             shadow-lg hover:bg-blue-700 transition-all duration-200 
                             hover:shadow-xl hover:scale-105'
                >
                    + Neues Ziel
                </button>
            </div>

            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <Loader />
                </div>
            ) : goals.length === 0 ? (
                <div className='text-center py-12'>
                    <Goal className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500 text-lg'>
                        Noch keine Ziele erstellt.
                    </p>
                </div>
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
