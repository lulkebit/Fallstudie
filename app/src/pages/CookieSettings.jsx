import React, { useState, useEffect } from 'react';
import { useCookies } from '../context/CookieContext';

const CookieSettings = () => {
    const { cookiePreferences, saveCookiePreferences } = useCookies();
    const [preferences, setPreferences] = useState(cookiePreferences);

    useEffect(() => {
        setPreferences(cookiePreferences);
    }, [cookiePreferences]);

    const handleToggle = (key) => {
        if (key === 'necessary') return; // Necessary cookies can't be toggled
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = () => {
        saveCookiePreferences(preferences);
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
            <div className='container mx-auto px-4'>
                <div className='max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg'>
                    <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                            Cookie-Einstellungen
                        </h1>
                        <p className='mt-2 text-gray-600 dark:text-gray-300'>
                            Hier kannst du deine Cookie-Präferenzen verwalten.
                            Notwendige Cookies sind für die Grundfunktionen der
                            Website erforderlich.
                        </p>
                    </div>

                    <div className='p-6 space-y-6'>
                        {/* Necessary Cookies */}
                        <div className='flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700'>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-white'>
                                    Notwendige Cookies
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>
                                    Diese Cookies sind für die Grundfunktionen
                                    der Website erforderlich und können nicht
                                    deaktiviert werden.
                                </p>
                            </div>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={preferences.necessary}
                                    disabled
                                    className='sr-only peer'
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#4785FF] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </div>
                        </div>

                        {/* Analytics Cookies */}
                        <div className='flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700'>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-white'>
                                    Analyse Cookies
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>
                                    Diese Cookies helfen uns zu verstehen, wie
                                    Besucher mit unserer Website interagieren.
                                </p>
                            </div>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={preferences.analytics}
                                    onChange={() => handleToggle('analytics')}
                                    className='sr-only peer'
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#4785FF] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all cursor-pointer"></div>
                            </div>
                        </div>

                        {/* Marketing Cookies */}
                        <div className='flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700'>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-white'>
                                    Marketing Cookies
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>
                                    Diese Cookies werden verwendet, um Werbung
                                    relevanter für dich zu machen.
                                </p>
                            </div>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={preferences.marketing}
                                    onChange={() => handleToggle('marketing')}
                                    className='sr-only peer'
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#4785FF] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all cursor-pointer"></div>
                            </div>
                        </div>

                        {/* Preference Cookies */}
                        <div className='flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700'>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-white'>
                                    Präferenz Cookies
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>
                                    Diese Cookies ermöglichen der Website, sich
                                    an deine Einstellungen zu erinnern.
                                </p>
                            </div>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={preferences.preferences}
                                    onChange={() => handleToggle('preferences')}
                                    className='sr-only peer'
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#4785FF] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all cursor-pointer"></div>
                            </div>
                        </div>
                    </div>

                    <div className='p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl'>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleSave}
                                className='px-6 py-2 text-white bg-gradient-to-r from-[#4785FF] to-[#8c52ff] rounded-lg hover:opacity-90 transition-opacity'
                            >
                                Einstellungen speichern
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieSettings;
