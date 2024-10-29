import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { useDialog } from '../context/DialogContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import EditGoalDialog from './dialogs/EditGoalDialog';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import GoalCard from './GoalCards';

const KanbanColumn = ({ title, goals = [], onDrop, children }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsOver(false);
        onDrop(e);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] flex flex-col rounded-xl ${
                isOver ? 'bg-[#4785FF]/5' : 'bg-gray-50/50 dark:bg-white/5'
            } backdrop-blur-sm transition-colors duration-200`}
        >
            <div className='p-4 border-b border-white/20'>
                <h2 className='text-sm font-medium text-gray-900 dark:text-white flex items-center justify-between'>
                    {title}
                    <span className='text-xs text-gray-500 dark:text-white/60'>
                        {goals.length} Ziele
                    </span>
                </h2>
            </div>
            <div className='p-4 flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]'>
                {goals.map((goal) => children(goal))}
            </div>
        </div>
    );
};

const KanbanBoard = ({ onGoalsUpdate }) => {
    const { user } = useContext(UserContext);
    const { addDialog, removeDialog } = useDialog();
    const { addToast } = useToast();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedGoal, setDraggedGoal] = useState(null);

    // Fetch goals
    const fetchGoals = useCallback(async () => {
        if (!user?._id) return;

        try {
            const { data } = await axios.get('/goals', {
                params: { userId: user._id },
            });
            setGoals(data);
            setLoading(false);
            if (onGoalsUpdate) onGoalsUpdate();
        } catch (error) {
            addToast('Fehler beim Laden der Ziele: ' + error.message, 'error');
            setLoading(false);
        }
    }, [user, addToast, onGoalsUpdate]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    // Handle goal updates
    const handleSaveGoal = useCallback(
        async (goalData) => {
            try {
                const { data } = goalData.id
                    ? await axios.put(`/goals/${goalData.id}`, {
                          userId: user._id,
                          goal: goalData,
                      })
                    : await axios.post('/goals', {
                          userId: user._id,
                          goal: goalData,
                      });

                setGoals(data);
                if (onGoalsUpdate) onGoalsUpdate();
                addToast(
                    goalData.id ? 'Ziel aktualisiert!' : 'Ziel erstellt!',
                    'success'
                );
                removeDialog();
            } catch (error) {
                addToast('Fehler beim Speichern: ' + error.message, 'error');
            }
        },
        [user._id, addToast, removeDialog, onGoalsUpdate]
    );

    // Handle goal deletion
    const handleDeleteGoal = useCallback(
        (goalId) => {
            addDialog({
                component: ConfirmationDialog,
                props: {
                    title: 'Ziel löschen',
                    message: 'Möchtest du dieses Ziel wirklich löschen?',
                    variant: 'danger',
                    confirmText: 'Löschen',
                    onConfirm: async () => {
                        try {
                            const { data } = await axios.delete(
                                `/goals/${goalId}`,
                                {
                                    data: { userId: user._id },
                                }
                            );
                            setGoals(data);
                            if (onGoalsUpdate) onGoalsUpdate();
                            removeDialog();
                            addToast('Ziel gelöscht!', 'success');
                        } catch (error) {
                            addToast(
                                'Fehler beim Löschen: ' + error.message,
                                'error'
                            );
                        }
                    },
                    onClose: removeDialog,
                },
            });
        },
        [user._id, addDialog, removeDialog, addToast, onGoalsUpdate]
    );

    // Handle pinning goals
    const handlePinGoal = useCallback(
        async (goalToPin) => {
            const updatedGoals = goals.map((goal) => ({
                ...goal,
                isPinned: goal.id === goalToPin.id ? !goal.isPinned : false,
            }));

            try {
                const { data } = await axios.post(`/goals/pin`, {
                    userId: user._id,
                    goals: updatedGoals,
                });
                setGoals(data);
                if (onGoalsUpdate) onGoalsUpdate();
                addToast(
                    goalToPin.isPinned ? 'Ziel losgelöst!' : 'Ziel angepinnt!',
                    'success'
                );
            } catch (error) {
                addToast('Fehler beim Ändern des Pin-Status', 'error');
            }
        },
        [goals, user._id, addToast, onGoalsUpdate]
    );

    // Filter goals by status
    const getColumnGoals = useCallback(
        (status) => {
            return goals.filter((goal) => {
                const progress =
                    goal.progress ||
                    (goal.currentValue / goal.targetValue) * 100;
                switch (status) {
                    case 'new':
                        return progress === 0;
                    case 'in-progress':
                        return progress > 0 && progress < 100;
                    case 'completed':
                        return progress === 100;
                    default:
                        return false;
                }
            });
        },
        [goals]
    );

    // Handle status changes via drag and drop
    const handleStatusChange = useCallback(
        async (goalId, newStatus) => {
            const goal = goals.find((g) => g.id === goalId);
            if (!goal) return;

            let newProgress;
            switch (newStatus) {
                case 'new':
                    newProgress = 0;
                    break;
                case 'in-progress':
                    newProgress = 50;
                    break;
                case 'completed':
                    newProgress = 100;
                    break;
                default:
                    return;
            }

            try {
                const { data } = await axios.put(`/goals/${goalId}`, {
                    userId: user._id,
                    goal: { ...goal, progress: newProgress },
                });
                setGoals(data);
                if (onGoalsUpdate) onGoalsUpdate();
                addToast('Status aktualisiert!', 'success');
            } catch (error) {
                addToast('Fehler beim Aktualisieren des Status', 'error');
            }
        },
        [goals, user._id, addToast, onGoalsUpdate]
    );

    // Handle opening the edit dialog
    const handleAddGoal = useCallback(() => {
        addDialog({
            component: EditGoalDialog,
            props: {
                onSave: handleSaveGoal,
                onClose: removeDialog,
            },
        });
    }, [addDialog, removeDialog, handleSaveGoal]);

    const handleEditGoal = useCallback(
        (goal) => {
            addDialog({
                component: EditGoalDialog,
                props: {
                    goal,
                    onSave: handleSaveGoal,
                    onClose: removeDialog,
                },
            });
        },
        [addDialog, removeDialog, handleSaveGoal]
    );

    const handleParticipate = useCallback(
        async (goalId) => {
            try {
                const { data } = await axios.post(
                    `/goals/participate/${goalId}`,
                    {
                        userId: user._id,
                        goalId,
                    }
                );
                setGoals(data);
                if (onGoalsUpdate) onGoalsUpdate();
                addToast('Teilnahme erfolgreich!', 'success');
            } catch (error) {
                addToast('Fehler bei der Teilnahme: ' + error.message, 'error');
            }
        },
        [user._id, addToast, setGoals, onGoalsUpdate]
    );

    if (loading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
                    Ziele
                </h1>
                <button
                    onClick={handleAddGoal}
                    className='px-4 py-2 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white rounded-xl 
                             text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 
                             hover:-translate-y-0.5 flex items-center gap-2'
                >
                    <Plus className='h-4 w-4' />
                    Neues Ziel
                </button>
            </div>

            <div className='flex gap-6 h-full'>
                <KanbanColumn
                    title='Neu'
                    goals={getColumnGoals('new')}
                    onDrop={() => handleStatusChange(draggedGoal?.id, 'new')}
                >
                    {(goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={() => handleEditGoal(goal)}
                            onDelete={handleDeleteGoal}
                            onPin={handlePinGoal}
                            onParticipate={handleParticipate}
                            onDragStart={() => setDraggedGoal(goal)}
                            onDragEnd={() => setDraggedGoal(null)}
                        />
                    )}
                </KanbanColumn>

                <KanbanColumn
                    title='In Bearbeitung'
                    goals={getColumnGoals('in-progress')}
                    onDrop={() =>
                        handleStatusChange(draggedGoal?.id, 'in-progress')
                    }
                >
                    {(goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={() => handleEditGoal(goal)}
                            onDelete={handleDeleteGoal}
                            onPin={handlePinGoal}
                            onParticipate={handleParticipate}
                            onDragStart={() => setDraggedGoal(goal)}
                            onDragEnd={() => setDraggedGoal(null)}
                        />
                    )}
                </KanbanColumn>

                <KanbanColumn
                    title='Abgeschlossen'
                    goals={getColumnGoals('completed')}
                    onDrop={() =>
                        handleStatusChange(draggedGoal?.id, 'completed')
                    }
                >
                    {(goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={() => handleEditGoal(goal)}
                            onDelete={handleDeleteGoal}
                            onPin={handlePinGoal}
                            onParticipate={handleParticipate}
                            onDragStart={() => setDraggedGoal(goal)}
                            onDragEnd={() => setDraggedGoal(null)}
                        />
                    )}
                </KanbanColumn>
            </div>
        </div>
    );
};

export default KanbanBoard;
