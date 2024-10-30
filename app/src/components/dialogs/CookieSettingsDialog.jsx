import React, { useState, useEffect } from 'react';
import { useCookies } from '../../context/CookieContext';
import { X, Cookie, Shield, BarChart2, Target, Settings } from 'lucide-react';

const ToggleSwitch = ({
    label,
    description,
    isChecked,
    onChange,
    disabled,
    icon: Icon,
}) => (
    <div className='flex items-center justify-between py-4 border-b border-gray-200/50 dark:border-white/10 last:border-0'>
        <div className='flex gap-4'>
            <div
                className={`w-10 h-10 rounded-xl ${
                    isChecked
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                        : 'bg-gray-100 dark:bg-white/5'
                } 
                flex items-center justify-center transition-colors duration-200`}
            >
                <Icon
                    className={`w-5 h-5 ${
                        isChecked
                            ? 'text-white'
                            : 'text-gray-400 dark:text-white/40'
                    }`}
                />
            </div>
            <div>
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                    {label}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {description}
                </p>
            </div>
        </div>
        <div
            className={`relative inline-flex items-center ${
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
        >
            <input
                type='checkbox'
                checked={isChecked}
                onChange={() => !disabled && onChange()}
                disabled={disabled}
                className='sr-only'
            />
            <div
                role='switch'
                aria-checked={isChecked}
                onClick={() => !disabled && onChange()}
                className={`
                    w-11 h-6 rounded-full 
                    transition-colors duration-200
                    ${
                        isChecked
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                            : 'bg-gray-200 dark:bg-white/5'
                    }
                    relative
                `}
            >
                <div
                    className={`
                        absolute top-0.5 left-0.5
                        w-5 h-5 rounded-full 
                        bg-white
                        shadow-sm
                        transform transition-transform duration-200
                        ${isChecked ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </div>
        </div>
    </div>
);

const DialogBackdrop = ({ children, onClose }) => (
    <div
        className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
    >
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
);

const CookieSettingsDialog = ({ onClose }) => {
    const { cookiePreferences, saveCookiePreferences } = useCookies();
    const [preferences, setPreferences] = useState(cookiePreferences);

    useEffect(() => {
        setPreferences(cookiePreferences);
    }, [cookiePreferences]);

    const handleToggle = (key) => {
        if (key === 'necessary') return;
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = () => {
        saveCookiePreferences(preferences);
        onClose();
    };

    return (
        <DialogBackdrop onClose={onClose}>
            <div className='fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-90' />

            {/* Decorative Elements */}
            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div
                className='relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 
                          dark:border-white/10 shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20 
                          w-full max-w-4xl h-[700px] flex flex-col overflow-hidden'
            >
                {/* Header */}
                <div className='p-6 border-b border-gray-200/50 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center'>
                                <Cookie className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Cookie-Einstellungen
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    Verwalte deine Cookie-Präferenzen
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
                <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                    <ToggleSwitch
                        label='Notwendige Cookies'
                        description='Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.'
                        isChecked={true}
                        onChange={() => {}}
                        disabled={true}
                        icon={Shield}
                    />

                    <ToggleSwitch
                        label='Analyse Cookies'
                        description='Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.'
                        isChecked={preferences.analytics}
                        onChange={() => handleToggle('analytics')}
                        disabled={false}
                        icon={BarChart2}
                    />

                    <ToggleSwitch
                        label='Marketing Cookies'
                        description='Diese Cookies werden verwendet, um Werbung relevanter für dich zu machen.'
                        isChecked={preferences.marketing}
                        onChange={() => handleToggle('marketing')}
                        disabled={false}
                        icon={Target}
                    />

                    <ToggleSwitch
                        label='Präferenz Cookies'
                        description='Diese Cookies ermöglichen der Website, sich an deine Einstellungen zu erinnern.'
                        isChecked={preferences.preferences}
                        onChange={() => handleToggle('preferences')}
                        disabled={false}
                        icon={Settings}
                    />
                </div>

                {/* Actions */}
                <div className='p-6 border-t border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm'>
                    <div className='flex justify-end gap-3'>
                        <button
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
                            onClick={handleSave}
                            className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                                   text-white rounded-xl font-medium shadow-lg 
                                   hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                   transition-all duration-200 hover:-translate-y-0.5'
                        >
                            Einstellungen speichern
                        </button>
                    </div>
                </div>
            </div>
        </DialogBackdrop>
    );
};

export default CookieSettingsDialog;
