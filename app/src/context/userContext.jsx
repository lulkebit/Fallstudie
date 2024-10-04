import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!user) {
            axios
                .get('/profile')
                .then(({ data }) => {
                    setUser(data);
                })
                .catch((error) => {
                    console.error('Fehler beim Abrufen des Profils:', error);
                });
        }
    }, [user]);

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        document.cookie = `user=${JSON.stringify(updatedUser)}; path=/;`;
    };

    return (
        <UserContext.Provider value={{ user, setUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}
