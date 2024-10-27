import React, { useState, useEffect } from 'react';
import { useCookies } from '../../context/CookieContext';

const CookieSettingsDialog = ({ onClose }) => {
    const { cookiePreferences, saveCookiePreferences } = useCookies();
    const [preferences, setPreferences] = useState(cookiePreferences);

    useEffect(() => {
        setPreferences(cookiePreferences);
    }, [cookiePreferences]);

    const handleToggle = (key) => {
        if (key === 'necessary') return; // Necessary cookies can't be toggled
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        saveCookiePreferences(preferences);
        onClose();
    };

    const ToggleSwitch = ({ label, description, isChecked, onChange, disabled }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {description}
                </p>
            </div>
            <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={onChange}
                    disabled={disabled}
                />
                <div 
                    className={`w-11 h-6 rounded-full peer 
                        ${isChecked ? 'bg-[#4785FF]' : 'bg-gray-200 dark:bg-gray-700'}
                        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                        after:transition-all ${isChecked ? 'after:translate-x-full' : ''}`}
                    onClick={() => !disabled && onChange()}
                ></div>
            </label>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Cookie-Einstellungen
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Hier können Sie Ihre Cookie-Präferenzen verwalten. Notwendige Cookies sind für die Grundfunktionen der Website erforderlich.
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    <ToggleSwitch
                        label="Notwendige Cookies"
                        description="Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden."
                        isChecked={true}
                        onChange={() => {}}
                        disabled={true}
                    />

                    <ToggleSwitch
                        label="Analyse Cookies"
                        description="Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren."
                        isChecked={preferences.analytics}
                        onChange={() => handleToggle('analytics')}
                        disabled={false}
                    />

                    <ToggleSwitch
                        label="Marketing Cookies"
                        description="Diese Cookies werden verwendet, um Werbung relevanter für Sie zu machen."
                        isChecked={preferences.marketing}
                        onChange={() => handleToggle('marketing')}
                        disabled={false}
                    />

                    <ToggleSwitch
                        label="Präferenz Cookies"
                        description="Diese Cookies ermöglichen der Website, sich an Ihre Einstellungen zu erinnern."
                        isChecked={preferences.preferences}
                        onChange={() => handleToggle('preferences')}
                        disabled={false}
                    />
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            Abbrechen
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 text-white bg-gradient-to-r from-[#4785FF] to-[#8c52ff] rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Einstellungen speichern
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieSettingsDialog;
