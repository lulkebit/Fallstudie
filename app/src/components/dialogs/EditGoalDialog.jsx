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
        icon: Icon,
        options = null,
        onChange,
        error,
    }) => (
        <div className='space-y-1.5'>
            <label
                htmlFor={id}
                className='block text-sm font-medium text-gray-600'
            >
                {label}
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Icon className='h-5 w-5 text-gray-400' />
                </div>
                {type === 'textarea' ? (
                    <textarea
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                            error ? 'border-red-500' : 'border-gray-200'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none`}
                        placeholder={`${label} eingeben`}
                        rows={3}
                    />
                ) : type === 'select' ? (
                    <select
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                            error ? 'border-red-500' : 'border-gray-200'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none
                    appearance-none bg-white`}
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
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                            error ? 'border-red-500' : 'border-gray-200'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none`}
                        placeholder={`${label} eingeben`}
                    />
                )}
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    )
);

const ProgressInput = ({ value, onChange }) => (
    <div className='space-y-4'>
        <div className='flex justify-between items-center'>
            <label className='block text-sm font-medium text-gray-600'>
                Fortschritt
            </label>
            <span className='text-blue-600 font-medium'>{value}%</span>
        </div>
        <input
            type='range'
            id='progress'
            name='progress'
            value={value}
            onChange={onChange}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer'
            min='0'
            max='100'
        />
    </div>
);

const PublicSwitch = ({ checked, onChange }) => (
    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
        <input
            type='checkbox'
            id='public'
            name='public'
            checked={checked}
            onChange={onChange}
            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
        />
        <div className='flex items-center gap-2'>
            <Eye className='h-5 w-5 text-gray-400' />
            <label
                htmlFor='public'
                className='text-sm font-medium text-gray-600'
            >
                Öffentlich machen
            </label>
        </div>
    </div>
);

const EditGoalDialog = ({ goal, onSave, onClose }) => {
    const [editedGoal, setEditedGoal] = useState(null);
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
                    <div className='space-y-6'>
                        <InputField
                            label='Name'
                            id='title'
                            value={formData.title}
                            icon={Type}
                            onChange={handleInputChange}
                            error={errors.title}
                        />
                        <InputField
                            label='Kategorie'
                            id='category'
                            value={formData.category}
                            type='select'
                            icon={Hash}
                            options={CATEGORIES}
                            onChange={handleInputChange}
                            error={errors.category}
                        />
                        <InputField
                            label='Beschreibung'
                            id='description'
                            value={formData.description}
                            type='textarea'
                            icon={Info}
                            onChange={handleInputChange}
                            error={errors.description}
                        />
                    </div>
                );
            case 1:
                return (
                    <div className='space-y-6'>
                        <InputField
                            label='Start'
                            id='startDate'
                            value={formData.startDate}
                            type='date'
                            icon={Calendar}
                            onChange={handleInputChange}
                            error={errors.startDate}
                        />
                        <InputField
                            label='Ende'
                            id='endDate'
                            value={formData.endDate}
                            type='date'
                            icon={Calendar}
                            onChange={handleInputChange}
                            error={errors.endDate}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className='space-y-6'>
                        <InputField
                            label='Zielwert'
                            id='targetValue'
                            value={formData.targetValue}
                            type='text'
                            icon={Target}
                            onChange={handleInputChange}
                            error={errors.targetValue}
                        />
                        <InputField
                            label='Einheit'
                            id='unit'
                            value={formData.unit}
                            type='select'
                            icon={Hash}
                            options={UNITS}
                            onChange={handleInputChange}
                            error={errors.unit}
                        />
                        <InputField
                            label='Richtung'
                            id='direction'
                            value={formData.direction}
                            type='select'
                            icon={ArrowUpDown}
                            options={DIRECTIONS}
                            onChange={handleInputChange}
                            error={errors.direction}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className='space-y-6'>
                        <InputField
                            label='Erinnerungsintervall'
                            id='reminderType'
                            value={formData.reminderType}
                            type='select'
                            icon={Bell}
                            options={REMINDER_TYPES}
                            onChange={handleInputChange}
                            error={errors.reminderType}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className='space-y-6'>
                        <ProgressInput
                            value={formData.progress}
                            onChange={handleInputChange}
                        />
                        <PublicSwitch
                            checked={formData.public}
                            onChange={handleInputChange}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] h-[80vh] flex flex-col'>
                <div className='p-6 border-b border-gray-100'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-bold text-gray-800'>
                            {goal ? 'Ziel bearbeiten' : 'Neues Ziel erstellen'}
                        </h2>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                        >
                            <X className='h-5 w-5 text-gray-400' />
                        </button>
                    </div>

                    <div className='flex items-center gap-2'>
                        {steps.map((step, index) => (
                            <React.Fragment key={step.title}>
                                <div
                                    className={`flex items-center gap-2 ${
                                        index <= currentStep
                                            ? 'text-blue-600'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-medium
                                        ${
                                            index <= currentStep
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <span className='text-sm hidden md:block'>
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-grow h-0.5 ${
                                            index < currentStep
                                                ? 'bg-blue-500'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className='flex-1 min-h-0'>
                    <div className='h-full p-6 overflow-y-auto'>
                        {renderStepContent(currentStep)}
                    </div>
                </div>

                <div className='p-6 border-t border-gray-100'>
                    <div className='flex justify-between items-center'>
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                                ${
                                    currentStep === 0
                                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <ChevronLeft className='h-5 w-5' />
                            Zurück
                        </button>

                        {currentStep === steps.length - 1 ? (
                            <button
                                onClick={handleSave}
                                className='px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-lg 
                                         hover:bg-blue-700 transition-all duration-200 hover:shadow-xl hover:scale-105'
                            >
                                Speichern
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className='px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-lg 
                                         hover:bg-blue-700 transition-all duration-200 hover:shadow-xl hover:scale-105
                                         flex items-center gap-2'
                            >
                                Weiter
                                <ChevronRight className='h-5 w-5' />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditGoalDialog;
