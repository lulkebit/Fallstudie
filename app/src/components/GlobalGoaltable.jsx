import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDialog } from '../context/DialogContext';
import { useToast } from '../context/ToastContext';
import {
    Goal,
    ChevronDown,
    ChevronUp,
    Plus,
    Target,
    Users,
    TrendingUp,
    Calendar,
    Check,
    ArrowUpDown,
    Loader2,
    Search,
} from 'lucide-react';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import EditGlobalGoalDialog from './dialogs/EditGlobalGoalDialog';

const GlobalGoalCard = React.memo(
    ({ goal, onEdit, onDelete, isExpanded, onToggle }) => {
        const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
        const isCompleted = progressPercentage === 100;

        return (
            <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
                <div className='p-6'>
                    <div className='flex justify-between items-start mb-4'>
                        <div>
                            <span className='text-sm text-gray-500 dark:text-white/60'>
                                {goal.category}
                            </span>
                            <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                                {goal.title}
                            </h3>
                        </div>

                        {isCompleted ? (
                            <div className='h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center'>
                                <Check className='h-5 w-5 text-green-500' />
                            </div>
                        ) : (
                            <div className='h-8 w-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center'>
                                <TrendingUp className='h-5 w-5 text-gray-500 dark:text-white/80' />
                            </div>
                        )}
                    </div>

                    <div className='relative h-2 bg-gray-100 dark:bg-white/10 rounded-full mb-4'>
                        <div
                            className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] transition-all duration-1000'
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    <div className='flex justify-between text-sm mb-4'>
                        <span className='text-gray-500 dark:text-white/60'>
                            Fortschritt
                        </span>
                        <span className='text-gray-900 dark:text-white font-medium'>
                            {Math.round(progressPercentage)}%
                        </span>
                    </div>

                    <div className='grid grid-cols-3 gap-2 mb-4'>
                        <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                            <div className='text-gray-400 dark:text-white/40 text-xs'>
                                Aktuell
                            </div>
                            <div className='text-gray-900 dark:text-white text-sm font-medium'>
                                {goal.currentValue} {goal.unit}
                            </div>
                        </div>
                        <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                            <div className='text-gray-400 dark:text-white/40 text-xs'>
                                Ziel
                            </div>
                            <div className='text-gray-900 dark:text-white text-sm font-medium'>
                                {goal.targetValue} {goal.unit}
                            </div>
                        </div>
                        <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                            <div className='text-gray-400 dark:text-white/40 text-xs'>
                                Teilnehmer
                            </div>
                            <div className='text-gray-900 dark:text-white text-sm font-medium'>
                                {goal.participationCount}
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-white/60'>
                            <Calendar className='w-4 h-4' />
                            <span>
                                {new Date(goal.startDate).toLocaleDateString()}{' '}
                                - {new Date(goal.endDate).toLocaleDateString()}
                            </span>
                        </div>
                        <button
                            onClick={onToggle}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors duration-200'
                        >
                            {isExpanded ? (
                                <ChevronUp className='w-5 h-5 text-gray-400 dark:text-white/40' />
                            ) : (
                                <ChevronDown className='w-5 h-5 text-gray-400 dark:text-white/40' />
                            )}
                        </button>
                    </div>

                    {isExpanded && (
                        <div className='mt-6 pt-6 border-t border-gray-200 dark:border-white/10'>
                            <p className='text-gray-600 dark:text-white/70 mb-6'>
                                {goal.description}
                            </p>

                            <div className='flex justify-end gap-3'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(goal);
                                    }}
                                    className='px-4 py-2 rounded-xl font-medium text-[#4785FF] bg-[#4785FF]/10 
                        hover:bg-[#4785FF]/20 transition-all duration-200'
                                >
                                    Bearbeiten
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(goal._id);
                                    }}
                                    className='px-4 py-2 rounded-xl font-medium text-red-500 bg-red-500/10 
                        hover:bg-red-500/20 transition-all duration-200'
                                >
                                    Löschen
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

const SortButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
      ${
          active
              ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10'
              : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
    >
        <Icon className='w-4 h-4' />
        {label}
        {active && <ArrowUpDown className='w-4 h-4' />}
    </button>
);

const GlobalGoalMetric = ({ title, value, change, icon: Icon }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
        <div className='flex items-center gap-4'>
            <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center flex-shrink-0'>
                <Icon className='h-6 w-6 text-white' />
            </div>
            <div>
                <h3 className='text-sm text-gray-500 dark:text-white/60'>
                    {title}
                </h3>
                <div className='flex items-baseline gap-2'>
                    <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {value}
                    </span>
                    {change && (
                        <span className='text-sm font-medium text-green-500'>
                            +{change}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const GlobalGoalTable = () => {
    const [globalGoals, setGlobalGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');
    const [expandedGoals, setExpandedGoals] = useState({});
    const { addDialog, removeDialog } = useDialog();
    const { addToast } = useToast();

    useEffect(() => {
        fetchGlobalGoals();
    }, []);

    const fetchGlobalGoals = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/global-goals');
            setGlobalGoals(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching global goals:', error);
            addToast(
                'Fehler beim Abrufen der globalen Ziele.' + error,
                'error'
            );
            setLoading(false);
        }
    };

    const handleAddGoal = useCallback(() => {
        addDialog({
            component: EditGlobalGoalDialog,
            props: {
                goal: null,
                onSave: handleSaveGoal,
                onClose: removeDialog,
            },
        });
    }, [addDialog, removeDialog]);

    const handleEditGoal = useCallback(
        (goal) => {
            addDialog({
                component: EditGlobalGoalDialog,
                props: {
                    goal,
                    onSave: handleSaveGoal,
                    onClose: removeDialog,
                },
            });
        },
        [addDialog, removeDialog]
    );

    const handleSaveGoal = useCallback(
        async (formData) => {
            try {
                let response;
                if (formData.id) {
                    response = await axios.put(
                        `/global-goals/${formData.id}`,
                        formData
                    );
                    addToast('Globales Ziel aktualisiert!', 'success');
                } else {
                    response = await axios.post('/global-goals', formData);
                    addToast('Globales Ziel erstellt!', 'success');
                }

                setGlobalGoals((prevGoals) => {
                    if (formData.id) {
                        return prevGoals.map((goal) =>
                            goal._id === formData.id ? response.data : goal
                        );
                    } else {
                        return [...prevGoals, response.data];
                    }
                });

                removeDialog();
            } catch (error) {
                console.error('Error saving global goal:', error);
                addToast(
                    `Fehler beim ${
                        formData.id ? 'Aktualisieren' : 'Erstellen'
                    } des globalen Ziels. Bitte versuchen Sie es erneut.`,
                    'error'
                );
            }
        },
        [addToast, removeDialog]
    );

    const handleDeleteGoal = useCallback(
        (id) => {
            addDialog({
                component: ConfirmationDialog,
                props: {
                    title: 'Ziel löschen',
                    message:
                        'Möchten Sie dieses globale Ziel wirklich löschen?',
                    variant: 'danger',
                    confirmText: 'Löschen',
                    onConfirm: async () => {
                        try {
                            await axios.delete(`/global-goals/${id}`);
                            setGlobalGoals((prevGoals) =>
                                prevGoals.filter((goal) => goal._id !== id)
                            );
                            removeDialog();
                            addToast('Globales Ziel gelöscht!', 'success');
                        } catch (error) {
                            addToast(
                                'Fehler beim Löschen des globalen Ziels. Bitte versuchen Sie es erneut. ' +
                                    error,
                                'error'
                            );
                        }
                    },
                    onClose: removeDialog,
                },
            });
        },
        [addDialog, removeDialog, addToast]
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

    const sortedGoals = React.useMemo(() => {
        return [...globalGoals].sort((a, b) => {
            if (a[sortField] < b[sortField])
                return sortDirection === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField])
                return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [globalGoals, sortField, sortDirection]);

    const toggleGoalExpansion = useCallback((goalId) => {
        setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
    }, []);

    return (
        <div className='space-y-8'>
            {/* Metrics Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <GlobalGoalMetric
                    title='Aktive Ziele'
                    value={globalGoals.length}
                    icon={Target}
                    change={12}
                />
                <GlobalGoalMetric
                    title='Gesamtteilnahmen'
                    value={globalGoals.reduce(
                        (acc, goal) => acc + goal.participationCount,
                        0
                    )}
                    icon={Users}
                />
                <GlobalGoalMetric
                    title='Abgeschlossene Ziele'
                    value={
                        globalGoals.filter(
                            (goal) =>
                                (goal.currentValue / goal.targetValue) * 100 ===
                                100
                        ).length
                    }
                    icon={Check}
                    change={8}
                />
            </div>

            {/* Controls */}
            <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                <div className='flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/40 w-5 h-5' />
                        <input
                            type='text'
                            placeholder='Ziele durchsuchen...'
                            onChange={(e) => {
                                /* TODO: Implement search */
                            }}
                            className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 
                      border border-gray-200 dark:border-white/10
                      focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 
                      transition-all duration-200 outline-none
                      text-gray-900 dark:text-white
                      placeholder:text-gray-400 dark:placeholder:text-white/40'
                        />
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex gap-2'>
                            <SortButton
                                active={sortField === 'title'}
                                icon={Target}
                                label='Nach Titel'
                                onClick={() => handleSort('title')}
                            />
                            <SortButton
                                active={sortField === 'currentValue'}
                                icon={TrendingUp}
                                label='Nach Fortschritt'
                                onClick={() => handleSort('currentValue')}
                            />
                            <SortButton
                                active={sortField === 'participationCount'}
                                icon={Users}
                                label='Nach Teilnahmen'
                                onClick={() => handleSort('participationCount')}
                            />
                        </div>
                        <button
                            onClick={handleAddGoal}
                            className='px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-[#4785FF] to-[#8c52ff]
                     text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                     transition-all duration-200 hover:-translate-y-0.5
                     flex items-center gap-2'
                        >
                            <Plus className='w-4 h-4' />
                            Neues Ziel
                        </button>
                    </div>
                </div>
            </div>

            {/* Goals List */}
            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <div className='flex flex-col items-center gap-4'>
                        <Loader2 className='w-8 h-8 text-[#4785FF] animate-spin' />
                        <p className='text-gray-500 dark:text-white/60'>
                            Ziele werden geladen...
                        </p>
                    </div>
                </div>
            ) : globalGoals.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center opacity-50'>
                        <Target className='w-8 h-8 text-white' />
                    </div>
                    <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
                        Keine globalen Ziele
                    </h3>
                    <p className='text-gray-500 dark:text-white/60'>
                        Erstelle dein erstes globales Ziel für die Community
                    </p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {sortedGoals.map((goal) => (
                        <GlobalGoalCard
                            key={goal._id}
                            goal={goal}
                            onEdit={handleEditGoal}
                            onDelete={handleDeleteGoal}
                            isExpanded={expandedGoals[goal._id]}
                            onToggle={() => toggleGoalExpansion(goal._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GlobalGoalTable;
