import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from 'lucide-react';
import EditGoalDialog from './dialogs/EditGoalDialog';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';

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

const GoalCard = ({ goal, onEdit, onDelete, isExpanded, onToggle }) => {
    const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
    const isCompleted = goal.status === 'Completed';

    const StatusBadge = ({ status }) => {
        const getStatusConfig = (status) => {
            switch (status) {
                case 'Completed':
                    return {
                        bg: 'bg-green-500/20',
                        text: 'text-green-500',
                        icon: CheckCircle2,
                    };
                case 'In Progress':
                    return {
                        bg: 'bg-[#4785FF]/20',
                        text: 'text-[#4785FF]',
                        icon: Clock,
                    };
                default:
                    return {
                        bg: 'bg-gray-500/20',
                        text: 'text-gray-500',
                        icon: AlertCircle,
                    };
            }
        };

        const config = getStatusConfig(status);
        const Icon = config.icon;

        return (
            <div
                className={`px-3 py-1 rounded-full flex items-center gap-2 ${config.bg} ${config.text}`}
            >
                <Icon className='w-4 h-4' />
                <span className='text-sm font-medium'>{status}</span>
            </div>
        );
    };

    return (
        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
            <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                    <div>
                        <div className='flex items-center gap-2 mb-1'>
                            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-white/60'>
                                <Users className='w-4 h-4' />
                                <span>{goal.user.username}</span>
                            </div>
                            <StatusBadge status={goal.status} />
                        </div>
                        <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                            {goal.title}
                        </h3>
                    </div>

                    {isCompleted ? (
                        <div className='h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center'>
                            <CheckCircle2 className='h-5 w-5 text-green-500' />
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
                            Fortschritt
                        </div>
                        <div className='text-gray-900 dark:text-white text-sm font-medium'>
                            {Math.round(progressPercentage)}%
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-white/60'>
                        <Calendar className='w-4 h-4' />
                        <span>
                            {new Date(goal.startDate).toLocaleDateString()} -{' '}
                            {new Date(goal.endDate).toLocaleDateString()}
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
                                onClick={() => onEdit(goal)}
                                className='px-4 py-2 rounded-xl font-medium text-[#4785FF] bg-[#4785FF]/10 
                        hover:bg-[#4785FF]/20 transition-all duration-200
                        flex items-center gap-2'
                            >
                                <Pencil className='w-4 h-4' />
                                Bearbeiten
                            </button>
                            <button
                                onClick={() => onDelete(goal._id)}
                                className='px-4 py-2 rounded-xl font-medium text-red-500 bg-red-500/10 
                        hover:bg-red-500/20 transition-all duration-200
                        flex items-center gap-2'
                            >
                                <Trash2 className='w-4 h-4' />
                                Löschen
                            </button>
                        </div>
                    </div>
                )}
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
              ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10'
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
    const [error, setError] = useState(null);
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
            setError('Error fetching goals');
            addToast('Fehler beim Laden der Ziele', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (goal) => {
        addDialog({
            component: EditGoalDialog,
            props: {
                goal,
                onSave: handleSaveEdit,
                onClose: removeDialog,
            },
        });
    };

    const handleSaveEdit = async (updatedGoal) => {
        try {
            await axios.put(`/admin/goals/${updatedGoal._id}`, updatedGoal);
            removeDialog();
            fetchGoals();
            addToast('Ziel erfolgreich aktualisiert', 'success');
        } catch (err) {
            addToast('Fehler beim Aktualisieren des Ziels', 'error');
        }
    };

    const handleDelete = async (goalId) => {
        try {
            await axios.delete(`/admin/goals/${goalId}`);
            fetchGoals();
            addToast('Ziel erfolgreich gelöscht', 'success');
        } catch (err) {
            addToast('Fehler beim Löschen des Ziels', 'error');
        }
    };

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

    const filteredAndSortedGoals = goals
        .filter(
            (goal) =>
                goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                goal.description
                    .toLowerCase()
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

    const totalGoals = goals.length;
    const completedGoals = goals.filter(
        (goal) => goal.status === 'Completed'
    ).length;
    const inProgressGoals = goals.filter(
        (goal) => goal.status === 'In Progress'
    ).length;

    return (
        <div className='space-y-8'>
            {/* Metrics Grid */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <GoalMetric
                    title='Gesamt Ziele'
                    value={goals.length}
                    icon={Goal}
                    change={8}
                />
                <GoalMetric
                    title='Abgeschlossene Ziele'
                    value={goals.filter((g) => g.status === 'Completed').length}
                    icon={CheckCircle2}
                />
                <GoalMetric
                    title='In Bearbeitung'
                    value={
                        goals.filter((g) => g.status === 'In Progress').length
                    }
                    icon={Clock}
                />
                <GoalMetric
                    title='Durchschnittlicher Fortschritt'
                    value={`${Math.round(
                        goals.reduce(
                            (acc, goal) =>
                                acc +
                                (goal.currentValue / goal.targetValue) * 100,
                            0
                        ) / goals.length
                    )}%`}
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
                    <div className='flex gap-2 overflow-x-auto'>
                        <FilterButton
                            active={sortField === 'title'}
                            icon={Target}
                            label='Nach Titel'
                            onClick={() => handleSort('title')}
                        />
                        <FilterButton
                            active={sortField === 'status'}
                            icon={Filter}
                            label='Nach Status'
                            onClick={() => handleSort('status')}
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
            {loading ? (
                <div className='flex items-center justify-center py-12'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
                        <p className='text-gray-500 dark:text-white/60'>
                            Ziele werden geladen...
                        </p>
                    </div>
                </div>
            ) : filteredAndSortedGoals.length === 0 ? (
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
                            onEdit={handleEdit}
                            onDelete={handleDelete}
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
