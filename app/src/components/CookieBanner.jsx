import React from 'react';
import { useCookies } from '../context/CookieContext';
import { useDialog } from '../context/DialogContext';
import CookieSettingsDialog from './dialogs/CookieSettingsDialog';

const CookieBanner = () => {
    const { showBanner, acceptAllCookies, acceptNecessaryCookies } =
        useCookies();
    const { addDialog } = useDialog();

    if (!showBanner) return null;

    const openCookieSettings = () => {
        addDialog({
            component: CookieSettingsDialog,
        });
    };

    return (
        <div className='fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700'>
            <div className='container mx-auto px-4 py-6'>
                <div className='max-w-4xl mx-auto space-y-4'>
                    <div className='flex items-start gap-4'>
                        <div className='flex-1'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                Wir verwenden Cookies
                            </h3>
                            <p className='text-gray-600 dark:text-gray-300 text-sm'>
                                Wir nutzen Cookies, um Ihre Erfahrung auf
                                unserer Website zu verbessern. Einige davon sind
                                notwendig für den Betrieb der Seite, während
                                andere uns helfen, die Website und Ihre
                                Interaktion mit ihr zu verstehen.
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-4 justify-end'>
                        <button
                            onClick={acceptNecessaryCookies}
                            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        >
                            Nur notwendige Cookies
                        </button>
                        <button
                            onClick={openCookieSettings}
                            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        >
                            Einstellungen anpassen
                        </button>
                        <button
                            onClick={acceptAllCookies}
                            className='px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4785FF] to-[#8c52ff] rounded-lg hover:opacity-90 transition-opacity'
                        >
                            Alle akzeptieren
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
