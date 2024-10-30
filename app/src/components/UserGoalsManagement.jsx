import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Goal,
    Search,
    Clock,
    Users,
    CheckCircle2,
    AlertCircle,
    Target,
    TrendingUp,
    Calendar,
    ChevronDown,
    ChevronUp,
    Pencil,
    Trash2,
    Filter,
    ArrowUpDown,
    Activity,
} from 'lucide-react';
import axios from 'axios';
import { useDialog } from '../context/DialogContext';
import { useToast } from '../context/ToastContext';
import EditGoalDialog from './dialogs/EditGoalDialog';
import ConfirmationDialog from './dialogs/ConfirmationDialog';

const GoalMetric = ({ title, value, subtitle, icon: Icon, change }) => (
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
                {subtitle && (
                    <p className='text-sm text-gray-500 dark:text-white/60'>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    </div>
);

const GoalCard = ({ goal, onEdit, onDelete }) => {
    const progress = Math.round(
        (goal.currentValue / parseFloat(goal.targetValue)) * 100
    );
    const formattedProgress = Math.min(Math.max(progress, 0), 100);

    const remainingDays = useMemo(() => {
        const now = new Date();
        const end = new Date(goal.endDate);
        const timeDiff = end - now;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }, [goal.endDate]);

    return (
        <div
            className='bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 
                     hover:border-white/40 transition-all duration-200 hover:shadow-md'
        >
            <div className='p-4'>
                {/* Header with Friend Info */}
                <div className='flex items-center gap-3 mb-3'>
                    <img
                        src={
                            goal?.user.avatar
                                ? `data:image/jpeg;base64,${goal.user.avatar}`
                                : 'https://api.dicebear.com/6.x/initials/svg?seed=JD'
                        }
                        alt='Profile'
                        className='h-8 w-8 rounded-lg object-cover'
                    />
                    <div>
                        <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                            {goal.user.username || 'Anonym'}
                        </h4>
                        <p className='text-xs text-gray-500 dark:text-white/60'>
                            Ziel erstellt am{' '}
                            {new Date(goal.startDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div className='flex gap-1 ml-auto'>
                        <button
                            onClick={() => onEdit(goal)}
                            className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'
                        >
                            <Pencil className='h-4 w-4 text-gray-400 dark:text-white/40' />
                        </button>
                        <button
                            onClick={() => onDelete(goal.id)}
                            className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'
                        >
                            <Trash2 className='h-4 w-4 text-gray-400 dark:text-white/40' />
                        </button>
                    </div>
                </div>

                {/* Goal Title & Category */}
                <div className='mb-3'>
                    <h3 className='text-base font-medium text-gray-900 dark:text-white mb-2'>
                        {goal.title}
                    </h3>
                    <span
                        className='px-3 py-1 text-xs font-medium rounded-full 
                                 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white'
                    >
                        {goal.category}
                    </span>
                </div>

                {/* Description */}
                <div className='mb-4'>
                    <p className='text-sm text-gray-600 dark:text-white/80'>
                        {goal.description}
                    </p>
                </div>

                {/* Progress Section */}
                <div className='mb-4'>
                    <div className='flex justify-between items-center mb-1'>
                        <span className='text-sm text-gray-600 dark:text-white/80'>
                            Fortschritt
                        </span>
                        <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            {formattedProgress}%
                        </span>
                    </div>
                    <div className='relative h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden'>
                        <div
                            className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                     transition-all duration-300'
                            style={{ width: `${formattedProgress}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-2 gap-3 mb-4'>
                    <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-gray-400 dark:text-white/40' />
                        <span className='text-xs text-gray-600 dark:text-white/80'>
                            {remainingDays} Tage übrig
                        </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Activity className='w-4 h-4 text-gray-400 dark:text-white/40' />
                        <span className='text-xs text-gray-600 dark:text-white/80'>
                            {goal.participationCount || 0} Beiträge
                        </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Target className='w-4 h-4 text-gray-400 dark:text-white/40' />
                        <span className='text-xs text-gray-600 dark:text-white/80'>
                            {goal.currentValue}/{goal.targetValue} {goal.unit}
                        </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-gray-400 dark:text-white/40' />
                        <span className='text-xs text-gray-600 dark:text-white/80'>
                            {new Date(goal.startDate).toLocaleDateString()} -{' '}
                            {new Date(goal.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FilterButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
        ${
            active
                ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg hover:shadow-xl'
                : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
        }`}
    >
        <Icon className='w-4 h-4' />
        {label}
        {active && <ArrowUpDown className='w-4 h-4' />}
    </button>
);

const UserGoalsManagement = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedGoals, setExpandedGoals] = useState({});
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');
    const { addToast } = useToast();
    const { addDialog, removeDialog } = useDialog();

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/goals');
            setGoals(response.data);
        } catch (err) {
            console.error('Error fetching goals:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGoal = useCallback(async (goalData) => {
        try {
            console.log('Goal Data:', goalData);
            console.log('User ID:', goalData.user._id);
            console.log('Goal ID:', goalData.id);
            await axios.put(`/admin/goals/${goalData.id}`, {
                goal: goalData,
                userId: goalData.user._id,
                id: goalData.id,
            });

            fetchGoals();
            addToast('Ziel aktualisiert!', 'success');
            removeDialog();
        } catch (error) {
            addToast('Fehler beim Speichern: ' + error.message, 'error');
        }
    });

    const handleEditGoal = useCallback((goal) => {
        addDialog({
            component: EditGoalDialog,
            props: {
                goal,
                onSave: handleSaveGoal,
                onClose: removeDialog,
            },
        });
    });

    const handleDeleteGoal = useCallback((goalId) => {
        addDialog({
            component: ConfirmationDialog,
            props: {
                title: 'Ziel löschen',
                message: 'Möchtest du dieses Ziel wirklich löschen?',
                variant: 'danger',
                confirmText: 'Löschen',
                onConfirm: async () => {
                    try {
                        await axios.delete(`/admin/goals/${goalId}`);
                        fetchGoals();
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
    });

    const toggleGoalExpansion = (goalId) => {
        setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
    };

    const handleSort = (field) => {
        setSortField((prevField) => {
            if (field === prevField) {
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            } else {
                setSortDirection('asc');
            }
            return field;
        });
    };

    // Calculate metrics with proper error handling
    const metrics = useMemo(() => {
        const completedGoals = goals.filter((goal) => {
            const targetValue = parseFloat(goal.targetValue);
            return !isNaN(targetValue) && goal.currentValue >= targetValue;
        });

        const inProgressGoals = goals.filter((goal) => {
            const targetValue = parseFloat(goal.targetValue);
            return (
                !isNaN(targetValue) &&
                goal.currentValue > 0 &&
                goal.currentValue < targetValue
            );
        });

        const validGoals = goals.filter((goal) => {
            const targetValue = parseFloat(goal.targetValue);
            return !isNaN(targetValue) && targetValue > 0;
        });

        const averageProgress =
            validGoals.length > 0
                ? Math.round(
                      validGoals.reduce((acc, goal) => {
                          const progress =
                              (goal.currentValue /
                                  parseFloat(goal.targetValue)) *
                              100;
                          return acc + progress;
                      }, 0) / validGoals.length
                  )
                : 0;

        return {
            totalGoals: goals.length,
            completedGoals: completedGoals.length,
            inProgressGoals: inProgressGoals.length,
            averageProgress,
        };
    }, [goals]);

    const filteredAndSortedGoals = goals
        .filter(
            (goal) =>
                goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                goal.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                goal.user.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (a[sortField] < b[sortField])
                return sortDirection === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField])
                return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    if (loading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
                    <p className='text-gray-500 dark:text-white/60'>
                        Ziele werden geladen...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-8'>
            {/* Metrics Grid */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <GoalMetric
                    title='Gesamt Ziele'
                    value={metrics.totalGoals}
                    icon={Goal}
                    change={8}
                />
                <GoalMetric
                    title='Abgeschlossene Ziele'
                    value={metrics.completedGoals}
                    icon={CheckCircle2}
                />
                <GoalMetric
                    title='In Bearbeitung'
                    value={metrics.inProgressGoals}
                    icon={Clock}
                />
                <GoalMetric
                    title='Durchschnittlicher Fortschritt'
                    value={`${metrics.averageProgress}%`}
                    icon={TrendingUp}
                />
            </div>

            {/* Search and Filters */}
            <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6'>
                <div className='flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/40 w-5 h-5' />
                        <input
                            type='text'
                            placeholder='Ziele oder Benutzer suchen...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 
                                border border-gray-200 dark:border-white/10
                                focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 
                                transition-all duration-200 outline-none
                                text-gray-900 dark:text-white
                                placeholder:text-gray-400 dark:placeholder:text-white/40'
                        />
                    </div>
                    <div className='flex gap-2 overflow-x-auto md:overflow-visible'>
                        <FilterButton
                            active={sortField === 'title'}
                            icon={Target}
                            label='Nach Titel'
                            onClick={() => handleSort('title')}
                        />
                        <FilterButton
                            active={sortField === 'currentValue'}
                            icon={Filter}
                            label='Nach Fortschritt'
                            onClick={() => handleSort('currentValue')}
                        />
                        <FilterButton
                            active={sortField === 'endDate'}
                            icon={Calendar}
                            label='Nach Datum'
                            onClick={() => handleSort('endDate')}
                        />
                    </div>
                </div>
            </div>

            {/* Goals List */}
            {filteredAndSortedGoals.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center opacity-50'>
                        <Goal className='w-8 h-8 text-white' />
                    </div>
                    <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
                        Keine Ziele gefunden
                    </h3>
                    <p className='text-gray-500 dark:text-white/60'>
                        {searchTerm
                            ? 'Versuche es mit anderen Suchbegriffen'
                            : 'Erstelle neue Ziele für deine Benutzer'}
                    </p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {filteredAndSortedGoals.map((goal) => (
                        <GoalCard
                            key={goal._id}
                            goal={goal}
                            onEdit={() => handleEditGoal(goal)}
                            onDelete={() => handleDeleteGoal(goal._id)}
                            isExpanded={expandedGoals[goal._id]}
                            onToggle={() => toggleGoalExpansion(goal._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserGoalsManagement;
