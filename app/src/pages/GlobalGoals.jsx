import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';

const GlobalGoalCard = React.memo(({ goal, onParticipate }) => {
    const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
    const progressBarColor =
        progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500';

    return (
        <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold mb-2'>{goal.title}</h2>
            <p className='text-gray-600 mb-4'>{goal.description}</p>
            <div className='mb-4'>
                <div className='flex justify-between text-sm text-gray-500 mb-1'>
                    <span>Fortschritt</span>
                    <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2.5'>
                    <div
                        className={`${progressBarColor} h-2.5 rounded-full`}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
            <p className='text-sm text-gray-500 mb-2'>
                Ziel: {goal.targetValue} {goal.unit}
            </p>
            <p className='text-sm text-gray-500 mb-4'>
                Aktuell: {goal.currentValue} {goal.unit}
            </p>
            <button
                onClick={() => onParticipate(goal._id)}
                disabled={progressPercentage === 100}
                className={`${
                    progressPercentage === 100
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500'
                } w-full text-white font-bold py-2 px-4 rounded`}
            >
                Teilnehmen
            </button>
        </div>
    );
});

const GlobalGoals = () => {
    const [globalGoals, setGlobalGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchGlobalGoals = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/global-goals');
            setGlobalGoals(response.data);
        } catch (error) {
            console.error('Error fetching global goals:', error);
            addToast('Fehler beim Abrufen der globalen Ziele.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchGlobalGoals();
    }, [fetchGlobalGoals]);

    const handleParticipate = useCallback(
        async (goalId) => {
            try {
                const response = await axios.post(
                    `/global-goals/participate/${goalId}`
                );
                setGlobalGoals((prevGoals) =>
                    prevGoals.map((goal) =>
                        goal._id === goalId
                            ? { ...goal, ...response.data }
                            : goal
                    )
                );
                addToast(
                    'Erfolgreich am globalen Ziel teilgenommen!',
                    'success'
                );
            } catch (error) {
                console.error('Error participating in global goal:', error);
                addToast('Fehler bei der Teilnahme am globalen Ziel.', 'error');
            }
        },
        [addToast]
    );

    return (
        <>
            <Navbar />
            <div className='flex flex-col min-h-screen bg-gray-100 pt-24'>
                <div className='container mx-auto px-4'>
                    <h1 className='text-3xl font-bold mb-8 text-center text-blue-600'>
                        Globale Ziele
                    </h1>

                    {loading ? (
                        <div className='flex items-center justify-center py-4'>
                            <Loader />
                        </div>
                    ) : globalGoals.length === 0 ? (
                        <p className='text-gray-600 text-center py-8'>
                            Keine globalen Ziele verfügbar.
                        </p>
                    ) : (
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {globalGoals.map((goal) => (
                                <GlobalGoalCard
                                    key={goal._id}
                                    goal={goal}
                                    onParticipate={handleParticipate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GlobalGoals;
