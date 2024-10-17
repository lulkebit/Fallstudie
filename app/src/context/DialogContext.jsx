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

    return (
        <DialogContext.Provider value={{ addDialog, removeDialog }}>
            {children}
            {dialogs.map((dialog) => (
                <dialog.component
                    key={dialog.id}
                    {...dialog.props}
                    onClose={() => removeDialog(dialog.id)}
                />
            ))}
        </DialogContext.Provider>
    );
};

export const useDialog = () => useContext(DialogContext);
