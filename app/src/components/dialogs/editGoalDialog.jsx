import React, { useState, useEffect } from 'react';

const EditGoalDialog = ({ goal, onChange, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        startDate: '',
        endDate: '',
        targetValue: '',
        unit: '',
        direction: '',
        reminderInterval: '',
        reminderType: '',
        description: '',
    });

    const [error, setError] = useState('');
    const [missingFields, setMissingFields] = useState([]);

    useEffect(() => {
        if (goal) {
            setFormData({
                id: goal.id || null,
                title: goal.title || '',
                startDate: goal.startDate || '',
                endDate: goal.endDate || '',
                targetValue: goal.targetValue || '',
                unit: goal.unit || '',
                direction: goal.direction || '',
                reminderInterval: goal.reminderInterval || '',
                reminderType: goal.reminderType || '',
                description: goal.description || '',
            });
            setMissingFields([]);
            setError('');
        }
    }, [goal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        onChange(updatedFormData);

        if (value.trim() !== '') {
            setMissingFields(missingFields.filter((field) => field !== name));
        }
    };

    const validateForm = () => {
        const requiredFields = ['title', 'description'];
        const missing = requiredFields.filter((field) => !formData[field]);
        setMissingFields(missing);
        return missing.length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            setError('');
            onSave(formData);
            onClose();
        } else {
            setError('Bitte füllen Sie alle erforderlichen Felder aus.');
        }
    };

    const renderInputField = (label, id, value, type = 'text') => (
        <div key={id}>
            <label
                htmlFor={id}
                className='block text-sm font-medium text-gray-700 mb-1'
            >
                {label}
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    name={id}
                    value={value}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                        missingFields.includes(id)
                            ? 'border-red-500'
                            : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                />
            ) : (
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={value}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                        missingFields.includes(id)
                            ? 'border-red-500'
                            : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                />
            )}
        </div>
    );

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {renderInputField('Name', 'title', formData.title)}
                    {renderInputField(
                        'Kategorie',
                        'category',
                        formData.category
                    )}
                    {renderInputField(
                        'Beschreibung',
                        'description',
                        formData.description,
                        'textarea'
                    )}
                    {renderInputField(
                        'Start Datum',
                        'startDate',
                        formData.startDate,
                        'date'
                    )}
                    {renderInputField(
                        'End Datum',
                        'endDate',
                        formData.endDate,
                        'date'
                    )}
                    {renderInputField(
                        'Zielwert',
                        'targetValue',
                        formData.targetValue,
                        'number'
                    )}
                    {renderInputField('Einheit', 'unit', formData.unit)}
                    {renderInputField(
                        'Richtung',
                        'direction',
                        formData.direction
                    )}
                    {renderInputField(
                        'Erinnerungsintervall',
                        'reminderInterval',
                        formData.reminderInterval,
                        'number'
                    )}
                    {renderInputField(
                        'Erinnerungstyp',
                        'reminderType',
                        formData.reminderType
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
                            value={formData.progress}
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
                            checked={formData.public}
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
                {error && <div className='text-red-500 mt-2'>{error}</div>}
            </div>
        </div>
    );
};

export default EditGoalDialog;
