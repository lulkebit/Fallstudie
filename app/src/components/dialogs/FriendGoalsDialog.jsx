import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DialogContainer from '../containers/DialogContainer';
import { Target, X } from 'lucide-react';

const FriendGoalsDialog = ({ friendId, onClose }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get(`/goals/friend/${friendId}`);
                setGoals(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Ziele', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [friendId]);

    return (
        <DialogContainer onClose={onClose}>
            <div className='p-6 border-b border-gray-100'>
                <div className='flex justify-between items-center'>
                    <h3 className='text-xl font-bold text-gray-800'>
                        Öffentliche Ziele
                    </h3>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                    >
                        <X className='h-5 w-5 text-gray-400' />
                    </button>
                </div>
            </div>

            <div className='p-6 overflow-y-auto max-h-[60vh]'>
                {loading ? (
                    <div className='flex items-center justify-center py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                    </div>
                ) : goals.length === 0 ? (
                    <div className='text-center py-12'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <Target className='w-8 h-8 text-gray-400' />
                        </div>
                        <p className='text-gray-500 text-lg'>
                            Keine öffentlichen Ziele gefunden.
                        </p>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {goals.map((goal) => (
                            <div
                                key={goal._id}
                                className='bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors'
                            >
                                <h4 className='text-lg font-semibold text-gray-800 mb-2'>
                                    {goal.title}
                                </h4>
                                <p className='text-gray-600 mb-4'>
                                    {goal.description}
                                </p>
                                <div className='flex items-center gap-2 text-sm text-gray-500 mb-4'>
                                    <Target className='h-4 w-4' />
                                    {goal.category}
                                </div>
                                <div className='space-y-2'>
                                    <div className='flex justify-between items-center text-sm'>
                                        <span className='font-medium text-gray-600'>
                                            Fortschritt
                                        </span>
                                        <span className='font-medium text-blue-600'>
                                            {goal.progress}%
                                        </span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-2'>
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                goal.progress === 100
                                                    ? 'bg-green-500'
                                                    : 'bg-blue-500'
                                            }`}
                                            style={{
                                                width: `${goal.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='p-6 border-t border-gray-100'>
                <button
                    onClick={onClose}
                    className='w-full px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium 
                             hover:bg-gray-200 transition-colors duration-200'
                >
                    Schließen
                </button>
            </div>
        </DialogContainer>
    );
};

export default FriendGoalsDialog;
