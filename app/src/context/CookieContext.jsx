import React, { createContext, useContext, useState, useEffect } from 'react';

const CookieContext = createContext();

export const useCookies = () => {
    const context = useContext(CookieContext);
    if (!context) {
        throw new Error('useCookies must be used within a CookieProvider');
    }
    return context;
};

export const CookieProvider = ({ children }) => {
    const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true, // Always true as these are essential
        analytics: false,
        marketing: false,
        preferences: false,
    });
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const savedPreferences = localStorage.getItem('cookiePreferences');
        if (!savedPreferences) {
            setShowBanner(true);
        } else {
            setCookiePreferences(JSON.parse(savedPreferences));
        }
    }, []);

    const saveCookiePreferences = (preferences) => {
        const newPreferences = { ...preferences, necessary: true };
        setCookiePreferences(newPreferences);
        localStorage.setItem(
            'cookiePreferences',
            JSON.stringify(newPreferences)
        );
        setShowBanner(false);
    };

    const acceptAllCookies = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
        };
        saveCookiePreferences(allAccepted);
    };

    const acceptNecessaryCookies = () => {
        const onlyNecessary = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
        };
        saveCookiePreferences(onlyNecessary);
    };

    return (
        <CookieContext.Provider
            value={{
                cookiePreferences,
                showBanner,
                setShowBanner,
                saveCookiePreferences,
                acceptAllCookies,
                acceptNecessaryCookies,
            }}
        >
            {children}
        </CookieContext.Provider>
    );
};

export default CookieContext;
