import React, { useState, useEffect } from 'react';

const EditGlobalGoalDialog = ({ goal, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        targetValue: '',
        currentValue: '',
        unit: '',
        participationCount: 0,
    });

    const isEditing = !!goal;

    useEffect(() => {
        if (goal) {
            setFormData({
                id: goal._id,
                title: goal.title,
                description: goal.description,
                startDate: goal.startDate.split('T')[0],
                endDate: goal.endDate.split('T')[0],
                targetValue: goal.targetValue,
                currentValue: goal.currentValue,
                unit: goal.unit,
                participationCount: goal.participationCount,
            });
        }
    }, [goal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-6 rounded-lg max-w-md w-full'>
                <h2 className='text-xl font-bold mb-4'>
                    {isEditing
                        ? 'Globales Ziel bearbeiten'
                        : 'Neues globales Ziel erstellen'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='space-y-4'>
                        <div>
                            <label
                                htmlFor='title'
                                className='block text-sm font-medium text-gray-700'
                            >
                                Titel
                            </label>
                            <input
                                type='text'
                                id='title'
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='description'
                                className='block text-sm font-medium text-gray-700'
                            >
                                Beschreibung
                            </label>
                            <textarea
                                id='description'
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label
                                    htmlFor='startDate'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Startdatum
                                </label>
                                <input
                                    type='date'
                                    id='startDate'
                                    name='startDate'
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='endDate'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Enddatum
                                </label>
                                <input
                                    type='date'
                                    id='endDate'
                                    name='endDate'
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label
                                    htmlFor='targetValue'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Zielwert
                                </label>
                                <input
                                    type='number'
                                    id='targetValue'
                                    name='targetValue'
                                    value={formData.targetValue}
                                    onChange={handleChange}
                                    required
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='unit'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Einheit
                                </label>
                                <input
                                    type='text'
                                    id='unit'
                                    name='unit'
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                        </div>
                        {isEditing && (
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label
                                        htmlFor='currentValue'
                                        className='block text-sm font-medium text-gray-700'
                                    >
                                        Aktueller Wert
                                    </label>
                                    <input
                                        type='number'
                                        id='currentValue'
                                        name='currentValue'
                                        value={formData.currentValue}
                                        readOnly
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100'
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor='participationCount'
                                        className='block text-sm font-medium text-gray-700'
                                    >
                                        Teilnahmen
                                    </label>
                                    <input
                                        type='number'
                                        id='participationCount'
                                        name='participationCount'
                                        value={formData.participationCount}
                                        readOnly
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='mt-6 flex justify-end space-x-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                        >
                            Abbrechen
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
                        >
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGlobalGoalDialog;
