import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    X,
    Calendar,
    Target,
    Bell,
    Info,
    Type,
    Hash,
    ArrowUpDown,
    Eye,
} from 'lucide-react';

const CATEGORIES = [
    'Gesundheit',
    'Fitness',
    'Finanzen',
    'Karriere',
    'Bildung',
    'Persönliche Entwicklung',
    'Beziehungen',
    'Hobbys',
    'Reisen',
    'Sonstiges',
];

const REMINDER_TYPES = ['Täglich', 'Wöchentlich', 'Monatlich'];
const DIRECTIONS = ['Erhöhen', 'Reduzieren', 'Beibehalten', 'Sonstiges'];
const UNITS = ['Kilogramm', 'Stunden', 'Euro', 'Kilometer', 'Sonstiges'];

const useForm = (initialState, onChangeCallback) => {
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [missingFields, setMissingFields] = useState([]);

    const handleInputChange = useCallback(
        (e) => {
            const { name, value, type, checked } = e.target;
            const newValue = type === 'checkbox' ? checked : value;
            setFormData((prev) => {
                const updatedData = { ...prev, [name]: newValue };
                onChangeCallback(updatedData);
                return updatedData;
            });

            if (value.trim() !== '') {
                setMissingFields((prev) =>
                    prev.filter((field) => field !== name)
                );
            }
        },
        [onChangeCallback]
    );

    const validateForm = useCallback(() => {
        const requiredFields = [
            'title',
            'description',
            'category',
            'unit',
            'direction',
            'reminderType',
        ];
        const missing = requiredFields.filter((field) => !formData[field]);
        setMissingFields(missing);
        return missing.length === 0;
    }, [formData]);

    return {
        formData,
        setFormData,
        error,
        setError,
        missingFields,
        handleInputChange,
        validateForm,
    };
};

const InputField = React.memo(
    ({
        label,
        id,
        value,
        type = 'text',
        icon,
        options = null,
        onChange,
        error,
    }) => (
        <div className='mb-4'>
            <label
                htmlFor={id}
                className='block text-sm font-medium text-gray-700 mb-1'
            >
                {label}
            </label>
            <div className='relative'>
                <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>
                    {icon}
                </span>
                {type === 'textarea' ? (
                    <textarea
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        className={`w-full px-3 py-2 pl-10 border ${
                            error ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder={`${label} eingeben`}
                        rows={3}
                    />
                ) : type === 'select' ? (
                    <select
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        className={`w-full px-3 py-2 pl-10 border ${
                            error ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value=''>Bitte auswählen</option>
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        className={`w-full px-3 py-2 pl-10 border ${
                            error ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder={`${label} eingeben`}
                    />
                )}
            </div>
        </div>
    )
);

const EditGoalDialog = ({ goal, onChange, onSave, onClose }) => {
    const {
        formData,
        setFormData,
        error,
        setError,
        missingFields,
        handleInputChange,
        validateForm,
    } = useForm(
        {
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
            category: '',
            progress: 0,
            public: false,
        },
        onChange
    );

    useEffect(() => {
        if (goal) {
            const formattedGoal = {
                ...goal,
                startDate: goal.startDate
                    ? new Date(goal.startDate).toISOString().split('T')[0]
                    : '',
                endDate: goal.endDate
                    ? new Date(goal.endDate).toISOString().split('T')[0]
                    : '',
            };
            setFormData(formattedGoal);
            setError('');
        }
    }, [goal, setFormData, setError]);

    const handleSave = useCallback(() => {
        if (validateForm()) {
            setError('');
            onSave(formData);
            onClose();
        } else {
            setError('Bitte füllen Sie alle erforderlichen Felder aus.');
        }
    }, [validateForm, setError, onSave, formData, onClose]);

    const renderCustomizableDropdown = useMemo(
        () => (label, id, value, icon, options) =>
            (
                <InputField
                    key={id}
                    label={label}
                    id={id}
                    value={value}
                    type={value === 'Benutzerdefiniert' ? 'text' : 'select'}
                    icon={icon}
                    options={options}
                    onChange={handleInputChange}
                    error={missingFields.includes(id)}
                />
            ),
        [handleInputChange, missingFields]
    );

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800'>
                        {goal ? 'Ziel bearbeiten' : 'Neues Ziel erstellen'}
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700'
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>
                            Grundinformationen
                        </h3>
                        <InputField
                            label='Name'
                            id='title'
                            value={formData.title}
                            icon={<Type size={20} />}
                            onChange={handleInputChange}
                            error={missingFields.includes('title')}
                        />
                        <InputField
                            label='Kategorie'
                            id='category'
                            value={formData.category}
                            type='select'
                            icon={<Hash size={20} />}
                            options={CATEGORIES}
                            onChange={handleInputChange}
                            error={missingFields.includes('category')}
                        />
                        <InputField
                            label='Beschreibung'
                            id='description'
                            value={formData.description}
                            type='textarea'
                            icon={<Info size={20} />}
                            onChange={handleInputChange}
                            error={missingFields.includes('description')}
                        />
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold mb-4'>
                            Zeitrahmen
                        </h3>
                        <InputField
                            label='Start Datum'
                            id='startDate'
                            value={formData.startDate}
                            type='date'
                            icon={<Calendar size={20} />}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label='End Datum'
                            id='endDate'
                            value={formData.endDate}
                            type='date'
                            icon={<Calendar size={20} />}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold mb-4'>
                            Zieldetails
                        </h3>
                        <InputField
                            label='Zielwert'
                            id='targetValue'
                            value={formData.targetValue}
                            type='number'
                            icon={<Target size={20} />}
                            onChange={handleInputChange}
                        />
                        {renderCustomizableDropdown(
                            'Einheit',
                            'unit',
                            formData.unit,
                            <Hash size={20} />,
                            UNITS
                        )}
                        {renderCustomizableDropdown(
                            'Richtung',
                            'direction',
                            formData.direction,
                            <ArrowUpDown size={20} />,
                            DIRECTIONS
                        )}
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold mb-4'>
                            Erinnerungen
                        </h3>
                        <InputField
                            label='Erinnerungsintervall'
                            id='reminderType'
                            value={formData.reminderType}
                            type='select'
                            icon={<Bell size={20} />}
                            options={REMINDER_TYPES}
                            onChange={handleInputChange}
                            error={missingFields.includes('reminderType')}
                        />
                    </div>

                    <div className='md:col-span-2'>
                        <h3 className='text-lg font-semibold mb-4'>
                            Fortschritt und Sichtbarkeit
                        </h3>
                        <div className='mb-4'>
                            <label
                                htmlFor='progress'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Fortschritt
                            </label>
                            <div className='relative'>
                                <input
                                    type='range'
                                    id='progress'
                                    name='progress'
                                    value={formData.progress}
                                    onChange={handleInputChange}
                                    className='w-full mt-6'
                                    min='0'
                                    max='100'
                                />
                            </div>
                            <div className='text-center mt-1'>
                                {formData.progress}%
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='public'
                                name='public'
                                checked={formData.public}
                                onChange={handleInputChange}
                                className='mr-2'
                            />
                            <Eye size={20} className='mr-2 text-gray-500' />
                            <label
                                htmlFor='public'
                                className='text-sm font-medium text-gray-700'
                            >
                                Öffentlich
                            </label>
                        </div>
                    </div>
                </div>

                {error && <div className='text-red-500 mt-4'>{error}</div>}

                <div className='mt-8 flex justify-end space-x-4'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleSave}
                        className='px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                        Speichern
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(EditGoalDialog);
