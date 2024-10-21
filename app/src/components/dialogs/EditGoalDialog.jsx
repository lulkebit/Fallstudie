import React, { useState, useEffect, useCallback } from 'react';
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
    ChevronLeft,
    ChevronRight,
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
const DIRECTIONS = [
    'Erhöhen',
    'Reduzieren',
    'Beibehalten',
    'Erreichen',
    'Sonstiges',
];
const UNITS = [
    'Kilogramm',
    'Stunden',
    'Euro',
    'Kilometer',
    'Prozent',
    'Sonstiges',
];

const useForm = (initialState, onChangeCallback) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    const handleInputChange = useCallback(
        (e) => {
            const { name, value, type, checked } = e.target;
            const newValue = type === 'checkbox' ? checked : value;
            setFormData((prev) => {
                const updatedData = { ...prev, [name]: newValue };
                onChangeCallback(updatedData);
                return updatedData;
            });

            setErrors((prev) => ({ ...prev, [name]: '' }));
        },
        [onChangeCallback]
    );

    const validateFields = useCallback(
        (fields) => {
            const newErrors = {};
            fields.forEach((field) => {
                const value = formData[field];
                if (value === undefined || value === null || value === '') {
                    newErrors[field] = 'Dieses Feld ist erforderlich';
                } else if (typeof value === 'string' && value.trim() === '') {
                    newErrors[field] = 'Dieses Feld darf nicht leer sein';
                }
            });
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [formData]
    );

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        handleInputChange,
        validateFields,
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
            {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
        </div>
    )
);

const EditGoalDialog = ({ goal, onSave, onClose }) => {
    const [editedGoal, setEditedGoal] = useState(null);

    const {
        formData,
        setFormData,
        errors,
        setErrors,
        handleInputChange,
        validateFields,
    } = useForm(
        {
            id: null,
            title: '',
            startDate: '',
            endDate: '',
            targetValue: '',
            unit: '',
            direction: '',
            reminderType: '',
            description: '',
            category: '',
            progress: 0,
            public: false,
        },
        setEditedGoal
    );

    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        {
            title: 'Grundinformationen',
            fields: ['title', 'category', 'description'],
        },
        { title: 'Zeitrahmen', fields: ['startDate', 'endDate'] },
        { title: 'Zieldetails', fields: ['targetValue', 'unit', 'direction'] },
        { title: 'Erinnerungen', fields: ['reminderType'] },
        { title: 'Fortschritt und Sichtbarkeit', fields: [] },
    ];

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
            setEditedGoal(formattedGoal);
            setErrors({});
        }
    }, [goal, setFormData, setErrors]);

    const handleSave = useCallback(() => {
        onSave(editedGoal);
        onClose();
    }, [editedGoal, onSave, onClose]);

    const handleNext = useCallback(() => {
        const isValid = validateFields(steps[currentStep].fields);
        if (isValid) {
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
        }
    }, [validateFields, currentStep, steps]);

    const handlePrevious = useCallback(() => {
        setCurrentStep((prev) => Math.max(0, prev - 1));
    }, []);

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <InputField
                            label='Name'
                            id='title'
                            value={formData.title}
                            icon={<Type size={20} />}
                            onChange={handleInputChange}
                            error={errors.title}
                        />
                        <InputField
                            label='Kategorie'
                            id='category'
                            value={formData.category}
                            type='select'
                            icon={<Hash size={20} />}
                            options={CATEGORIES}
                            onChange={handleInputChange}
                            error={errors.category}
                        />
                        <InputField
                            label='Beschreibung'
                            id='description'
                            value={formData.description}
                            type='textarea'
                            icon={<Info size={20} />}
                            onChange={handleInputChange}
                            error={errors.description}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <InputField
                            label='Start'
                            id='startDate'
                            value={formData.startDate}
                            type='date'
                            icon={<Calendar size={20} />}
                            onChange={handleInputChange}
                            error={errors.startDate}
                        />
                        <InputField
                            label='Ende'
                            id='endDate'
                            value={formData.endDate}
                            type='date'
                            icon={<Calendar size={20} />}
                            onChange={handleInputChange}
                            error={errors.endDate}
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <InputField
                            label='Zielwert'
                            id='targetValue'
                            value={formData.targetValue}
                            type='text'
                            icon={<Target size={20} />}
                            onChange={handleInputChange}
                            error={errors.targetValue}
                        />
                        <InputField
                            label='Einheit'
                            id='unit'
                            value={formData.unit}
                            type='select'
                            icon={<Hash size={20} />}
                            options={UNITS}
                            onChange={handleInputChange}
                            error={errors.unit}
                        />
                        <InputField
                            label='Richtung'
                            id='direction'
                            value={formData.direction}
                            type='select'
                            icon={<ArrowUpDown size={20} />}
                            options={DIRECTIONS}
                            onChange={handleInputChange}
                            error={errors.direction}
                        />
                    </>
                );
            case 3:
                return (
                    <InputField
                        label='Erinnerungsintervall'
                        id='reminderType'
                        value={formData.reminderType}
                        type='select'
                        icon={<Bell size={20} />}
                        options={REMINDER_TYPES}
                        onChange={handleInputChange}
                        error={errors.reminderType}
                    />
                );
            case 4:
                return (
                    <>
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
                                    className='w-full mt-2'
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
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className='fixed inset-0 bg-black z-50 bg-opacity-50 flex justify-center items-center p-4'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-[500px] h-full max-h-[600px] flex flex-col'>
                <div className='sticky top-0 bg-white z-10 px-4 sm:px-6 py-4 border-b border-gray-200 rounded-t-2xl'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>
                            {goal ? 'Ziel bearbeiten' : 'Neues Ziel erstellen'}
                        </h2>
                        <button
                            onClick={onClose}
                            className='text-gray-500 hover:text-gray-700'
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className='mt-2 text-sm text-gray-600'>
                        Schritt {currentStep + 1} von {steps.length}:{' '}
                        {steps[currentStep].title}
                    </div>
                </div>

                <div className='flex-grow px-4 sm:px-6 py-4 overflow-y-auto'>
                    {renderStepContent(currentStep)}
                </div>

                <div className='sticky bottom-0 bg-white z-10 px-4 sm:px-6 py-4 border-t border-gray-200 rounded-b-2xl'>
                    <div className='flex justify-between'>
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 ${
                                currentStep === 0
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-50'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {currentStep === steps.length - 1 ? (
                            <button
                                onClick={handleSave}
                                className='px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            >
                                Speichern
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className='px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditGoalDialog;
