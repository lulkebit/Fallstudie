import React, { useState, useEffect } from 'react';
import { useCookies } from '../../context/CookieContext';
import { X, Cookie, Shield, BarChart2, Target, Settings } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

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
                        ? 'bg-gradient-to-br from-[#4785FF] to-[#8c52ff]'
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
        <label
            className={`relative inline-flex items-center ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
        >
            <input
                type='checkbox'
                className='sr-only peer'
                checked={isChecked}
                onChange={onChange}
                disabled={disabled}
            />
            <div
                className={`w-11 h-6 rounded-full peer backdrop-blur-sm
                    ${
                        isChecked
                            ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'
                            : 'bg-gray-200/50 dark:bg-white/5'
                    }
                    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 dark:peer-focus:ring-blue-800/50 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all ${
                        isChecked ? 'after:translate-x-full' : ''
                    }
                    transition-colors duration-200`}
                onClick={() => !disabled && onChange()}
            ></div>
        </label>
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
                          w-full max-w-4xl h-[700px] flex flex-col overflow-hidden'
            >
                {/* Header */}
                <div className='p-6 border-b border-gray-200/50 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
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
                            className='px-6 py-3 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                   text-white rounded-xl font-medium shadow-lg 
                                   hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                   transition-all duration-200 hover:-translate-y-0.5'
                        >
                            Einstellungen speichern
                        </button>
                    </div>
                </div>
            </div>
        </DialogContainer>
    );
};

export default CookieSettingsDialog;
