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
    Flag,
    MoveHorizontal,
    ChevronDown,
    Save,
} from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

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
                onChangeCallback?.(updatedData);
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

            if (fields.includes('startDate') && fields.includes('endDate')) {
                const startDate = new Date(formData.startDate);
                const endDate = new Date(formData.endDate);
                if (startDate > endDate) {
                    newErrors.endDate =
                        'Das Enddatum darf nicht vor dem Startdatum liegen';
                }
            }

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

const CustomSelect = ({
    id,
    value,
    onChange,
    options,
    placeholder = 'Bitte auswählen',
    icon: Icon,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        const syntheticEvent = {
            target: {
                name: id,
                value: option,
            },
        };
        onChange(syntheticEvent);
        setIsOpen(false);
    };

    return (
        <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Icon className='h-5 w-5 text-gray-900 dark:text-white' />
            </div>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border 
                         border-gray-200/50 dark:border-white/10 
                         focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20
                         transition-all duration-200 outline-none backdrop-blur-sm
                         text-left text-gray-900 dark:text-white relative'
            >
                {value || placeholder}
                <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900 dark:text-white/70' />
            </button>

            {isOpen && (
                <div
                    className='absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 
                              dark:border-white/10 shadow-lg backdrop-blur-sm overflow-hidden'
                >
                    <div className='max-h-60 overflow-y-auto'>
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-white/5
                                          transition-colors duration-200
                                          ${
                                              value === option
                                                  ? 'bg-[#4785FF]/10 text-[#4785FF]'
                                                  : 'text-gray-700 dark:text-white/70'
                                          }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const CustomCheckbox = ({ checked, onChange, id, children }) => {
    return (
        <label
            htmlFor={id}
            className='relative flex items-center cursor-pointer'
        >
            <input
                type='checkbox'
                id={id}
                name={id}
                checked={checked}
                onChange={onChange}
                className='sr-only'
            />
            <div
                className={`w-5 h-5 border-2 rounded-md mr-2 flex items-center justify-center
                           transition-all duration-200
                           ${
                               checked
                                   ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] border-transparent'
                                   : 'border-gray-300 dark:border-white/20'
                           }`}
            >
                {checked && (
                    <svg
                        className='w-3 h-3 text-white'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                        />
                    </svg>
                )}
            </div>
            {children}
        </label>
    );
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
        placeholder,
    }) => (
        <div className='space-y-1.5'>
            <label
                htmlFor={id}
                className='block text-sm font-medium text-gray-700 dark:text-white/70'
            >
                {label}
            </label>
            <div className='relative'>
                {type === 'textarea' ? (
                    <>
                        <div className='absolute top-3 left-3 pointer-events-none'>
                            <Icon className='h-5 w-5 text-gray-900 dark:text-white' />
                        </div>
                        <textarea
                            id={id}
                            name={id}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            className='w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border 
                                    border-gray-200/50 dark:border-white/10 
                                    focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 
                                    transition-all duration-200 outline-none backdrop-blur-sm
                                    text-gray-900 dark:text-white resize-none'
                            rows={3}
                        />
                    </>
                ) : type === 'select' ? (
                    <CustomSelect
                        id={id}
                        value={value}
                        onChange={onChange}
                        options={options}
                        icon={Icon}
                    />
                ) : type === 'date' ? (
                    <>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Icon className='h-5 w-5 text-gray-900 dark:text-white' />
                        </div>
                        <input
                            type={type}
                            id={id}
                            name={id}
                            value={value}
                            onChange={onChange}
                            className='w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border 
                                    border-gray-200/50 dark:border-white/10 
                                    focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20
                                    transition-all duration-200 outline-none backdrop-blur-sm
                                    text-gray-900 dark:text-white
                                    [color-scheme:dark]
                                    dark:[color-scheme:dark]'
                        />
                    </>
                ) : (
                    <>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Icon className='h-5 w-5 text-gray-900 dark:text-white' />
                        </div>
                        <input
                            type={type}
                            id={id}
                            name={id}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            className='w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border 
                                    border-gray-200/50 dark:border-white/10 
                                    focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20
                                    transition-all duration-200 outline-none backdrop-blur-sm
                                    text-gray-900 dark:text-white'
                        />
                    </>
                )}
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    )
);

const PublicSwitch = ({ checked, onChange }) => (
    <div className='flex items-center gap-3 p-4 bg-white/30 dark:bg-white/5 rounded-xl border border-gray-200/50'>
        <CustomCheckbox id='public' checked={checked} onChange={onChange}>
            <div className='flex items-center gap-2'>
                <Eye className='h-5 w-5 text-gray-800 dark:text-white/70' />
                <span className='text-sm font-medium text-gray-700 dark:text-white/70'>
                    Öffentlich
                </span>
            </div>
        </CustomCheckbox>
    </div>
);

const EditGoalDialog = ({ goal, onSave, onClose }) => {
    const [editedGoal, setEditedGoal] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: 'Basics',
            fields: ['title', 'category', 'description'],
        },
        {
            title: 'Zeitrahmen',
            fields: ['startDate', 'endDate'],
        },
        {
            title: 'Zieldetails',
            fields: ['targetValue', 'currentValue', 'unit', 'direction'],
        },
        {
            title: 'Tracking',
            fields: ['reminderInterval', 'stepSize'],
        },
        {
            title: 'Sichtbarkeit',
            fields: ['public', 'participationCount'],
        },
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
            title: '',
            description: '',
            category: '',
            startDate: '',
            endDate: '',
            public: false,
            targetValue: '',
            currentValue: 0,
            unit: '',
            direction: 'Erhöhen',
            reminderInterval: 1,
            stepSize: 1,
            participationCount: 0,
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
                            placeholder='Gib deinem Ziel einen Namen'
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
                            placeholder='Beschreibe dein Ziel'
                        />
                    </div>
                );
            case 1:
                return (
                    <div className='space-y-6'>
                        <InputField
                            label='Startdatum'
                            id='startDate'
                            value={formData.startDate}
                            type='date'
                            icon={Calendar}
                            onChange={handleInputChange}
                            error={errors.startDate}
                        />
                        <InputField
                            label='Enddatum'
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
                            type='number'
                            icon={Target}
                            onChange={handleInputChange}
                            error={errors.targetValue}
                            placeholder='Gib den Zielwert ein'
                        />
                        <InputField
                            label='Aktueller Wert'
                            id='currentValue'
                            value={formData.currentValue}
                            type='number'
                            icon={Target}
                            onChange={handleInputChange}
                            error={errors.currentValue}
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
                        <InputField
                            label='Schrittgröße'
                            id='stepSize'
                            value={formData.stepSize}
                            type='number'
                            icon={MoveHorizontal}
                            onChange={handleInputChange}
                            error={errors.stepSize}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className='space-y-6'>
                        <InputField
                            label='Erinnerungsintervall (in Tagen)'
                            id='reminderInterval'
                            value={formData.reminderInterval}
                            type='number'
                            icon={Bell}
                            onChange={handleInputChange}
                            error={errors.reminderInterval}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className='space-y-6'>
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
        <DialogContainer onClose={onClose}>
            <div className='fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-90' />

            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div
                className='relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 
                          dark:border-white/10 shadow-xl w-full max-w-5xl mx-auto h-[800px] flex flex-col'
            >
                <div className='flex-none p-6 border-b border-gray-200/50'>
                    <div className='flex justify-between items-center mb-6'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <Flag className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    {goal
                                        ? 'Ziel bearbeiten'
                                        : 'Neues Ziel erstellen'}
                                </h2>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    {currentStep + 1} von {steps.length}{' '}
                                    Schritten
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors duration-200'
                        >
                            <X className='h-5 w-5 text-gray-600 dark:text-white/40' />
                        </button>
                    </div>

                    <div className='flex items-center gap-2'>
                        {steps.map((step, index) => (
                            <React.Fragment key={step.title}>
                                <div
                                    className={`flex items-center gap-2 ${
                                        index <= currentStep
                                            ? 'text-[#4785FF]'
                                            : 'text-gray-600 dark:text-white/40'
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-medium
                                        ${
                                            index <= currentStep
                                                ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white'
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40'
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
                                                ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'
                                                : 'bg-gray-200 dark:bg-white/10'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className='flex-1 p-6'>
                    {renderStepContent(currentStep)}
                </div>

                {/* Footer - Static */}
                <div className='flex-none p-6 border-t border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm'>
                    <div className='flex justify-between items-center'>
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
                                ${
                                    currentStep === 0
                                        ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-white/40'
                                        : 'text-gray-700 dark:text-white/70 hover:bg-gray-100/50 dark:hover:bg-white/5'
                                }`}
                        >
                            <ChevronLeft className='h-5 w-5' />
                            Zurück
                        </button>

                        {currentStep === steps.length - 1 ? (
                            <button
                                onClick={handleSave}
                                className='px-6 py-3 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white rounded-xl font-medium shadow-lg 
                                hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2'
                            >
                                <Save className='h-5 w-5' />
                                Speichern
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className='px-6 py-3 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white rounded-xl font-medium shadow-lg 
                                         hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                         transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2'
                            >
                                Weiter
                                <ChevronRight className='h-5 w-5' />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DialogContainer>
    );
};

export default EditGoalDialog;
