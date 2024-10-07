import React, { useState } from 'react';

const EditGoalDialog = ({ goal, onChange, onSave, onClose }) => {
    const [currentGoal, setCurrentGoal] = useState(goal);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedGoal = {
            ...currentGoal,
            [name]: type === 'checkbox' ? checked : value,
        };
        setCurrentGoal(updatedGoal);
        onChange(updatedGoal); // Pass the updated goal back
    };

    const handleSave = () => {
        onSave({ ...currentGoal });
        onClose();
    };

    // Helper function to render input fields
    const renderInputField = (label, id, value, type = 'text') => (
        <div>
            <label
                htmlFor={id}
                className='block text-sm font-medium text-gray-700 mb-1'
            >
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={`Enter ${label.toLowerCase()}`}
            />
        </div>
    );

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {renderInputField('Title', 'title', currentGoal.title)}
                    {renderInputField(
                        'Category',
                        'category',
                        currentGoal.category
                    )}
                    <div className='md:col-span-2'>
                        <label
                            htmlFor='description'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Kurzbeschreibung
                        </label>
                        <textarea
                            id='description'
                            name='description'
                            value={currentGoal.description}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            rows='3'
                            placeholder='Kurze Beschreibung eingeben'
                        ></textarea>
                    </div>
                    {renderInputField(
                        'Start Datum',
                        'startDate',
                        currentGoal.startDate,
                        'date'
                    )}
                    {renderInputField(
                        'End Datum',
                        'endDate',
                        currentGoal.endDate,
                        'date'
                    )}
                    {renderInputField(
                        'Zielwert',
                        'targetValue',
                        currentGoal.targetValue,
                        'number'
                    )}
                    {renderInputField('Einheit', 'unit', currentGoal.unit)}
                    {renderInputField(
                        'Richtung',
                        'direction',
                        currentGoal.direction
                    )}
                    {renderInputField(
                        'Erinnerungsintervall',
                        'reminderInterval',
                        currentGoal.reminderInterval,
                        'number'
                    )}
                    {renderInputField(
                        'Erinnerungstyp',
                        'reminderType',
                        currentGoal.reminderType
                    )}
                    <div className='md:col-span-2'>
                        <label
                            htmlFor='progress'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Fortschritt
                        </label>
                        <input
                            type='range'
                            id='progress'
                            name='progress'
                            value={currentGoal.progress}
                            onChange={handleInputChange}
                            className='w-full'
                            min='0'
                            max='100'
                        />
                    </div>
                    <div className='md:col-span-2 flex items-center'>
                        <input
                            type='checkbox'
                            id='public'
                            name='public'
                            checked={currentGoal.public}
                            onChange={handleInputChange}
                            className='mr-2'
                        />
                        <label
                            htmlFor='public'
                            className='text-sm font-medium text-gray-700'
                        >
                            Öffentlich
                        </label>
                    </div>
                </div>
                <div className='mt-6 flex justify-end items-center space-x-2'>
                    <button
                        onClick={onClose}
                        className='bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium py-2 px-4 rounded transition duration-300 ease-in-out'
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleSave}
                        className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'
                    >
                        Speichern
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditGoalDialog;
