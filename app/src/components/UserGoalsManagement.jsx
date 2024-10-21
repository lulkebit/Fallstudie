import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditGoalDialog from './dialogs/EditGoalDialog';
import { Pencil, Trash2, Search } from 'lucide-react';
import Loader from './Loader';

const UserGoalsManagement = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/goals');
            setGoals(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching goals');
            setLoading(false);
        }
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
    };

    const handleSaveEdit = async (updatedGoal) => {
        try {
            await axios.put(`/admin/goals/${updatedGoal._id}`, updatedGoal);
            setEditingGoal(null);
            fetchGoals();
        } catch (err) {
            setError('Error updating goal');
        }
    };

    const handleDelete = async (goalId) => {
        try {
            await axios.delete(`/admin/goals/${goalId}`);
            fetchGoals();
        } catch (err) {
            setError('Error deleting goal');
        }
    };

    const filteredGoals = goals.filter(
        (goal) =>
            goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            goal.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalGoals = goals.length;
    const completedGoals = goals.filter(
        (goal) => goal.status === 'Completed'
    ).length;
    const inProgressGoals = goals.filter(
        (goal) => goal.status === 'In Progress'
    ).length;

    if (loading) return <Loader />;
    if (error) return <div className='text-red-500'>{error}</div>;

    return (
        <div className='user-goals-management bg-gray-100 p-6 rounded-lg'>
            <h2 className='text-2xl font-bold mb-4'>Ziel Verwaltung</h2>

            <div className='grid grid-cols-3 gap-4 mb-6'>
                <div className='bg-blue-100 p-4 rounded-lg shadow text-center'>
                    <h3 className='font-bold'>Total Goals</h3>
                    <p className='text-2xl'>{totalGoals}</p>
                </div>
                <div className='bg-green-100 p-4 rounded-lg shadow text-center'>
                    <h3 className='font-bold'>Completed Goals</h3>
                    <p className='text-2xl'>{completedGoals}</p>
                </div>
                <div className='bg-yellow-100 p-4 rounded-lg shadow text-center'>
                    <h3 className='font-bold'>In Progress Goals</h3>
                    <p className='text-2xl'>{inProgressGoals}</p>
                </div>
            </div>

            <div className='mb-4 relative'>
                <input
                    type='text'
                    placeholder='Search goals...'
                    className='w-full p-2 pl-10 border rounded bg-white'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredGoals.map((goal) => (
                    <div
                        key={goal._id}
                        className='bg-white p-4 rounded-lg shadow-md border border-gray-200'
                    >
                        <h3 className='font-bold text-lg mb-2'>{goal.title}</h3>
                        <p className='text-sm text-gray-600 mb-2'>
                            User: {goal.user.username}
                        </p>
                        <p className='text-sm mb-2'>{goal.description}</p>
                        <p className='text-sm mb-4'>Status: {goal.status}</p>
                        <div className='flex justify-end'>
                            <button
                                onClick={() => handleEdit(goal)}
                                className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 mr-2'
                                title='Bearbeiten'
                            >
                                <Pencil className='h-5 w-5 text-blue-500' />
                            </button>
                            <button
                                onClick={() => handleDelete(goal._id)}
                                className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
                                title='Löschen'
                            >
                                <Trash2 className='h-5 w-5 text-red-500' />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingGoal && (
                <EditGoalDialog
                    goal={editingGoal}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingGoal(null)}
                />
            )}
        </div>
    );
};

export default UserGoalsManagement;
