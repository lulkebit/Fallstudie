import React, { createContext, useContext, useState, useCallback } from 'react';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
    const [dialogs, setDialogs] = useState([]);

    const addDialog = useCallback((dialog) => {
        setDialogs((prevDialogs) => [
            ...prevDialogs,
            { id: Date.now(), ...dialog },
        ]);
    }, []);

    const removeDialog = useCallback((id) => {
        setDialogs((prevDialogs) =>
            prevDialogs.filter((dialog) => dialog.id !== id)
        );
    }, []);

    // Create a wrapper component that will render the dialog component
    // This ensures the dialog component is rendered within all providers
    const DialogWrapper = ({ component: Component, props, id }) => {
        return <Component {...props} onClose={() => removeDialog(id)} />;
    };

    return (
        <DialogContext.Provider value={{ addDialog, removeDialog }}>
            {children}
            {/* Render dialogs within the provider hierarchy */}
            <div className='dialog-container'>
                {dialogs.map((dialog) => (
                    <DialogWrapper
                        key={dialog.id}
                        component={dialog.component}
                        props={dialog.props}
                        id={dialog.id}
                    />
                ))}
            </div>
        </DialogContext.Provider>
    );
};

export const useDialog = () => useContext(DialogContext);
