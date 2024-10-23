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

    const inputClasses =
        'w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none';
    const labelClasses = 'block text-sm font-medium text-gray-600 mb-1.5';
    const readOnlyClasses =
        'w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50 text-gray-500';

    return (
        <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto'>
                <div className='p-6 border-b border-gray-100'>
                    <h2 className='text-2xl font-bold text-gray-800'>
                        {isEditing
                            ? 'Globales Ziel bearbeiten'
                            : 'Neues globales Ziel erstellen'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className='p-6'>
                    <div className='space-y-6'>
                        <div className='space-y-4'>
                            <div>
                                <label htmlFor='title' className={labelClasses}>
                                    Titel
                                </label>
                                <input
                                    type='text'
                                    id='title'
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                    placeholder='Geben Sie einen Titel ein...'
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='description'
                                    className={labelClasses}
                                >
                                    Beschreibung
                                </label>
                                <textarea
                                    id='description'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className={inputClasses}
                                    placeholder='Beschreiben Sie das Ziel...'
                                />
                            </div>
                        </div>

                        <div className='bg-gray-50 p-4 rounded-lg space-y-4'>
                            <h3 className='font-medium text-gray-700'>
                                Zeitraum
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label
                                        htmlFor='startDate'
                                        className={labelClasses}
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
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor='endDate'
                                        className={labelClasses}
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
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='bg-gray-50 p-4 rounded-lg space-y-4'>
                            <h3 className='font-medium text-gray-700'>
                                Zielwerte
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label
                                        htmlFor='targetValue'
                                        className={labelClasses}
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
                                        className={inputClasses}
                                        placeholder='0'
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor='unit'
                                        className={labelClasses}
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
                                        className={inputClasses}
                                        placeholder='z.B. km, kg, Stunden...'
                                    />
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className='bg-gray-50 p-4 rounded-lg space-y-4'>
                                <h3 className='font-medium text-gray-700'>
                                    Statistiken
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <label
                                            htmlFor='currentValue'
                                            className={labelClasses}
                                        >
                                            Aktueller Wert
                                        </label>
                                        <input
                                            type='number'
                                            id='currentValue'
                                            name='currentValue'
                                            value={formData.currentValue}
                                            readOnly
                                            className={readOnlyClasses}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor='participationCount'
                                            className={labelClasses}
                                        >
                                            Teilnahmen
                                        </label>
                                        <input
                                            type='number'
                                            id='participationCount'
                                            name='participationCount'
                                            value={formData.participationCount}
                                            readOnly
                                            className={readOnlyClasses}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='mt-8 flex justify-end gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-6 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 
                                     hover:bg-gray-50 transition-colors duration-200'
                        >
                            Abbrechen
                        </button>
                        <button
                            type='submit'
                            className='px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium 
                                     hover:bg-blue-700 transition-colors duration-200 shadow-lg 
                                     hover:shadow-xl hover:scale-105'
                        >
                            {isEditing ? 'Aktualisieren' : 'Erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGlobalGoalDialog;
