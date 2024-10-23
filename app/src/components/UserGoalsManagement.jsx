import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Pencil,
    Trash2,
    Search,
    Goal,
    Clock,
    Users,
    CheckCircle2,
    Loader2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import EditGoalDialog from './dialogs/EditGoalDialog';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import Loader from './Loader';

const GoalCard = ({ goal, onEdit, onDelete, isExpanded, onToggle }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Not Started':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle2 className='w-4 h-4' />;
            case 'In Progress':
                return <Clock className='w-4 h-4' />;
            case 'Not Started':
                return <AlertCircle className='w-4 h-4' />;
            default:
                return <AlertCircle className='w-4 h-4' />;
        }
    };

    const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
    const formattedProgress = progressPercentage.toFixed(1);

    return (
        <div className='bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100'>
            <div className='p-6' onClick={onToggle}>
                {/* Header Section */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center'>
                            <Goal className='w-6 h-6 text-blue-600' />
                        </div>
                        <div>
                            <h3 className='text-xl font-bold text-gray-800'>
                                {goal.title}
                            </h3>
                            <div className='flex items-center gap-2 text-sm text-gray-500'>
                                <Users className='w-4 h-4' />
                                <span>{goal.user.username}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 border ${getStatusColor(
                                goal.status
                            )}`}
                        >
                            {getStatusIcon(goal.status)}
                            {goal.status}
                        </div>
                        <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                            {isExpanded ? (
                                <ChevronUp className='w-5 h-5 text-gray-400' />
                            ) : (
                                <ChevronDown className='w-5 h-5 text-gray-400' />
                            )}
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Fortschritt</span>
                        <span className='font-medium'>
                            {formattedProgress}%
                        </span>
                    </div>
                    <div className='relative w-full h-3 bg-gray-100 rounded-full overflow-hidden'>
                        <div
                            className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                                goal.status === 'Completed'
                                    ? 'bg-green-500'
                                    : 'bg-blue-500'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className='mt-6 space-y-6'>
                        <div className='bg-gray-50 rounded-xl p-4'>
                            <p className='text-gray-600'>{goal.description}</p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='bg-gray-50 p-4 rounded-xl'>
                                <div className='text-sm text-gray-500 mb-1'>
                                    Aktueller Stand
                                </div>
                                <div className='font-medium text-gray-900'>
                                    {goal.currentValue} / {goal.targetValue}{' '}
                                    {goal.unit}
                                </div>
                            </div>

                            <div className='bg-gray-50 p-4 rounded-xl'>
                                <div className='text-sm text-gray-500 mb-1'>
                                    Zeitraum
                                </div>
                                <div className='font-medium text-gray-900'>
                                    {new Date(
                                        goal.startDate
                                    ).toLocaleDateString()}{' '}
                                    -
                                    {new Date(
                                        goal.endDate
                                    ).toLocaleDateString()}
                                </div>
                            </div>

                            <div className='bg-gray-50 p-4 rounded-xl'>
                                <div className='text-sm text-gray-500 mb-1'>
                                    Status
                                </div>
                                <div
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(
                                        goal.status
                                    )}`}
                                >
                                    {getStatusIcon(goal.status)}
                                    <span className='font-medium'>
                                        {goal.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex justify-end gap-3 pt-4'>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(goal);
                                }}
                                className='inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 font-medium gap-2'
                            >
                                <Pencil className='w-4 h-4' />
                                Bearbeiten
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(goal._id);
                                }}
                                className='inline-flex items-center px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 font-medium gap-2'
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

const UserGoalsManagement = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
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
        setEditingGoal(goal);
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

    const SortButton = ({ field, children }) => (
        <button
            onClick={() => handleSort(field)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${
                    sortField === field
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
        >
            {children}
            {sortField === field && (
                <span className='ml-2'>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </button>
    );

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[400px] text-red-500'>
                <AlertCircle className='w-6 h-6 mr-2' />
                {error}
            </div>
        );
    }

    return (
        <div className='bg-gray-50 p-6 rounded-xl'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Ziel Verwaltung
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <div className='bg-white p-6 rounded-xl shadow-lg'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                            <Goal className='w-6 h-6 text-blue-600' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>
                                Gesamt Ziele
                            </p>
                            <p className='text-2xl font-bold text-gray-900'>
                                {totalGoals}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-lg'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                            <CheckCircle2 className='w-6 h-6 text-green-600' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>
                                Abgeschlossen
                            </p>
                            <p className='text-2xl font-bold text-gray-900'>
                                {completedGoals}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-lg'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center'>
                            <Clock className='w-6 h-6 text-yellow-600' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>
                                In Bearbeitung
                            </p>
                            <p className='text-2xl font-bold text-gray-900'>
                                {inProgressGoals}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='space-y-6'>
                <div className='flex flex-col md:flex-row gap-4 justify-between'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                        <input
                            type='text'
                            placeholder='Suche nach Zielen, Beschreibungen oder Benutzern...'
                            className='w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg
                                     text-gray-900 placeholder:text-gray-400
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className='flex gap-3'>
                        <SortButton field='title'>Nach Titel</SortButton>
                        <SortButton field='status'>Nach Status</SortButton>
                        <SortButton field='endDate'>Nach Datum</SortButton>
                    </div>
                </div>

                <div className='space-y-4'>
                    {filteredAndSortedGoals.length === 0 ? (
                        <div className='text-center py-12'>
                            <Goal className='mx-auto h-12 w-12 text-gray-400' />
                            <h3 className='mt-4 text-lg font-medium text-gray-900'>
                                Keine Ziele gefunden
                            </h3>
                            <p className='mt-2 text-gray-500'>
                                Versuchen Sie andere Suchbegriffe oder Filter.
                            </p>
                        </div>
                    ) : (
                        filteredAndSortedGoals.map((goal) => (
                            <GoalCard
                                key={goal._id}
                                goal={goal}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isExpanded={expandedGoals[goal._id]}
                                onToggle={() => toggleGoalExpansion(goal._id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserGoalsManagement;
