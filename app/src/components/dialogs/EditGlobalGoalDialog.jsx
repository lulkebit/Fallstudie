import React, { useState, useEffect } from 'react';
import {
    X,
    CalendarRange,
    Target,
    Hash,
    Clock,
    Flag,
    Users,
    Ruler,
} from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

const InputField = ({
    label,
    id,
    value,
    type = 'text',
    icon: Icon,
    onChange,
    readOnly = false,
    ...props
}) => (
    <div className='space-y-1.5'>
        <label
            htmlFor={id}
            className='block text-sm font-medium text-gray-700 dark:text-white/70'
        >
            {label}
        </label>
        <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Icon className='h-5 w-5 text-gray-400 dark:text-white/40' />
            </div>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                        readOnly
                            ? 'bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-white/40'
                            : 'bg-white/50 dark:bg-white/5'
                    } border border-gray-200/50 dark:border-white/10 
                    focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 dark:focus:ring-[#4785FF]/10 
                    transition-all duration-200 outline-none backdrop-blur-sm
                    text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40`}
                    rows={4}
                    readOnly={readOnly}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                        readOnly
                            ? 'bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-white/40'
                            : 'bg-white/50 dark:bg-white/5'
                    } border border-gray-200/50 dark:border-white/10 
                    focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 dark:focus:ring-[#4785FF]/10 
                    transition-all duration-200 outline-none backdrop-blur-sm
                    text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40`}
                    readOnly={readOnly}
                    {...props}
                />
            )}
        </div>
    </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className='bg-white/30 dark:bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-white/10 space-y-4'>
        <div className='flex items-center gap-3'>
            <div
                className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#4785FF]/10 to-[#8c52ff]/10 
                          flex items-center justify-center'
            >
                <Icon className='w-5 h-5 text-[#4785FF]' />
            </div>
            <h3 className='font-medium text-gray-700 dark:text-white'>
                {title}
            </h3>
        </div>
        {children}
    </div>
);

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
        stepSize: 1,
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
                stepSize: goal.stepSize || 1,
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
        <DialogContainer onClose={onClose}>
            <div className='fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-90' />

            {/* Decorative Elements */}
            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div
                className='relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 
                          dark:border-white/10 shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20 
                          w-full max-w-4xl h-[900px] flex flex-col overflow-hidden'
            >
                {/* Header */}
                <div className='p-6 border-b border-gray-200/50 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <Flag className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    {isEditing
                                        ? 'Globales Ziel bearbeiten'
                                        : 'Neues globales Ziel erstellen'}
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    {isEditing
                                        ? 'Bearbeite die Details des globalen Ziels'
                                        : 'Erstelle ein neues globales Ziel'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl 
                                     transition-colors duration-200'
                        >
                            <X className='h-5 w-5 text-gray-400 dark:text-white/40' />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='space-y-6'>
                            <InputField
                                label='Titel'
                                id='title'
                                value={formData.title}
                                onChange={handleChange}
                                icon={Flag}
                                placeholder='Geben Sie einen Titel ein...'
                                required
                            />

                            <InputField
                                label='Beschreibung'
                                id='description'
                                value={formData.description}
                                onChange={handleChange}
                                type='textarea'
                                icon={Hash}
                                placeholder='Beschreiben Sie das Ziel...'
                            />
                        </div>

                        <SectionCard title='Zeitraum' icon={CalendarRange}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <InputField
                                    label='Startdatum'
                                    id='startDate'
                                    type='date'
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    icon={Clock}
                                    required
                                />
                                <InputField
                                    label='Enddatum'
                                    id='endDate'
                                    type='date'
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    icon={Clock}
                                    required
                                />
                            </div>
                        </SectionCard>

                        <SectionCard title='Zielwerte' icon={Target}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <InputField
                                    label='Zielwert'
                                    id='targetValue'
                                    type='number'
                                    value={formData.targetValue}
                                    onChange={handleChange}
                                    icon={Target}
                                    placeholder='0'
                                    required
                                />
                                <InputField
                                    label='Einheit'
                                    id='unit'
                                    value={formData.unit}
                                    onChange={handleChange}
                                    icon={Hash}
                                    placeholder='z.B. km, kg, Stunden...'
                                    required
                                />
                                <InputField
                                    label='Schrittgröße'
                                    id='stepSize'
                                    type='number'
                                    value={formData.stepSize}
                                    onChange={handleChange}
                                    icon={Ruler}
                                    required
                                />
                            </div>
                        </SectionCard>

                        {isEditing && (
                            <SectionCard title='Statistiken' icon={Users}>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <InputField
                                        label='Aktueller Wert'
                                        id='currentValue'
                                        type='number'
                                        value={formData.currentValue}
                                        icon={Target}
                                        readOnly
                                    />
                                    <InputField
                                        label='Teilnahmen'
                                        id='participationCount'
                                        type='number'
                                        value={formData.participationCount}
                                        icon={Users}
                                        readOnly
                                    />
                                </div>
                            </SectionCard>
                        )}
                    </form>
                </div>

                {/* Actions */}
                <div className='p-6 border-t border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm'>
                    <div className='flex justify-end gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-6 py-3 rounded-xl font-medium
                                text-gray-700 dark:text-white/70 
                                bg-gray-100/50 dark:bg-gray-900/50
                                hover:bg-gray-200/50 dark:hover:bg-white/5
                                border border-gray-200/50 dark:border-white/10
                                transition-all duration-200'
                        >
                            Abbrechen
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='px-6 py-3 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                   text-white rounded-xl font-medium shadow-lg 
                                   hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                   transition-all duration-200 hover:-translate-y-0.5'
                        >
                            {isEditing ? 'Aktualisieren' : 'Erstellen'}
                        </button>
                    </div>
                </div>
            </div>
        </DialogContainer>
    );
};

export default EditGlobalGoalDialog;
